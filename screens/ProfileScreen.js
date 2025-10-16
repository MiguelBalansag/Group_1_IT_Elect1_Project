import React, { useState } from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Switch, 
    TextInput,
    Alert,
    Platform,
    Image 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'; 
import { useTheme } from '../ThemeContext'; 

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { theme, colors, toggleTheme } = useTheme(); 
    const isDarkMode = theme === 'dark'; // Derived state from context

    const [allowNotifications, setAllowNotifications] = useState(true); 
    const [inputLink, setInputLink] = useState(''); 
    const [profileImage, setProfileImage] = useState(null); 

    const userData = {
        name: 'Group1',
        email: 'group1@gmail.com',
    };

    const handleEditProfile = async () => {
        // Request permission to access media library
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert(
                "Permission Denied",
                "Sorry, we need camera roll permissions to change the profile picture."
            );
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true, 
            aspect: [1, 1],      
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleInputLink = () => {
        Alert.alert("Input Link", `Link submitted: ${inputLink}`);
        console.log("Link submitted:", inputLink);
    };

    const handleNotificationSettings = () => {
        Alert.alert("Notification Settings", "Toggles handled directly on this screen.");
    };

    const handleToggleAppTheme = () => {
        toggleTheme(); 
        Alert.alert("Theme Change", `App Theme changed to ${!isDarkMode ? 'Dark' : 'Light'} Mode.`);
    };

    const handleLogout = () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                { text: "Logout", onPress: () => {
                    navigation.navigate('Login'); 
                    console.log("User logged out");
                }}
            ]
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: colors.background }]}>
            {/* Header: Apply dynamic text/icon color */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: colors.text }]}>Your Profile</Text>
                <View style={{ width: 24 }} /> 
            </View>
            
            {/* Profile Picture and Name */}
            <View style={styles.profileInfo}>
                {profileImage ? (
                    <Image source={{ uri: profileImage }} style={styles.profileImage} />
                ) : (
                    <MaterialCommunityIcons name="account-circle" size={100} color={isDarkMode ? colors.subtext : '#ccc'} />
                )}
                
                <TouchableOpacity onPress={handleEditProfile} style={[styles.editButton, { backgroundColor: colors.primary }]}>
                    {/* FIX 1: Ensure text is white for contrast against the primary button color */}
                    <Text style={[styles.editButtonText, { color: 'black' }]}>Edit</Text>
                </TouchableOpacity>
                <Text style={[styles.userName, { color: colors.text }]}>{userData.name}</Text>
                <Text style={[styles.userEmail, { color: colors.subtext }]}>{userData.email}</Text>
            </View>

            {/* Settings Options: Apply dynamic card and border colors */}
            <View style={[styles.settingsSection, { backgroundColor: colors.card, shadowColor: isDarkMode ? '#FFF' : '#000' }]}>
                {/* 1. Link Input */}
                <View style={[styles.settingItemContainer, { borderBottomColor: colors.border }]}>
                    <MaterialCommunityIcons name="link-variant" size={24} color={colors.subtext} style={styles.settingIcon} />
                    <TextInput
                        style={[styles.linkInput, { color: colors.text }]}
                        placeholder="Enter link (URL/code) to generate from"
                        placeholderTextColor={colors.subtext}
                        value={inputLink}
                        onChangeText={setInputLink}
                        keyboardType="url"
                        autoCapitalize="none"
        autoCorrect={false}
                    />
                    <TouchableOpacity onPress={handleInputLink} style={[styles.linkSubmitButton, { backgroundColor: colors.primary }]}>
                        {/* FIX 2: Correct property to 'color' and ensure it's white for contrast */}
                        <Text style={[styles.linkSubmitButtonText, { color: 'black' }]}>Go</Text>
                    </TouchableOpacity>
                </View>

                {/* 2. Notification Preferences */}
                <TouchableOpacity onPress={handleNotificationSettings} style={[styles.settingItem, { borderBottomColor: colors.border }]}>
                    <View style={styles.settingItemLeft}>
                        <MaterialCommunityIcons name="bell-outline" size={24} color={colors.subtext} style={styles.settingIcon} />
                        <Text style={[styles.settingText, { color: colors.text }]}>Notification Preferences</Text>
                    </View>
                    <Switch
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'} 
                        onValueChange={setAllowNotifications}
                        value={allowNotifications}
                        style={styles.settingSwitch}
                    />
                </TouchableOpacity>

                {/* 3. App Theme (Critical update for toggle) */}
                <TouchableOpacity onPress={handleToggleAppTheme} style={[styles.settingItem, { borderBottomWidth: 0 }]}>
                    <View style={styles.settingItemLeft}>
                        <MaterialCommunityIcons name="theme-light-dark" size={24} color={colors.subtext} style={styles.settingIcon} />
                        <Text style={[styles.settingText, { color: colors.text }]}>App Theme</Text>
                    </View>
                    <Switch
                        trackColor={{ false: colors.border, true: colors.primary }}
                        thumbColor={isDarkMode ? '#FFFFFF' : '#f4f3f4'} 
                        onValueChange={handleToggleAppTheme}
                        value={isDarkMode}
                        style={styles.settingSwitch}
                    />
                </TouchableOpacity>
            </View>

            {/* Logout Button */}
            <TouchableOpacity onPress={handleLogout} style={[styles.logoutButton, { backgroundColor: colors.logout }]}>
                {/* Ensure Logout text is white for contrast */}
                <Text style={[styles.logoutButtonText, { color: '#FFFFFF' }]}>Logout</Text>
            </TouchableOpacity>
        </View>
    );
};

// ... (rest of the StyleSheet remains the same, as the color overrides are now done inline)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: Platform.OS === 'ios' ? 50 : 30,
    },
    // --- Header ---
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
        marginTop: Platform.OS === 'ios' ? 60 : 40,
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    // --- Profile Info ---
    profileInfo: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: { 
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    editButton: {
        position: 'absolute',
        bottom: 50,
        right: '35%', 
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 2,
    },
    editButtonText: {
        // Kept for font size/weight, color is overridden inline
        fontSize: 12,
        fontWeight: '600',
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        marginTop: 10,
    },
    userEmail: {
        fontSize: 16,
    },
    // --- Settings Section ---
    settingsSection: {
        borderRadius: 12,
        marginBottom: 25,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        paddingVertical: 10,
    },
    settingItemContainer: { 
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    linkInput: {
        flex: 1,
        fontSize: 16,
        marginLeft: 10,
    },
    linkSubmitButton: {
        paddingHorizontal: 15,
        paddingVertical: 8,
        borderRadius: 8,
        marginLeft: 10,
    },
    linkSubmitButtonText: {
        // Kept for font size/weight, color is overridden i
        fontWeight: '600',
        fontSize: 15,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
    },
    settingItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1, 
    },
    settingIcon: {
        marginRight: 15,
    },
    settingText: {
        fontSize: 16,
        fontWeight: '500',
    },
    settingSwitch: {
        transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }], 
    },
    // --- Logout Button ---
    logoutButton: {
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    logoutButtonText: {
        // Kept for font size/weight, color is overridden inline
        fontSize: 18,
        fontWeight: '600',
    },
});

export default ProfileScreen;