import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TextInput, 
    TouchableOpacity, 
    Dimensions,
    Alert, 
    Share 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useDecks } from '../DeckContext';
import { useTheme } from '../ThemeContext'; 

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
    const { decks, removeDeck } = useDecks(); 
    const { colors } = useTheme(); 
    const [searchText, setSearchText] = React.useState('');
    const DeckCard = ({ deck }) => {
        const masteryColor = deck.mastery >= 75 ? '#4CAF50' : deck.mastery >= 50 ? '#FFC107' : '#F44336';

        const handleOptions = (deck) => {
            const deckCode = `DECK-${deck.id}`; 

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
                            Alert.alert(
                                "Confirm Removal",
                                `Are you sure you want to remove ${deck.title}? This cannot be undone.`,
                                [
                                    { text: "Cancel", style: 'cancel' },
                                    { 
                                        text: "Remove", 
                                        style: 'destructive', 
                                        onPress: () => removeDeck(deck.id)
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

                    <TouchableOpacity 
                        onPress={() => handleOptions(deck)} 
                        style={styles.optionsButton}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} 
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
            <View style={styles.header}>
                <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome, Group1!</Text>
                <TouchableOpacity style={styles.profileIcon} onPress={() => navigation.navigate('Profile')}>
                    <MaterialCommunityIcons name="account-circle-outline" size={30} color={colors.text} />
                </TouchableOpacity>
            </View>

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
    },
    profileIcon: {
        padding: 5,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 12,
        marginBottom: 25,
        paddingHorizontal: 10,
        borderWidth: 1,
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
    },
    deckList: {
        flex: 1,
        marginBottom: 20, 
    },
    card: {
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 5,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 5,
    },
    cardTitleContainer: {
        flex: 1, 
        paddingRight: 10,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
    },
    cardSource: {
        fontSize: 13,
        marginBottom: 10, 
    },
    optionsButton: {
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
        marginTop: 5,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
    },
    progressValue: {
        fontSize: 14,
    }
});

export default DashboardScreen;