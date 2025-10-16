import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    TextInput, 
    Switch, 
    Alert,
} from 'react-native';

import * as DocumentPicker from 'expo-document-picker'; 
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { useDecks } from '../DeckContext'; 
// 🚨 NEW: Import the useTheme hook 🚨
import { useTheme } from '../ThemeContext';


const GenerateScreen = () => {
    // --- Theme Context Hook ---
    const { colors, theme } = useTheme();

    // --- State Management ---
    const [deckName, setDeckName] = useState(''); 
    const [simpleDefinition, setSimpleDefinition] = useState(false);
    const [numberOfCards, setNumberOfCards] = useState(50); 
    const [selectedFileName, setSelectedFileName] = useState('No file selected'); 
    const [selectedFileUri, setSelectedFileUri] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);

    // --- Navigation and Global State Hooks ---
    const navigation = useNavigation();
    const { addDeck } = useDecks(); 

    // --- Functions (Unchanged) ---
    const handleSelectFile = async () => {
        if (isLoading) return;

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: [
                    'application/pdf',                   
                    'application/msword',                
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                ], 
                copyToCacheDirectory: true,
            });

            if (result.canceled === false) { 
                const file = result.assets[0];
                const fileName = file.name;
                
                setSelectedFileName(fileName);
                setSelectedFileUri(file.uri);
                
                const baseName = fileName.replace(/\.[^/.]+$/, "");
                setDeckName(baseName);
                
                Alert.alert("File Selected", `Ready to generate from ${fileName}`);

            } else {
                console.log('User cancelled file picker');
            }
        } catch (err) {
            Alert.alert("Error", "Could not select file. Please try again.");
            console.error('Document Picker Error:', err);
        }
    };

    const handleGenerateFlashcards = async () => {
        if (!deckName || selectedFileName === 'No file selected') {
            Alert.alert("Error", "Please select a file and enter a deck name.");
            return;
        }

        setIsLoading(true);

        try {
            // 🚨 MOCK BACKEND LOGIC 🚨
            Alert.alert("Generating...", "Simulating AI processing, please wait.");
            
            // SIMULATE AI processing delay
            await new Promise(resolve => setTimeout(resolve, 3000));
            
            // SIMULATE SUCCESSFUL RESPONSE
            const result = { success: true, cardCount: numberOfCards }; 

            if (result.success) {
                // 1. Update the global deck list
                addDeck({
                    deckName: deckName,
                    fileName: selectedFileName,
                    numberOfCards: result.cardCount,
                });
                
                Alert.alert("Success!", `AI generated ${result.cardCount} flashcards for deck: ${deckName}.`);
                
                // 2. Navigate to the dashboard to show the new deck
                navigation.navigate('Home'); // Navigate to the 'Home' tab name
            } else {
                Alert.alert("Generation Failed", "Simulated AI error: Could not process the document.");
            }
        } catch (error) {
            Alert.alert("Process Error", "An unexpected error occurred.");
            console.error("Generation Error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        // 🚨 Apply dynamic background color 🚨
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* 1. Select PDF File Button */}
            <TouchableOpacity 
                style={[
                    styles.selectFileButton, 
                    { backgroundColor: colors.primary }, // Default Primary Color
                    isLoading && styles.selectFileButtonDisabled // Overridden by disabled style if true
                ]} 
                onPress={handleSelectFile}
                disabled={isLoading}
            >
                <MaterialCommunityIcons name="cloud-upload-outline" size={24} color="#black" />
                <Text style={styles.selectFileButtonText}>Select PDF/DOC File</Text>
            </TouchableOpacity>

            {/* 2. Deck Name Input */}
            <Text style={[styles.label, { color: colors.text }]}>Deck Name</Text>
            <TextInput
                style={[
                    styles.textInput, 
                    { 
                        backgroundColor: colors.card, 
                        borderColor: colors.border,
                        color: colors.text
                    }
                ]}
                value={deckName}
                onChangeText={setDeckName}
                placeholder="Enter deck name"
                placeholderTextColor={colors.subtext}
                editable={!isLoading}
            />

            {/* 3. Generated From Indicator */}
            <Text style={[styles.generatedFromFileText, { color: colors.subtext }]}>
                Generated from "{selectedFileName}"
            </Text>

            {/* 4. Simple Definition Toggle */}
            <View style={[
                styles.optionRow, 
                { 
                    backgroundColor: colors.card, 
                    borderColor: colors.border 
                }
            ]}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Simple Definition</Text>
                <Switch
                    trackColor={{ false: colors.border, true: colors.primary }} // Use theme colors
                    thumbColor={theme === 'dark' ? colors.card : '#f4f3f4'} // Use white/light for thumb
                    onValueChange={setSimpleDefinition}
                    value={simpleDefinition}
                    disabled={isLoading}
                />
            </View>

            {/* 5. Number of Cards Slider */}
            <Text style={[styles.label, { color: colors.text }]}>Number of Cards ({Math.round(numberOfCards)} / 60)</Text>
            <Slider
                style={styles.slider}
                minimumValue={40}
                maximumValue={60}
                step={1}
                value={numberOfCards}
                onValueChange={setNumberOfCards}
                minimumTrackTintColor={colors.primary} // Use theme primary color
                maximumTrackTintColor={colors.border} // Use theme border color
                thumbTintColor={colors.primary} // Use theme primary color
                disabled={isLoading}
            />
            <Text style={[styles.sliderValueText, { color: colors.text }]}>{Math.round(numberOfCards)}</Text>

            {/* 6. Generate Flashcards Button */}
            <TouchableOpacity 
                style={[
                    styles.generateButton, 
                    { backgroundColor: colors.primary }, // Default Primary Color
                    (isLoading || selectedFileName === 'No file selected') && styles.generateButtonDisabled
                ]} 
                onPress={handleGenerateFlashcards}
                disabled={isLoading || selectedFileName === 'No file selected'}
            >
                <Text style={styles.generateButtonText}>
                    {isLoading ? 'Processing...' : 'Generate Flashcards'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

// 🚨 NOTE: StyleSheet.create is kept for structure, but hardcoded colors are 
// overridden inline in the JSX using the 'colors' object. 🚨
const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F5F5F5', // Overridden inline
        padding: 20,
        paddingTop: 40, 
      
    },
    selectFileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: '#007AFF', // Overridden inline
        padding: 15,
        borderRadius: 10,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
        marginTop: 20,
    },
    selectFileButtonDisabled: {
        backgroundColor: '#A0A0A0', // Darker gray for disabled state
    },
    selectFileButtonText: {
        color: 'black', // Should remain white for contrast against the primary color button
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        // color: '#333', // Overridden inline
        marginBottom: 8,
    },
    textInput: {
        // backgroundColor: '#FFFFFF', // Overridden inline
        borderWidth: 1,
        // borderColor: '#E0E0E0', // Overridden inline
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    generatedFromFileText: {
        fontSize: 14,
        // color: '#666', // Overridden inline
        textAlign: 'left',
        marginBottom: 25,
        fontStyle: 'italic',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: '#FFFFFF', // Overridden inline
        borderWidth: 1,
        // borderColor: '#E0E0E0', // Overridden inline
        borderRadius: 8,
        padding: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 1,
    },
    optionLabel: {
        fontSize: 16,
        // color: '#333', // Overridden inline
        fontWeight: '500',
    },
    slider: {
        width: '100%',
        height: 40,
        marginTop: 10,
        marginBottom: 5,
    },
    sliderValueText: {
        fontSize: 16,
        textAlign: 'center',
        // color: '#333', // Overridden inline
        marginBottom: 30,
    },
    generateButton: {
        // backgroundColor: '#007AFF', // Overridden inline
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 30, 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    generateButtonDisabled: {
        backgroundColor: '#A0A0A0', // Darker gray for disabled state
        opacity: 0.7,
    },
    generateButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default GenerateScreen;