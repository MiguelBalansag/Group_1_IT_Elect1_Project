import React, { createContext, useState, useContext } from 'react';

let deckIdCounter = 100; 

export const DeckContext = createContext({
    decks: [],
    addDeck: () => {},
    removeDeck: () => {},
});

export const DeckProvider = ({ children }) => {
    const [decks, setDecks] = useState([]);
    const addDeck = (newDeckData) => {
        const newDeck = {
            id: deckIdCounter++, 
            title: newDeckData.deckName,
            source: newDeckData.fileName,
            cardCount: parseInt(newDeckData.numberOfCards),
            mastery: 0, 
            progress: 0, 
            status: 'New', 
        };
        setDecks(prevDecks => [newDeck, ...prevDecks]); 
        return newDeck;
    };
    
    const removeDeck = (deckId) => {
        setDecks(prevDecks => prevDecks.filter(deck => deck.id !== deckId));
    };

    return (

        <DeckContext.Provider value={{ decks, addDeck, removeDeck }}>
            {children}
        </DeckContext.Provider>
    );
};

export const useDecks = () => {
    return useContext(DeckContext);
};