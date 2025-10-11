import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

// 💡 Improvement: Added a timeout to simulate an asynchronous network request delay
const authenticateUser = async (email, password) => {
    // Simulate network latency (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000)); 

    if (email === 'group1@gmail.com' && password === '1234') {
        return { success: true, user: { name: 'Alex' } };
    } else {
        return { success: false, error: 'Invalid email or password.' };
    }
};

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // 🚨 Correction: You must declare the state for 'isLoading'
    const [isLoading, setLoading] = useState(false); 
    
    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("Error", "Please enter both email and password.");
            return;
        }

        setLoading(true);

        try {
            const result = await authenticateUser(email, password);

            if (result.success) {
                // 💡 Best Practice: 'replace' prevents the user from going back to the login screen
                navigation.replace('Dashboard'); 
            } else {
                Alert.alert("Login Failed", result.error);
            }
        } catch (error) {
            // Note: In a real scenario, network issues (like fetch failure) land here.
            Alert.alert("Network Error", "Could not connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!isLoading} // 💡 Improvement: Disable input during loading
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!isLoading} // 💡 Improvement: Disable input during loading
            />

            {/* 🚨 Correction: The core <Button> component does not support children.
                We change the title and disable the button instead of nesting the ActivityIndicator. */}
            <View style={styles.buttonWrapper}>
                <Button
                    title={isLoading ? 'Logging in...' : "Login"}
                    onPress={handleLogin}
                    color="#007AFF"
                    disabled={isLoading} // 💡 Improvement: Disable the button while loading
                />
            </View>
            
            <View style={styles.separator} />
            
            <Button
                title="Don't have an account? Sign Up"
                onPress={() => navigation.navigate('Register')}
                color="gray"
                disabled={isLoading} // 💡 Improvement: Disable other navigation while loading
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
    buttonWrapper: {
        marginBottom: 10,
    },
    separator: { 
        height: 15,
    },
});

export default LoginScreen;