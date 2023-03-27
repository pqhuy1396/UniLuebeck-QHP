import React from 'react';
import MapView from 'react-native-maps';
import { StyleSheet, View } from 'react-native';
import Startpage from './Layout/Startpage';
export default function App() {
  return (
    <>
         <View style={styles.container}>
         <Startpage></Startpage>
      {/*<MapView style={styles.map} />*/}
          </View>
   
    </>
   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
