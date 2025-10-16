import React, { createContext, useState, useContext, useEffect } from 'react';
import { Appearance } from 'react-native';
// You can optionally use AsyncStorage/SecureStore to persist the preference

// 1. Define your original Light Mode (Multi-Color)
const lightTheme = {
    primary: '#007AFF',      // Blue (Main interactive color)
    secondary: '#FF9500',    // Orange (Accent color)
    background: '#F5F5F5',   // Light gray background
    card: '#FFFFFF',         // White card/container
    text: '#333333',         // Dark text
    subtext: '#666666',      // Gray subtext
    border: '#E0E0E0',        // Light border
    status: '#4CAF50',       // Success/Mastery color
    logout: '#FF3B30',       // Red for danger/logout
};

// 2. Define the new Dark Mode (Strict Black & White)
const darkTheme = {
    primary: '#FFFFFF',      // White (Used for main interactive elements/icons)
    secondary: '#BBBBBB',    // Light Gray for accents
    background: '#000000',   // Pure Black background
    card: '#1E1E1E',         // Very Dark Gray card/container
    text: '#FFFFFF',         // White text
    subtext: '#AAAAAA',      // Gray subtext
    border: '#333333',        // Darker border
    status: '#FFFFFF',       // White for status/mastery indicator
    logout: '#FF3B30',       // Red is often kept for universal warning/danger colors
};

// 3. Create the Context
const ThemeContext = createContext();

// 4. Create the Provider Component
export const ThemeProvider = ({ children }) => {
    // Get the initial system preference
    const colorScheme = Appearance.getColorScheme();
    const initialMode = colorScheme === 'dark' ? 'dark' : 'light';

    const [theme, setTheme] = useState(initialMode);
    
    // Automatically use the correct colors based on the state
    const currentColors = theme === 'light' ? lightTheme : darkTheme;

    // Optional: Sync theme state with system preference on first load or change
    useEffect(() => {
        const subscription = Appearance.addChangeListener(({ colorScheme }) => {
            // Only update if the user hasn't manually set a preference (though we are ignoring persistence here)
            setTheme(colorScheme === 'dark' ? 'dark' : 'light');
        });
        return () => subscription.remove();
    }, []);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <ThemeContext.Provider value={{ theme, colors: currentColors, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// 5. Custom Hook to easily consume the theme
export const useTheme = () => useContext(ThemeContext);