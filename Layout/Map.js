import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NativeBaseProvider, Box, Button } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import MapView from 'react-native-maps';

export default function Map() {
  

  
  return (
    <NativeBaseProvider>
      <MapView style={styles.map} />
     
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