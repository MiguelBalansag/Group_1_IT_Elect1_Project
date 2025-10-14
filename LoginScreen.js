import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity, // Used for custom buttons
    Alert,
    ActivityIndicator,
    StyleSheet,
    Image,
    SafeAreaView, // To ensure content fits under the notch/status bar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// --- SIMULATED DATA & LOGIC ---

// Simulate an asynchronous network request delay
const authenticateUser = async (email, password) => {
    // Simulate network latency (2 seconds)
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simple dummy authentication logic
    if (email === 'group1@gmail.com' && password === '1234') {
        return { success: true, user: { name: 'Alex' } };
    } else {
        return { success: false, error: 'Invalid email or password.' };
    }
};

// --- FLASH GENIUS LOGIN SCREEN ---

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // State for the "Show" button

    const navigation = useNavigation();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please enter both email and password.');
            return;
        }

        setLoading(true);

        try {
            const result = await authenticateUser(email, password);

            if (result.success) {
                // In a real app, this would replace the AuthStack with the TabNavigator
                navigation.replace('HomeTabs'); 
            } else {
                Alert.alert('Login Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Network Error', 'Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Use SafeAreaView for better layout on modern phones
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>
                
                {/* App Logo/Title (Top center) */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Flash<Text style={styles.logoGenius}>Genius</Text></Text>
                    {/*  */}
                </View>

                {/* Welcome Back Text */}
                <Text style={styles.welcomeText}>Welcome Back!</Text>

                {/* Email Input */}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!isLoading}
                    />
                </View>

                {/* Password Input with "Show" button */}
                <View style={[styles.inputWrapper, styles.passwordWrapper]}>
                    <TextInput
                        style={styles.input}
                        placeholder="Password"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={!showPassword}
                        editable={!isLoading}
                    />
                    <TouchableOpacity
                        style={styles.showButton}
                        onPress={() => setShowPassword(!showPassword)}
                        disabled={isLoading}
                    >
                        {/* The 'Show' text and circular icon */}
                        <Text style={styles.showText}>Show</Text>
                        <MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#777" />
                    </TouchableOpacity>
                </View>

                {/* Login Button */}
                <TouchableOpacity
                    style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
                    onPress={handleLogin}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.loginButtonText}>Login</Text>
                    )}
                </TouchableOpacity>
                
                {/* Sign Up Link (at the bottom) */}
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpText}>Don't have you account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Register')}
                        disabled={isLoading}
                    >
                        <Text style={styles.signUpLink}> Sign Up</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
};

// --- STYLESHEET ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: '20%', // Spacing from the top
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 50,
        marginBottom: 50,
    },
    logoText: {
        fontSize: 30,
        fontWeight: '900',
        color: '#000000',
    },
    logoGenius: {
        color: '#2A5DFF', 
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 60,
        marginTop: 40,
        textAlign: 'center',
    },
    inputWrapper: {
        backgroundColor: '#F7F7F7', // Light gray background
        borderRadius: 10,
        marginBottom: 20,
        height: 55,
        justifyContent: 'center',
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#EAEAEA',
    },
    input: {
        flex: 1,
        fontSize: 16,
        padding: 0,
    },
    passwordWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    showButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 10,
    },
    showText: {
        fontSize: 14,
        color: '#777',
        marginRight: 5,
    },
    loginButton: {
        backgroundColor: '#2A5DFF', // The dark blue color from the image
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonDisabled: {
        opacity: 0.7,
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    linkButton: {
        alignSelf: 'flex-end',
        marginTop: 15,
        marginBottom: 100, // Push the sign-up link down
    },
    forgotPasswordText: {
        color: '#555',
        fontSize: 14,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', 
        bottom: 40,
        width: '100%',
        alignSelf: 'center',
    },
    signUpText: {
        fontSize: 14,
        color: '#555',
    },
    signUpLink: {
        fontSize: 14,
        color: '#2A5DFF', // Matching the primary button color
        fontWeight: 'bold',
    },
});

export default LoginScreen;