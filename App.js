// App.js (The main entry file for your application)
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

// Import your screen components
import LoginScreen from './LoginScreen';      // The code you provided
import DashboardScreen from './DashboardScreen'; // You must create this file
import RegisterScreen from './RegisterScreen';   // You must create this file

// 1. Create the Stack Navigator instance
const Stack = createStackNavigator();

function App() {
  return (
    // 2. *** CRITICAL FIX: All navigation must be wrapped in NavigationContainer ***
    <NavigationContainer>
      <Stack.Navigator 
        // 3. Set the first screen that appears when the app starts
        initialRouteName="Login"
        // Optional: Hides the header on screens where it's not needed (like Login)
        screenOptions={{ headerShown: false }} 
      >
        {/* The Login screen definition */}
        <Stack.Screen name="Login" component={LoginScreen} />

        {/* The Dashboard screen you are replacing to after login */}
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        
        {/* The Register screen you navigate to from the Login screen */}
        <Stack.Screen name="Register" component={RegisterScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;