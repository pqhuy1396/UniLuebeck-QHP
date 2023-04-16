import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeBaseProvider, Box, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';

export default function Map() {
  
  const navigation = useNavigation();

 
  
  return (
    <NativeBaseProvider>
      <Box safeAreaTop backgroundColor="#fff">
        <Box flexDirection="row" justifyContent="center" alignItems="center" height={50}>
          <Button onPress={() =>  navigation.navigate('Information')}>
            Info
          </Button>
          <Button onPress={() => navigation.navigate('Plan')}>
            Plan
          </Button>
          <Button onPress={() =>  navigation.navigate('Event1')} >
            Event
          </Button>
        </Box>
      </Box>
      <MapView style={styles.map} />
      <Box safeAreaBottom backgroundColor="#fff">
        <Box flexDirection="row" justifyContent="center" alignItems="center" height={50}>
          <Button onPress={() =>   navigation.navigate('Information')} variant="ghost">
            Info
          </Button>
          <Button onPress={() => navigation.navigate('Map')} variant="ghost">
            Map
          </Button>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});