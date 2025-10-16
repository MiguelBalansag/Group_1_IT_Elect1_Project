import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
// 🚨 Using Expo compatible icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit'; 
import { useDecks } from '../DeckContext'; 

const screenWidth = Dimensions.get('window').width;

// --- Mock Data for Progress Graph ---
const progressData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
        {
            data: [10, 22, 15, 40, 20, 35, 50], 
            color: (opacity = 1) => `rgba(42, 93, 255, ${opacity})`, 
            strokeWidth: 2,
        },
    ],
};

// Component to display mastery progress bar for a single deck
const MasteryDeckCard = ({ deck }) => {
    const answeredCorrectly = Math.round(deck.cardCount * (deck.progress / 100));
    const masteryColor = deck.mastery >= 80 ? '#4CAF50' : deck.mastery >= 50 ? '#FFC107' : '#FF5722';
    
    return (
        <View style={styles.masteryCard}>
            <View style={styles.masteryHeader}>
                <Text style={styles.masteryTitle}>{deck.title}</Text>
                <Text style={[styles.masteryPercent, { color: masteryColor }]}>{deck.mastery}%</Text>
            </View>
            <Text style={styles.masterySubtitle}>
                {answeredCorrectly} / {deck.cardCount} Cards Answered Correctly
            </Text>
            
            <View style={styles.progressBarContainer}>
                <View style={[
                    styles.progressBarFill, 
                    { width: `${deck.mastery}%`, backgroundColor: masteryColor }
                ]} />
            </View>
        </View>
    );
};


const ProgressScreen = () => {
    const { decks } = useDecks();

    // --- Calculations ---
    const totalCardsMastered = decks.reduce((sum, deck) => sum + Math.round(deck.cardCount * (deck.mastery / 100)), 0);
    const overallMasteryScore = decks.length > 0
        ? decks.reduce((sum, deck) => sum + deck.mastery, 0) / decks.length
        : 0;
    
    const studyStreak = 7; 
    const cardsDueToday = 15; 

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <Text style={styles.header}>Your Progress</Text>

            {/* Overall Stats Card */}
            <View style={styles.statsCard}>
                <Text style={styles.statText}>Total Cards Mastered: <Text style={styles.statValue}>{totalCardsMastered}</Text></Text>
                <Text style={styles.statText}>Current Study Streak: <Text style={styles.statValue}>{studyStreak} Days</Text></Text>
                <Text style={styles.statText}>Cards Due Today: <Text style={styles.statValue}>{cardsDueToday}</Text></Text>
                <Text style={styles.overallMasteryText}>Overall Mastery: <Text style={styles.overallMasteryValue}>{overallMasteryScore.toFixed(0)}%</Text></Text>
            </View>

            {/* Daily Progress Chart */}
            <Text style={styles.sectionTitle}>Daily Study Metrics (Last 7 Days)</Text>
            <View style={styles.chartContainer}>
                <LineChart
                    data={progressData}
                    width={screenWidth - 40} 
                    height={220}
                    chartConfig={{
                        backgroundColor: '#ffffff',
                        backgroundGradientFrom: '#ffffff',
                        backgroundGradientTo: '#ffffff',
                        decimalPlaces: 0,
                        color: (opacity = 1) => `rgba(42, 93, 255, ${opacity})`, 
                        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                        style: {
                            borderRadius: 16,
                        },
                        propsForDots: {
                            r: '6',
                            strokeWidth: '2',
                            stroke: '#2A5DFF',
                        },
                    }}
                    bezier
                    style={styles.chart}
                />
            </View>

            {/* Mastery Breakdown Section */}
            <Text style={styles.sectionTitle}>Mastery Percentage Breakdown</Text>
            <View style={styles.breakdownContainer}>
                {decks.map(deck => (
                    <MasteryDeckCard key={deck.id} deck={deck} />
                ))}
            </View>

            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        color: '#333',
        marginTop: Platform.OS === 'ios' ? 70 : 60,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    statsCard: {
        backgroundColor: '#FFFFFF',
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 15,
    },
    statText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 4,
    },
    statValue: {
        fontWeight: '700',
        color: '#333',
    },
    overallMasteryText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#2A5DFF',
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
    },
    overallMasteryValue: {
        fontSize: 20,
        fontWeight: '900',
    },
    chartContainer: {
        marginHorizontal: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingTop: 10,
        paddingBottom: 5,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    chart: {
        marginVertical: 8,
        borderRadius: 16,
    },
    breakdownContainer: {
        paddingHorizontal: 20,
    },
    masteryCard: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 5,
        borderLeftColor: '#2A5DFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    masteryHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    masteryTitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#333',
    },
    masteryPercent: {
        fontSize: 17,
        fontWeight: '900',
    },
    masterySubtitle: {
        fontSize: 13,
        color: '#777',
        marginBottom: 8,
    },
    progressBarContainer: {
        height: 8,
        backgroundColor: '#E0E0E0',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});

export default ProgressScreen;