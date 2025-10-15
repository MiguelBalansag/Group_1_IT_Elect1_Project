import React, { createContext, useState, useContext } from 'react';
let deckIdCounter = 100; 

// Initial mock data
const initialDecks = [
    {
        id: 1,
        title: 'Organic Chemistry Terms',
        source: 'Chem101.pdf',
        cardCount: 52,
        mastery: 80, // % mastered
        progress: 70, // % total progress
        status: 'Mastered',
    },
    {
        id: 2,
        title: 'Lord of the Mysteries',
        source: 'Lotm.pdf',
        cardCount: 40,
        mastery: 100,
        progress: 100,
        status: 'Mastered',
    },
];

// 1. Define the Context
export const DeckContext = createContext({
    decks: initialDecks,
    addDeck: () => {},
});

// 2. Define the Provider Component
export const DeckProvider = ({ children }) => {
    // State now holds the dynamic deck data
    const [decks, setDecks] = useState(initialDecks);

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
        <DeckContext.Provider value={{ decks, addDeck }}>
            {children}
        </DeckContext.Provider>
    );
};

// 3. Custom Hook for easy access
export const useDecks = () => {
    return useContext(DeckContext);
};