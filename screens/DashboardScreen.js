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
// 🚨 Using Expo compatible icons
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { useDecks } from '../DeckContext'; // 🚨 Consume Context

// Helper component for the progress bar
const ProgressBar = ({ progress, color }) => {
    return (
        <View style={styles.progressBarContainer}>
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
    // Get dynamic decks from context
    const { decks } = useDecks(); 
    const [searchText, setSearchText] = React.useState('');

    const DeckCard = ({ deck }) => {
        const masteryColor = deck.mastery >= 75 ? '#4CAF50' : deck.mastery >= 50 ? '#FFC107' : '#F44336';
        
        return (
            <TouchableOpacity style={styles.card}>
                <Text style={styles.cardTitle}>{deck.title}</Text>
                
                <Text style={styles.cardSource}>
                    {deck.status === 'Imported' ? 'Imported from' : 'Generated from'} "{deck.source}"
                </Text>
                
                <View style={styles.cardDetailsRow}>
                    <Text style={styles.cardDetailText}>{deck.cardCount} Cards</Text>
                    
                    <View style={styles.masteryContainer}>
                        <Text style={[styles.masteryText, { color: masteryColor }]}>
                            {deck.mastery}% Mastered
                        </Text>
                        <ProgressBar progress={deck.mastery} color={masteryColor} />
                    </View>
                </View>

                <View style={styles.progressRow}>
                    <Text style={styles.progressText}>
                        {deck.status === 'Needs Review' ? 'Needs Review' : `${deck.progress}% Progress`}
                    </Text>
                    <Text style={styles.progressValue}>
                         {deck.progress}%
                    </Text>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header: Welcome & Profile Icon */}
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome, Group1!</Text>
                <TouchableOpacity style={styles.profileIcon}>
                    {/* 🚨 Expo Icon usage */}
                    <MaterialCommunityIcons name="account-circle-outline" size={30} color="#333" />
                </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View style={styles.searchBarContainer}>
                {/* 🚨 Expo Icon usage */}
                <MaterialCommunityIcons name="magnify" size={24} color="#757575" style={styles.searchIcon} />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search decks..."
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholderTextColor="#757575"
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
        backgroundColor: '#F5F5F5',
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
        color: '#333',
    },
    profileIcon: {
        padding: 5,
    },
    searchBarContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 25,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#E0E0E0',
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
        color: '#333',
    },
    deckList: {
        flex: 1,
        marginBottom: 20, 
    },
    card: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 12,
        marginBottom: 15,
        borderLeftWidth: 5,
        borderLeftColor: '#007AFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#333',
        marginBottom: 5,
    },
    cardSource: {
        fontSize: 13,
        color: '#666',
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
        color: '#444',
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
        backgroundColor: '#E0E0E0',
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
        borderTopColor: '#F0F0F0',
        marginTop: 5,
    },
    progressText: {
        fontSize: 14,
        color: '#007AFF',
        fontWeight: '600',
    },
    progressValue: {
        fontSize: 14,
        color: '#666',
    }
});

export default DashboardScreen;