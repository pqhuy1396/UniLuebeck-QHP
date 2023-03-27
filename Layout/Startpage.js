import React from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { Button, Text } from 'native-base';

export default function Startpage () {
  return (
    <ImageBackground
      source={require('./luebeck.jpg')}
      style={styles.backgroundImage}
    >
      <Text style={styles.title}>Welcome to Our App</Text>
      <Button style={styles.startButton}>
        <Text>Start</Text>
      </Button>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 32,
  },
  startButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 8,
  },
});
