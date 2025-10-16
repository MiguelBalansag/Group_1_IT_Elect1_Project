import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Platform } from 'react-native';

// 🚨 NEW: Import the useTheme hook 🚨
import { useTheme } from './ThemeContext'; 

// Import your screen components (ensure these paths are correct)
import DashboardScreen from './screens/DashboardScreen';
import GenerateScreen from './screens/GenerateScreen';
import ProgressScreen from './screens/ProgressScreen';

const Tab = createBottomTabNavigator();

function TabNavigator() {
  // 🚨 Consume the theme context 🚨
  const { colors, theme } = useTheme();

  // Define dynamic colors based on the theme context
  const activeColor = colors.primary;
  const inactiveColor = colors.subtext;
  const tabBarBackgroundColor = colors.card;
  const tabBarBorderColor = colors.border;
  
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
            iconName = focused ? 'file-upload' : 'file-upload-outline';
          } else if (route.name === 'Progress') {
            // Using 'stats-chart' for the "Progress" tab
            iconName = focused ? 'chart-line' : 'chart-line-variant';
          }

          // Render the vector icon
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        
        // --- VISUAL STYLING ---
        // 🚨 Dynamic Colors Applied Here 🚨
        tabBarActiveTintColor: activeColor,   
        tabBarInactiveTintColor: inactiveColor,     
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
        tabBarStyle: {
          // 🚨 Apply dynamic background and border colors 🚨
          backgroundColor: tabBarBackgroundColor,        
          borderTopColor: tabBarBorderColor,
          
          height: Platform.OS === 'ios' ? 90 : 60, 
          paddingBottom: Platform.OS === 'ios' ? 30 : 5, 
          borderTopWidth: 1,                 // Changed from 0 so border color can show up
          elevation: 10,                     
          shadowColor: '#000',               
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 5,
        },
        
        // Hide the header that the tab navigator adds to each screen
        headerShown: false,
        
        // Optional: Style the screen container background itself if needed
        contentStyle: {
            backgroundColor: colors.background,
        }
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