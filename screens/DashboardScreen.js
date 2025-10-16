import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TextInput, 
    TouchableOpacity, 
    Dimensions,
    Alert, // 🚨 NEW: Import Alert for the menu
    Share // 🚨 NEW: Import Share for sharing functionality
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useDecks } from '../DeckContext';
import { useTheme } from '../ThemeContext'; // 🚨 NEW: Import useTheme

// Helper component for the progress bar
const ProgressBar = ({ progress, color, themeColors }) => {
    return (
        <View style={[styles.progressBarContainer, { backgroundColor: themeColors.border }]}>
            <View 
                style={[
                    styles.progressBarFill, 
                    { width: `${progress}%`, backgroundColor: color }
                ]} 
            />
        </View>
    );
};

const DashboardScreen = ({ navigation }) => {
    const { decks, removeDeck } = useDecks(); // 🚨 GET removeDeck
    const { colors } = useTheme(); // 🚨 Consume theme colors
    const [searchText, setSearchText] = React.useState('');
    
    // --- Deck Card Component ---
    const DeckCard = ({ deck }) => {
        const masteryColor = deck.mastery >= 75 ? '#4CAF50' : deck.mastery >= 50 ? '#FFC107' : '#F44336';
        
        // 🚨 NEW: Function to handle the 3-dot menu options 🚨
        const handleOptions = (deck) => {
            const deckCode = `DECK-${deck.id}`; // Simulated shareable code

            Alert.alert(
                deck.title,
                "Choose an action:",
                [
                    {
                        text: "Share Deck",
                        onPress: () => {
                            Share.share({
                                message: `Check out my flashcard deck: "${deck.title}". Use code: ${deckCode}`,
                                url: `yourApp.com/deck/${deckCode}` 
                            });
                        }
                    },
                    {
                        text: "Remove Deck",
                        style: 'destructive',
                        onPress: () => {
                            // Confirmation before permanent deletion
                            Alert.alert(
                                "Confirm Removal",
                                `Are you sure you want to remove ${deck.title}? This cannot be undone.`,
                                [
                                    { text: "Cancel", style: 'cancel' },
                                    { 
                                        text: "Remove", 
                                        style: 'destructive', 
                                        onPress: () => removeDeck(deck.id) // 🚨 CALL REMOVE FUNCTION 🚨
                                    }
                                ]
                            );
                        }
                    },
                    { text: "Cancel", style: 'cancel' }
                ]
            );
        };

        return (
            // 🚨 Applied dynamic colors 🚨
            <TouchableOpacity 
                style={[styles.card, { 
                    backgroundColor: colors.card,
                    borderLeftColor: masteryColor,
                    shadowColor: colors.shadow,
                }]}
            >
                <View style={styles.cardHeaderRow}>
                    <View style={styles.cardTitleContainer}>
                        <Text style={[styles.cardTitle, { color: colors.text }]}>{deck.title}</Text>
                        <Text style={[styles.cardSource, { color: colors.subtext }]}>
                            {deck.status === 'Imported' ? 'Imported from' : 'Generated from'} "{deck.source}"
                        </Text>
                    </View>

                    {/* 🚨 THE 3-DOT ICON BUTTON 🚨 */}
                    <TouchableOpacity 
                        onPress={() => handleOptions(deck)} 
                        style={styles.optionsButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Easier to tap
                    >
                        <MaterialCommunityIcons name="dots-vertical" size={24} color={colors.subtext} />
                    </TouchableOpacity>
                </View>
                
                <View style={styles.cardDetailsRow}>
                    <Text style={[styles.cardDetailText, { color: colors.subtext }]}>{deck.cardCount} Cards</Text>
                    
                    <View style={styles.masteryContainer}>
                        <Text style={[styles.masteryText, { color: masteryColor }]}>
                            {deck.mastery}% Mastered
                        </Text>
                        {/* 🚨 Pass theme colors to ProgressBar 🚨 */}
                        <ProgressBar progress={deck.mastery} color={masteryColor} themeColors={colors} /> 
                    </View>
                </View>

                <View style={[styles.progressRow, { borderTopColor: colors.border }]}>
                    <Text style={[styles.progressText, { color: colors.primary }]}>
                        {deck.status === 'Needs Review' ? 'Needs Review' : `${deck.progress}% Progress`}
                    </Text>
                    <Text style={[styles.progressValue, { color: colors.subtext }]}>
                         {deck.progress}%
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    const filteredDecks = decks.filter(deck => 
        deck.title.toLowerCase().includes(searchText.toLowerCase())
    );

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header: Welcome & Profile Icon */}
            <View style={styles.header}>
                <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome, Group1!</Text>
                <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
                    <MaterialCommunityIcons name="account-circle-outline" size={30} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={[styles.searchBarContainer, { backgroundColor: colors.card, borderColor: colors.border, shadowColor: colors.shadow }]}>
                <MaterialCommunityIcons name="magnify" size={24} color={colors.subtext} style={styles.searchIcon} />
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search decks..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor={colors.subtext}
                />
            </View>

            {/* Deck List */}
            <ScrollView style={styles.deckList} showsVerticalScrollIndicator={false}>
                {filteredDecks.map(deck => (
                    <DeckCard key={deck.id} deck={deck} />
                ))}
            </ScrollView>
    
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor handled by theme
        paddingHorizontal: 20,
        paddingTop: Dimensions.get('window').height > 800 ? 60 : 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 'bold',
        // color handled by theme
    },
    profileIcon: {
        padding: 5,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor handled by theme
        borderRadius: 12,
        marginBottom: 25,
        paddingHorizontal: 10,
        borderWidth: 1,
        // borderColor handled by theme
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 45,
        fontSize: 16,
        // color handled by theme
    },
    deckList: {
        flex: 1,
        marginBottom: 20, 
    },
    card: {
        // backgroundColor handled by theme
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 5,
        // borderLeftColor handled by logic
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    // 🚨 NEW Style to wrap title and options 🚨
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    // 🚨 NEW Style for the title container 🚨
    cardTitleContainer: {
        flex: 1, // Allow title to take up most space
        paddingRight: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        // color handled by theme
    },
    cardSource: {
        fontSize: 13,
        // color handled by theme
        marginBottom: 10, // Adjust margin since it's now inside title container
    },
    // 🚨 NEW Style for the options button 🚨
    optionsButton: {
        // No fixed width/height, just padding
        padding: 5,
    },
    cardDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    cardDetailText: {
        fontSize: 14,
        // color handled by theme
    },
    masteryContainer: {
        alignItems: 'flex-end',
        width: '50%',
    },
    masteryText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 5,
    },
    progressBarContainer: {
        height: 6,
        width: '100%',
        // backgroundColor handled by theme
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 3,
    },
    progressRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
        borderTopWidth: 1,
        // borderTopColor handled by theme
        marginTop: 5,
    },
    progressText: {
        fontSize: 14,
        // color handled by theme
        fontWeight: '600',
    },
    progressValue: {
        fontSize: 14,
        // color handled by theme
    }
});

export default DashboardScreen;