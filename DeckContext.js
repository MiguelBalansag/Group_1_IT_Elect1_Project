import React, { createContext, useState, useContext } from 'react';

// Use a counter for ID generation (better to use Date.now() or a UUID for production)
let deckIdCounter = 100; 

// 1. Define the Context
// 🚨 FIX: Initialize context value to match the structure provided by the Provider
export const DeckContext = createContext({
    decks: [], // Initialize decks as an empty array here
    addDeck: () => {},
});

// 2. Define the Provider Component
export const DeckProvider = ({ children }) => {
    // 🚨 FIX: Initialize the state with an empty array. This replaces `initialDecks`. 🚨
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

    return (
        // 🚨 FIX: Pass the state variable `decks` and the function `addDeck` to the value 🚨
        <DeckContext.Provider value={{ decks, addDeck }}>
            {children}
        </DeckContext.Provider>
    );
};

// 3. Custom Hook for easy access
export const useDecks = () => {
    return useContext(DeckContext);
};