import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TextInput, 
    TouchableOpacity, 
    Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useDecks } from '../DeckContext'; 
// 🚨 NEW: Import the useTheme hook (adjust path if needed)
import { useTheme } from '../ThemeContext'; 

// Helper component for the progress bar
// 🚨 UPDATED: Accepts theme colors for background 🚨
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

const DashboardScreen = () => {
    const navigation = useNavigation(); 
    // 🚨 NEW: Consume the theme context 🚨
    const { colors } = useTheme();
    
    // Get dynamic decks from context
    const { decks } = useDecks(); 
    const [searchText, setSearchText] = React.useState('');

    // 🚨 UPDATED: DeckCard now uses theme colors 🚨
    const DeckCard = ({ deck }) => {
        // Mastery colors remain hardcoded as they represent a specific status (Success/Warning/Error)
        const masteryColor = deck.mastery >= 75 ? colors.status : deck.mastery >= 50 ? '#FFC107' : '#F44336';
        
        return (
            // Apply card and border colors
            <TouchableOpacity style={[styles.card, { backgroundColor: colors.card, borderLeftColor: colors.primary }]}>
                {/* Apply text color */}
                <Text style={[styles.cardTitle, { color: colors.text }]}>{deck.title}</Text>
                
                {/* Apply subtext color */}
                <Text style={[styles.cardSource, { color: colors.subtext }]}>
                    {deck.status === 'Imported' ? 'Imported from' : 'Generated from'} "{deck.source}"
                </Text>
                
                <View style={styles.cardDetailsRow}>
                    {/* Apply text color */}
                    <Text style={[styles.cardDetailText, { color: colors.subtext }]}>{deck.cardCount} Cards</Text>
                    
                    <View style={styles.masteryContainer}>
                        <Text style={[styles.masteryText, { color: masteryColor }]}>
                            {deck.mastery}% Mastered
                        </Text>
                        {/* Pass theme colors to ProgressBar */}
                        <ProgressBar progress={deck.mastery} color={masteryColor} themeColors={colors} />
                    </View>
                </View>

                {/* Apply border and text colors */}
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

    return (
        // 🚨 Apply primary background color 🚨
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header: Apply text and icon color */}
            <View style={styles.header}>
                <Text style={[styles.welcomeText, { color: colors.text }]}>Welcome, Group1!</Text>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('Profile')} 
                    style={styles.profileIcon}
                >
                    <MaterialCommunityIcons name="account-circle-outline" size={30} color={colors.text} />
                </TouchableOpacity>
            </View>

            {/* Search Bar: Apply card, border, and subtext colors */}
            <View style={[styles.searchBarContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
            <ScrollView style={styles.deckList}>
                {decks.map(deck => (
                    <DeckCard key={deck.id} deck={deck} />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5F5F5', // Overridden inline
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
        // color: '#333', // Overridden inline
    },
    profileIcon: {
        padding: 5,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: '#FFFFFF', // Overridden inline
        borderRadius: 12,
        marginBottom: 25,
        paddingHorizontal: 10,
        borderWidth: 1,
        // borderColor: '#E0E0E0', // Overridden inline
        shadowColor: '#000',
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
        // color: '#333', // Overridden inline
    },
    deckList: {
        flex: 1,
        marginBottom: 20, 
    },
    card: {
        // backgroundColor: '#FFFFFF', // Overridden inline
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 5,
        // borderLeftColor: '#007AFF', // Overridden inline
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        // color: '#333', // Overridden inline
        marginBottom: 5,
    },
    cardSource: {
        fontSize: 13,
        // color: '#666', // Overridden inline
        marginBottom: 15,
    },
    cardDetailsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    cardDetailText: {
        fontSize: 14,
        // color: '#444', // Overridden inline
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
        // backgroundColor: '#E0E0E0', // Overridden inline
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
        // borderTopColor: '#F0F0F0', // Overridden inline
        marginTop: 5,
    },
    progressText: {
        fontSize: 14,
        // color: '#007AFF', // Overridden inline
        fontWeight: '600',
    },
    progressValue: {
        fontSize: 14,
        // color: '#666', // Overridden inline
    }
});

export default DashboardScreen;