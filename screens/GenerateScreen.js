import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const GenerateScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Would you like to Generate </Text>
      <Text>This is where yo make your flashcard.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default GenerateScreen;