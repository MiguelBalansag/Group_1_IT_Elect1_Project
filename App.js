// App.js (The main entry file for your application)
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './screens/ProfileScreen'
import TabNavigator from './TabNavigator'; 
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { DeckProvider } from './DeckContext'; 
// 🚨 NEW: Import the ThemeProvider 🚨
import { ThemeProvider } from './ThemeContext';

const Stack = createStackNavigator();

// Component to wrap the main application tabs with the DeckProvider
const HomeTabsWithContext = () => (
  // Only the part of the app that needs the deck data is wrapped
  <DeckProvider>
    <TabNavigator />
  </DeckProvider>
);

function App() {
  return (
    // 🚨 WRAPPER: ThemeProvider must be outside NavigationContainer
    // to give context to all components/screens inside the navigator 🚨
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Login"
          screenOptions={{ headerShown: false }} 
        >
          
          {/* === Authentication Stack === */}
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />  
          
          {/* ProfileScreen also needs the theme to display settings and the toggle */}
          <Stack.Screen name="Profile" component={ProfileScreen} />
          
          {/* === Main App Content (The Tab Bar) === */}
          <Stack.Screen name="HomeTabs" component={HomeTabsWithContext} />
          
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
