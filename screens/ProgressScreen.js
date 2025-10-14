import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProgressScreen = () => {
  return (
    <View style={styles.container}>
      <Text>ProgressScreen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProgressScreen;