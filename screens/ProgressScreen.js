import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
// 🚨 Using Expo compatible icons
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit'; 
import { useDecks } from '../DeckContext'; 
// 🚨 NEW: Import the useTheme hook 🚨
import { useTheme } from '../ThemeContext';

const screenWidth = Dimensions.get('window').width;

// --- Mock Data for Progress Graph (Color is handled inside the chartConfig) ---
const progressData = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
        {
            data: [10, 22, 15, 40, 20, 35, 50], 
            // Color function will be overridden by the chartConfig
            color: (opacity = 1) => `rgba(42, 93, 255, ${opacity})`, 
            strokeWidth: 2,
        },
    ],
};

// Component to display mastery progress bar for a single deck
const MasteryDeckCard = ({ deck }) => {
    // 🚨 Use theme hook inside the component 🚨
    const { colors } = useTheme();

    const answeredCorrectly = Math.round(deck.cardCount * (deck.progress / 100));
    // Mastery color remains static based on progress, but uses theme colors for neutrals
    const masteryColor = deck.mastery >= 80 ? '#4CAF50' : deck.mastery >= 50 ? '#FFC107' : '#FF5722';
    
    return (
        // 🚨 Apply dynamic card and border colors 🚨
        <View style={[styles.masteryCard, { 
            backgroundColor: colors.card,
            borderLeftColor: masteryColor, // Left border uses mastery color
            shadowColor: colors.shadow,
        }]}>
            <View style={styles.masteryHeader}>
                <Text style={[styles.masteryTitle, { color: colors.text }]}>{deck.title}</Text>
                <Text style={[styles.masteryPercent, { color: masteryColor }]}>{deck.mastery}%</Text>
            </View>
            <Text style={[styles.masterySubtitle, { color: colors.subtext }]}>
                {answeredCorrectly} / {deck.cardCount} Cards Answered Correctly
            </Text>
            
            <View style={[styles.progressBarContainer, { backgroundColor: colors.border }]}>
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
    // 🚨 Use theme hook here 🚨
    const { colors } = useTheme();

    // --- Calculations ---
    const totalCardsMastered = decks.reduce((sum, deck) => sum + Math.round(deck.cardCount * (deck.mastery / 100)), 0);
    const overallMasteryScore = decks.length > 0
        ? decks.reduce((sum, deck) => sum + deck.mastery, 0) / decks.length
        : 0;
    
    const studyStreak = 7; 
    const cardsDueToday = 15; 
    
    // --- Chart Config: Dynamic Colors Applied Here ---
    const chartConfig = {
        // 🚨 Background and Label colors are theme-dependent 🚨
        backgroundColor: colors.card,
        backgroundGradientFrom: colors.card,
        backgroundGradientTo: colors.card,
        decimalPlaces: 0,
        // Line color uses theme primary color
        color: (opacity = 1) => colors.primary.replace(')', `, ${opacity}`).replace('rgb', 'rgba'), 
        // Label color uses theme text color
        labelColor: (opacity = 1) => colors.text.replace(')', `, ${opacity}`).replace('rgb', 'rgba'),
        style: {
            borderRadius: 16,
        },
        propsForDots: {
            r: '6',
            strokeWidth: '2',
            stroke: colors.primary, // Dots use primary color
        },
        propsForVerticalLabels: {
             fill: colors.text,
        },
        propsForHorizontalLabels: {
             fill: colors.text,
        },
    };


    return (
        // 🚨 Apply dynamic background color 🚨
        <ScrollView style={[styles.container, { backgroundColor: colors.background }]} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <Text style={[styles.header, { color: colors.text }]}>Your Progress</Text>

            {/* Overall Stats Card */}
            <View style={[styles.statsCard, { backgroundColor: colors.card, shadowColor: colors.shadow, borderTopColor: colors.border }]}>
                <Text style={[styles.statText, { color: colors.subtext }]}>Total Cards Mastered: <Text style={[styles.statValue, { color: colors.text }]}>{totalCardsMastered}</Text></Text>
                <Text style={[styles.statText, { color: colors.subtext }]}>Current Study Streak: <Text style={[styles.statValue, { color: colors.text }]}>{studyStreak} Days</Text></Text>
                <Text style={[styles.statText, { color: colors.subtext }]}>Cards Due Today: <Text style={[styles.statValue, { color: colors.text }]}>{cardsDueToday}</Text></Text>
                <Text style={[styles.overallMasteryText, { color: colors.primary, borderTopColor: colors.border }]}>Overall Mastery: <Text style={styles.overallMasteryValue}>{overallMasteryScore.toFixed(0)}%</Text></Text>
            </View>

            {/* Daily Progress Chart */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Daily Study Metrics (Last 7 Days)</Text>
            <View style={[styles.chartContainer, { backgroundColor: colors.card, shadowColor: colors.shadow }]}>
                <LineChart
                    data={progressData}
                    width={screenWidth - 40} 
                    height={220}
                    chartConfig={chartConfig} // 🚨 Use the dynamic config 🚨
                    bezier
                    style={styles.chart}
                />
            </View>

            {/* Mastery Breakdown Section */}
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Mastery Percentage Breakdown</Text>
            <View style={styles.breakdownContainer}>
                {decks.map((deck) => (
                    // MasteryDeckCard now uses useTheme internally
                    <MasteryDeckCard key={deck.id} deck={deck} />
                ))}
            </View>

            <View style={{ height: 50 }} />
        </ScrollView>
    );
};

// --- StyleSheet: Remove hardcoded colors that are overridden inline ---
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5F5F5', // Overridden inline
    },
    header: {
        fontSize: 28,
        fontWeight: '700',
        // color: '#333', // Overridden inline
        marginTop: Platform.OS === 'ios' ? 60 : 40,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        // color: '#333', // Overridden inline
        marginTop: 20,
        marginBottom: 10,
        paddingHorizontal: 20,
    },
    statsCard: {
        // backgroundColor: '#FFFFFF', // Overridden inline
        marginHorizontal: 20,
        padding: 20,
        borderRadius: 12,
        // shadowColor: '#000', // Overridden inline
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 15,
    },
    statText: {
        fontSize: 16,
        // color: '#666', // Overridden inline
        marginBottom: 4,
    },
    statValue: {
        fontWeight: '700',
        // color: '#333', // Overridden inline
    },
    overallMasteryText: {
        fontSize: 18,
        fontWeight: '600',
        // color: '#2A5DFF', // Overridden inline
        marginTop: 10,
        paddingTop: 8,
        borderTopWidth: 1,
        // borderTopColor: '#f0f0f0', // Overridden inline
    },
    overallMasteryValue: {
        fontSize: 20,
        fontWeight: '900',
    },
    chartContainer: {
        marginHorizontal: 20,
        // backgroundColor: '#FFFFFF', // Overridden inline
        borderRadius: 12,
        paddingTop: 10,
        paddingBottom: 5,
        alignItems: 'center',
        // shadowColor: '#000', // Overridden inline
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
        // backgroundColor: '#FFFFFF', // Overridden in MasteryDeckCard component
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderLeftWidth: 5,
        // borderLeftColor: '#2A5DFF', // Overridden in MasteryDeckCard component
        // shadowColor: '#000', // Overridden in MasteryDeckCard component
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
        // color: '#333', // Overridden in MasteryDeckCard component
    },
    masteryPercent: {
        fontSize: 17,
        fontWeight: '900',
        // color: static mastery color // Overridden in MasteryDeckCard component
    },
    masterySubtitle: {
        fontSize: 13,
        // color: '#777', // Overridden in MasteryDeckCard component
        marginBottom: 8,
    },
    progressBarContainer: {
        height: 8,
        // backgroundColor: '#E0E0E0', // Overridden in MasteryDeckCard component
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});

export default ProgressScreen;