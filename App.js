// App.js (The main entry file for your application)
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TabNavigator from './TabNavigator'; 
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import { DeckProvider } from './DeckContext'; 

const Stack = createStackNavigator();

// Component to wrap the main application tabs with the DeckProvider
const HomeTabsWithContext = () => (
  // 🚨 Only the part of the app that needs the deck data is wrapped 🚨
  <DeckProvider>
    <TabNavigator />
  </DeckProvider>
);

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} 
      >
<<<<<<< HEAD
        
        {/* === Authentication Stack (No Context needed here) === */}
=======
 >>>>>>>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />        
        {/* === Main App Content (The Tab Bar) === */}
        {/* We use the custom wrapper component defined above */}
        <Stack.Screen name="HomeTabs" component={HomeTabsWithContext} />
        <Stack.Screen name="HomeTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
