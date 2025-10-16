import React, { createContext, useState, useContext } from 'react';

// Use a counter for ID generation (better to use Date.now() or a UUID for production)
let deckIdCounter = 100; 

// 1. Define the Context
export const DeckContext = createContext({
    decks: [],
    addDeck: () => {},
    // 🚨 NEW: Add removeDeck function placeholder
    removeDeck: () => {},
});

// 2. Define the Provider Component
export const DeckProvider = ({ children }) => {
    const [decks, setDecks] = useState([]);

    // Function to add a newly generated deck
    const addDeck = (newDeckData) => {
        const newDeck = {
            id: deckIdCounter++, // Assign a new ID
            title: newDeckData.deckName,
            source: newDeckData.fileName,
            cardCount: parseInt(newDeckData.numberOfCards),
            mastery: 0, // Starts at 0%
            progress: 0, // Starts at 0%
            status: 'New', 
        };
        // Add the new deck to the front of the list
        setDecks(prevDecks => [newDeck, ...prevDecks]); 
        return newDeck;
    };
    
    // 🚨 NEW: Function to remove a deck by its ID 🚨
    const removeDeck = (deckId) => {
        setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
    };

    return (
        // 🚨 NEW: Include removeDeck in the context value 🚨
        <DeckContext.Provider value={{ decks, addDeck, removeDeck }}>
            {children}
        </DeckContext.Provider>
    );
};

// 3. Custom Hook for easy access
export const useDecks = () => {
    return useContext(DeckContext);
};