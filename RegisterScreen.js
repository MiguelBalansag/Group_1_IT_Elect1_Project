import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

// 🚨 Mock function: You must replace this with your actual API call (e.g., using fetch or a library like Axios)
const authenticateUser = async (name, email, password) => {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    // 🚨 Replace this logic with your actual server response handling
    if (name.length > 2 && email.includes('@') && password.length >= 4) {
        return { success: true };
    } else {
        return { success: false, error: "Invalid registration details or server error." };
    }
};

const RegisterScreen = () => {
    // Removed stray semicolon
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // 🚨 Added missing state for loading
    const [isLoading, setLoading] = useState(false); 
    
    const navigation = useNavigation();

    const handleRegister = async () => { // 💡 Renamed function from handleLogin to handleRegister
        if (!name || !email || !password) {
            Alert.alert("Error", "Please enter all necessary information.");
            return;
        }
        setLoading(true);

        try {
            // Changed to a standard registration check
            const result = await authenticateUser(name, email, password);

            if (result.success) { // 💡 Check the result object from the mock API call
                Alert.alert("Success", "Registration complete!");
                // 💡 Use replace to prevent the user from going 'back' to the Register screen
                navigation.replace('Dashboard'); 
            } else {
                Alert.alert("Registration Failed", result.error);
            }
        } catch (error) {
            Alert.alert("Network Error", "Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* 💡 Corrected keyboardType */}
            <TextInput
                style={styles.input}
                placeholder="Username"
                value={name}
                onChangeText={setName}
                keyboardType="default" 
                editable={!isLoading} // 💡 Disable input while loading
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading} // 💡 Disable input while loading
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading} // 💡 Disable input while loading
            />
            
            {/* 🚨 Use a custom TouchableOpacity button to display ActivityIndicator */}
            <View style={styles.buttonWrapper}>
                <Button
                    title={isLoading ? 'Loading...' : "Register"}
                    onPress={handleRegister}
                    color="#007AFF"
                    disabled={isLoading} // 💡 Disable button while loading
                />
            </View>

            <View style={styles.separator} />
            
            <Button
                title="Already have an account? Login" // 💡 Corrected typo
                onPress={() => navigation.navigate('Login')}
                color="gray"
                disabled={isLoading} // 💡 Disable button while loading
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        height: 50,
        borderColor: '#CCCCCC',
        borderWidth: 1,
        marginBottom: 15,
        paddingHorizontal: 10,
        borderRadius: 8,
    },
    separator: { 
        height: 15,
    },
    buttonWrapper: {
        marginBottom: 10,
    }
});

export default RegisterScreen;