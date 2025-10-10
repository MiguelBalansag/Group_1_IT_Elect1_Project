import React, { useState } from 'react';
import { View, TextInput, Button, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 

const authenticateUser = async (email, password) => {
    if (email === 'test@app.com' && password === 'password') {
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        return { success: true, user: { name: 'Alex' } };
    } else {
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        return { success: false, error: 'Invalid credentials' };
    }
  
};

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
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
                navigation.replace('Dashboard'); 
            } else {
                Alert.alert("Login Failed", result.error);
            }
        } catch (error) {
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
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button
                title={loading ? "" : "Login"}
                onPress={handleLogin}
                disabled={loading}
                color="#007AFF"
            >
        
                {loading && <ActivityIndicator color="#FFFFFF" />}
            </Button>
            <Button
                title="Don't have an account? Sign Up"
                onPress={() => navigation.navigate('Register')}
                disabled={loading}
                color="gray"
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
});

export default LoginScreen;