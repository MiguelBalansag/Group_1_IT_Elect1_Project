// App.js (The main entry file for your application)
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import DashboardScreen from './DashboardScreen'; 
import RegisterScreen from './RegisterScreen';  

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Login"
        screenOptions={{ headerShown: false }} >
        <Stack.Screen name="Login" component={LoginScreen} />
        
        <Stack.Screen name="Dashboard" component={DashboardScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;