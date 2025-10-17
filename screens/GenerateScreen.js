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
import { useTheme } from '../ThemeContext';


const GenerateScreen = () => {
    const { colors, theme } = useTheme();
    const [deckName, setDeckName] = useState(''); 
    const [simpleDefinition, setSimpleDefinition] = useState(false);
    const [numberOfCards, setNumberOfCards] = useState(35); 
    const [selectedFileName, setSelectedFileName] = useState('No file selected'); 
    const [selectedFileUri, setSelectedFileUri] = useState(null); 
    const [isLoading, setIsLoading] = useState(false);
    const navigation = useNavigation();
    const { addDeck } = useDecks(); 
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
            Alert.alert("Generating...", "Simulating AI processing, please wait.");
  
            await new Promise(resolve => setTimeout(resolve, 3000));

            
            // SIMULATE AI processing delay
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // SIMULATE SUCCESSFUL RESPONSE
            const result = { success: true, cardCount: numberOfCards }; 

            if (result.success) {
                addDeck({
                    deckName: deckName,
                    fileName: selectedFileName,
                    numberOfCards: result.cardCount,
                });
                
                Alert.alert("Success!", `AI generated ${result.cardCount} flashcards for deck: ${deckName}.`);
  
                navigation.navigate('Home'); 
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
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            <TouchableOpacity 
                style={[
                    styles.selectFileButton, 
                    { backgroundColor: colors.primary }, 
                    isLoading && styles.selectFileButtonDisabled 
                ]} 
                onPress={handleSelectFile}
                disabled={isLoading}
            >
                <MaterialCommunityIcons name="cloud-upload-outline" size={24} color="#black" />
                <Text style={styles.selectFileButtonText}>Select PDF/DOC File</Text>
            </TouchableOpacity>
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

            <Text style={[styles.generatedFromFileText, { color: colors.subtext }]}>
                Generated from "{selectedFileName}"
            </Text>

            <View style={[
                styles.optionRow, 
                { 
                    backgroundColor: colors.card, 
                    borderColor: colors.border 
                }
            ]}>
                <Text style={[styles.optionLabel, { color: colors.text }]}>Simple Definition</Text>
                <Switch
                    trackColor={{ false: colors.border, true: colors.primary }} 
                    thumbColor={theme === 'dark' ? colors.card : '#f4f3f4'} 
                    onValueChange={setSimpleDefinition}
                    value={simpleDefinition}
                    disabled={isLoading}
                />
            </View>
            <Text style={[styles.label, { color: colors.text }]}>Number of Cards ({Math.round(numberOfCards)} / 60)</Text>
            <Slider
                style={styles.slider}
                minimumValue={10}
                maximumValue={60}
                step={1}
                value={numberOfCards}
                onValueChange={setNumberOfCards}
                minimumTrackTintColor={colors.primary} 
                maximumTrackTintColor={colors.border} 
                thumbTintColor={colors.primary} 
                disabled={isLoading}
            />
            <Text style={[styles.sliderValueText, { color: colors.text }]}>{Math.round(numberOfCards)}</Text>

            <TouchableOpacity 
                style={[
                    styles.generateButton, 
                    { backgroundColor: colors.primary }, 
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 40, 
      
    },
    selectFileButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
        color: 'black', 
        fontSize: 18,
        fontWeight: '600',
        marginLeft: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    textInput: {
        borderWidth: 1,
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
        textAlign: 'left',
        marginBottom: 25,
        fontStyle: 'italic',
    },
    optionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
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
        marginBottom: 30,
    },
    generateButton: {
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
        backgroundColor: '#A0A0A0', 
        opacity: 0.7,
    },
    generateButtonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default GenerateScreen;