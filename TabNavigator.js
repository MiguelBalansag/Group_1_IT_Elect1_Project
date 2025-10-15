// TabNavigator.js

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'; // Now fully supported!
import { Platform } from 'react-native';

// Import your screen components (ensure these paths are correct)
import DashboardScreen from './screens/DashboardScreen';
import GenerateScreen from './screens/GenerateScreen';
import ProgressScreen from './screens/ProgressScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          // Define icon names for each tab
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Generate') {
            // Using 'add-circle' for the central "Generate" button/tab
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Progress') {
            // Using 'stats-chart' for the "Progress" tab
            iconName = focused ? 'stats-chart' : 'stats-chart-outline';
          }

          // Render the vector icon
          return <Icon name={iconName} size={size} color={color} />;
        },
        
        // --- VISUAL STYLING ---
        tabBarActiveTintColor: '#2A5DFF',   // Blue color for active tab
        tabBarInactiveTintColor: 'gray',     // Gray color for inactive tab
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          backgroundColor: '#FFFFFF',        // White background
          height: Platform.OS === 'ios' ? 90 : 60, // Adjust height for better look
          paddingBottom: Platform.OS === 'ios' ? 30 : 5, // Account for notch/safe area
          borderTopWidth: 0,                 // Remove default border line
          elevation: 10,                     // Shadow for Android
          shadowColor: '#000',               // Shadow for iOS
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
        },
        
        // Hide the header that the tab navigator adds to each screen
        headerShown: false,
      })}
    >
      {/* Tab Screens */}
      <Tab.Screen name="Home" component={DashboardScreen} />
      <Tab.Screen name="Generate" component={GenerateScreen} />
      <Tab.Screen name="Progress" component={ProgressScreen} />
    </Tab.Navigator>
  );
}

export default TabNavigator;