// App.js (The main entry file for your application)
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// 1. Import TabNavigator and Auth Screens from the current directory
import TabNavigator from './TabNavigator'; 
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        // Start on the Login screen
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} 
      >
        
        {/* === Authentication Stack === */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
        {/* === Main App Content (The Tab Bar) === */}
        {/* When the user logs in, they will replace the current screen with this 'HomeTabs' screen.
            'HomeTabs' renders your entire bottom tab navigation system. */}
        <Stack.Screen name="HomeTabs" component={TabNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;