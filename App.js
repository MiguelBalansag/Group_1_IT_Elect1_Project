import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './screens/ProfileScreen'
import TabNavigator from './TabNavigator'; 
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import Splash from './FirstPage/Splash'; 
import { DeckProvider } from './DeckContext'; 
import { ThemeProvider } from './ThemeContext';

const Stack = createStackNavigator();


const HomeTabsWithContext = () => (
  
  <DeckProvider>
    <TabNavigator />
  </DeckProvider>
);

function App() {
  return (
    <ThemeProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }} 
        >
          
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />  
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="HomeTabs" component={HomeTabsWithContext} />
          
        </Stack.Navigator>
      </NavigationContainer>
 
   </ThemeProvider>
  );
}

export default App;
