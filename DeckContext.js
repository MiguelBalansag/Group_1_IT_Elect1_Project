import React, { createContext, useState, useContext, useEffect } from 'react';
import { collection, addDoc, deleteDoc, doc, onSnapshot, query, orderBy, where } from 'firebase/firestore';
import { db, auth } from './firebaseConfig';

export const DeckContext = createContext({
    decks: [],
    addDeck: () => {},
    removeDeck: () => {},
    loading: false,
});

export const DeckProvider = ({ children }) => {
    const [decks, setDecks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Listen to real-time updates from Firestore
    useEffect(() => {
        if (!auth.currentUser) {
            setDecks([]);
            setLoading(false);
            return;
        }

        const decksRef = collection(db, 'decks');
        const q = query(
            decksRef, 
            where('userId', '==', auth.currentUser.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const decksList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDecks(decksList);
            setLoading(false);
        }, (error) => {
            console.error('Error fetching decks:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [auth.currentUser]);

    const addDeck = async (newDeckData) => {
        try {
            if (!auth.currentUser) {
                throw new Error('User not authenticated');
            }

            const newDeck = {
                userId: auth.currentUser.uid,
                title: newDeckData.deckName,
                source: newDeckData.fileName,
                cardCount: parseInt(newDeckData.numberOfCards),
                mastery: 0,
                progress: 0,
                status: newDeckData.status || 'New',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const docRef = await addDoc(collection(db, 'decks'), newDeck);
            
            return {
                id: docRef.id,
                ...newDeck
            };
        } catch (error) {
            console.error('Error adding deck:', error);
            throw error;
        }
    };
    
    const removeDeck = async (deckId) => {
        try {
            await deleteDoc(doc(db, 'decks', deckId));
        } catch (error) {
            console.error('Error removing deck:', error);
            throw error;
        }
    };

    return (
        <DeckContext.Provider value={{ decks, addDeck, removeDeck, loading }}>
            {children}
        </DeckContext.Provider>
    );
};

export const useDecks = () => {
    return useContext(DeckContext);
};