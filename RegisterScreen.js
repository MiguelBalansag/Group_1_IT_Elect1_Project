import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity, // Used for custom buttons
    Alert,
    ActivityIndicator,
    StyleSheet,
    SafeAreaView, // To ensure content fits under the notch/status bar
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';
// --- SIMULATED DATA & LOGIC ---

// 🚨 Mock function: Replace this with your actual API call
const registerUser = async (name, email, password) => {
    // Simulate a network delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 🚨 Replace this dummy validation with your actual server response logic
    if (name.length > 2 && email.includes('@') && password.length >= 4) {
        return { success: true };
    } else {
        return { success: false, error: 'Please check your details (Name > 2, Password > 3).' };
    }
};

// --- FLASH GENIUS REGISTER SCREEN ---

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false); // For the "Show" button

    const navigation = useNavigation();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }
        setLoading(true);

        try {
            const result = await registerUser(name, email, password);

            if (result.success) {
                Alert.alert('Success', 'Registration complete! You are now logged in.');
                // Use replace to move to the main app after successful registration
                navigation.replace('HomeTabs');
            } else {
                Alert.alert('Registration Failed', result.error);
            }
        } catch (error) {
            Alert.alert('Network Error', 'Could not connect to the server.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.container}>

                {/* App Logo/Title (Top center) */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>Flash<Text style={styles.logoGenius}>Genius</Text></Text>
                </View>

                {/* Welcome Message */}
                <Text style={styles.welcomeText}>Create Account</Text>

                {/* Username Input */}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Username"
                        value={name}
                        onChangeText={setName}
                        keyboardType="default"
                        editable={!isLoading}
                    />
                </View>

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
                      
                       <Text style={styles.showText}>Show</Text>
                        <Icon name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#777" />
                    </TouchableOpacity>
                </View>

                {/* Register Button */}
                <TouchableOpacity
                    style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.registerButtonText}>Register</Text>
                    )}
  </TouchableOpacity>

                {/* Login Link (at the bottom) */}
                <View style={styles.loginContainer}>
                    <Text style={styles.loginText}>Already have an account?</Text>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Login')}
                        disabled={isLoading}
                    >
                        <Text style={styles.loginLink}> Login</Text>
                    </TouchableOpacity>
                </View>

            </View>
        </SafeAreaView>
    );
};

// --- STYLESHEET (Replicated from Login Screen) ---

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    container: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: '20%',
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
        color: '#2A5DFF', // Blue color
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 60,
        marginBottom: 40,
        textAlign: 'center',
    },
    inputWrapper: {
        backgroundColor: '#F7F7F7',
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
    registerButton: {
        backgroundColor: '#2A5DFF',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20, 
    },
    registerButtonDisabled: {
        opacity: 0.7,
    },
    registerButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
    
    // Styling for the bottom Login link
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute', 
        bottom: 40,
        width: '100%',
        alignSelf: 'center',
    },
    loginText: {
        fontSize: 14,
        color: '#555',
    },
    loginLink: {
        fontSize: 14,
        color: '#2A5DFF',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;