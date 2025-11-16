import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from './screens/ProfileScreen';
import TabNavigator from './TabNavigator'; 
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import FlashcardStudyScreen from './screens/FlashcardStudyScreen';
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
          initialRouteName="Login"
          screenOptions={{ headerShown: false }} 
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />  
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="HomeTabs" component={HomeTabsWithContext} />
          <Stack.Screen name="FlashcardStudy" component={FlashcardStudyScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}

export default App;
