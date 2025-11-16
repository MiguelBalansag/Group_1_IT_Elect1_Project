import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Dimensions,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../ThemeContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

const FlashcardStudyScreen = ({ route, navigation }) => {
    const { deck } = route.params;
    const { colors } = useTheme();
    
    const [flashcards, setFlashcards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [flipAnimation] = useState(new Animated.Value(0));

    useEffect(() => {
        loadFlashcards();
    }, []);

    const loadFlashcards = async () => {
        try {
            const flashcardsRef = collection(db, 'flashcards');
            const q = query(flashcardsRef, where('deckId', '==', deck.id));
            const querySnapshot = await getDocs(q);
            
            const cards = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            
            setFlashcards(cards);
            setLoading(false);
        } catch (error) {
            console.error('Error loading flashcards:', error);
            Alert.alert('Error', 'Could not load flashcards');
            setLoading(false);
        }
    };

    const handleFlip = () => {
        Animated.spring(flipAnimation, {
            toValue: isFlipped ? 0 : 180,
            friction: 8,
            tension: 10,
            useNativeDriver: true,
        }).start();
        setIsFlipped(!isFlipped);
    };

    const handleNext = () => {
        if (currentIndex < flashcards.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
            flipAnimation.setValue(0);
        } else {
            Alert.alert(
                'Deck Complete!',
                `You've reviewed all ${flashcards.length} cards in this deck.`,
                [
                    { text: 'Review Again', onPress: () => {
                        setCurrentIndex(0);
                        setIsFlipped(false);
                        flipAnimation.setValue(0);
                    }},
                    { text: 'Go Back', onPress: () => navigation.goBack() }
                ]
            );
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
            flipAnimation.setValue(0);
        }
    };

    const frontInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnimation.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const frontOpacity = flipAnimation.interpolate({
        inputRange: [89, 90],
        outputRange: [1, 0],
    });

    const backOpacity = flipAnimation.interpolate({
        inputRange: [89, 90],
        outputRange: [0, 1],
    });

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{deck.title}</Text>
                    <View style={{ width: 28 }} />
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={[styles.loadingText, { color: colors.text }]}>Loading flashcards...</Text>
                </View>
            </View>
        );
    }

    if (flashcards.length === 0) {
        return (
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.headerTitle, { color: colors.text }]}>{deck.title}</Text>
                    <View style={{ width: 28 }} />
                </View>
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="cards-outline" size={80} color={colors.subtext} />
                    <Text style={[styles.emptyText, { color: colors.text }]}>No flashcards in this deck</Text>
                </View>
            </View>
        );
    }

    const currentCard = flashcards[currentIndex];

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="arrow-left" size={28} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>{deck.title}</Text>
                <View style={{ width: 28 }} />
            </View>

            {/* Progress */}
            <View style={styles.progressContainer}>
                <Text style={[styles.progressText, { color: colors.text }]}>
                    Card {currentIndex + 1} of {flashcards.length}
                </Text>
                <View style={[styles.progressBar, { backgroundColor: colors.border }]}>
                    <View 
                        style={[
                            styles.progressFill, 
                            { 
                                width: `${((currentIndex + 1) / flashcards.length) * 100}%`,
                                backgroundColor: colors.primary 
                            }
                        ]} 
                    />
                </View>
            </View>

            {/* Flashcard */}
            <View style={styles.cardContainer}>
                <TouchableOpacity 
                    activeOpacity={0.9} 
                    onPress={handleFlip}
                    style={styles.cardTouchable}
                >
                    {/* Front of card */}
                    <Animated.View 
                        style={[
                            styles.card,
                            { backgroundColor: colors.card },
                            {
                                transform: [{ rotateY: frontInterpolate }],
                                opacity: frontOpacity,
                            }
                        ]}
                    >
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardLabel, { color: colors.primary }]}>QUESTION</Text>
                            <Text style={[styles.cardText, { color: colors.text }]}>
                                {currentCard.question}
                            </Text>
                            <Text style={[styles.tapHint, { color: colors.subtext }]}>
                                Tap to see answer
                            </Text>
                        </View>
                    </Animated.View>

                    {/* Back of card */}
                    <Animated.View 
                        style={[
                            styles.card,
                            styles.cardBack,
                            { backgroundColor: colors.primary },
                            {
                                transform: [{ rotateY: backInterpolate }],
                                opacity: backOpacity,
                            }
                        ]}
                    >
                        <View style={styles.cardContent}>
                            <Text style={[styles.cardLabel, { color: 'rgba(255,255,255,0.9)' }]}>ANSWER</Text>
                            <Text style={[styles.cardText, { color: '#FFFFFF' }]}>
                                {currentCard.answer}
                            </Text>
                            <Text style={[styles.tapHint, { color: 'rgba(255,255,255,0.7)' }]}>
                                Tap to see question
                            </Text>
                        </View>
                    </Animated.View>
                </TouchableOpacity>
            </View>

            {/* Navigation Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[
                        styles.navButton,
                        { backgroundColor: colors.card, borderColor: colors.border },
                        currentIndex === 0 && styles.navButtonDisabled
                    ]}
                    onPress={handlePrevious}
                    disabled={currentIndex === 0}
                >
                    <MaterialCommunityIcons 
                        name="chevron-left" 
                        size={32} 
                        color={currentIndex === 0 ? colors.subtext : colors.primary} 
                    />
                    <Text style={[
                        styles.navButtonText, 
                        { color: currentIndex === 0 ? colors.subtext : colors.text }
                    ]}>
                        Previous
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    style={[
                        styles.navButton,
                        { backgroundColor: colors.primary }
                    ]}
                    onPress={handleNext}
                >
                    <Text style={[styles.navButtonText, { color: '#FFFFFF' }]}>
                        {currentIndex === flashcards.length - 1 ? 'Finish' : 'Next'}
                    </Text>
                    <MaterialCommunityIcons 
                        name="chevron-right" 
                        size={32} 
                        color="#FFFFFF" 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 18,
        marginTop: 20,
    },
    progressContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    progressText: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 8,
        textAlign: 'center',
    },
    progressBar: {
        height: 8,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        borderRadius: 4,
    },
    cardContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    cardTouchable: {
        width: SCREEN_WIDTH - 40,
        height: SCREEN_HEIGHT * 0.5,
    },
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 20,
        backfaceVisibility: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    cardBack: {
        position: 'absolute',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 30,
    },
    cardLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 20,
    },
    cardText: {
        fontSize: 22,
        fontWeight: '600',
        textAlign: 'center',
        lineHeight: 32,
    },
    tapHint: {
        position: 'absolute',
        bottom: 30,
        fontSize: 14,
        fontStyle: 'italic',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingBottom: 30,
        gap: 15,
    },
    navButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderRadius: 12,
        borderWidth: 2,
        gap: 5,
    },
    navButtonDisabled: {
        opacity: 0.5,
    },
    navButtonText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default FlashcardStudyScreen;