import React from 'react';
import { StyleSheet, ImageBackground , View} from 'react-native';
import { Button, Text} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeBaseProvider } from 'native-base';
export default function Startpage () {
  const navigation = useNavigation();

  function handleStartPress() {
    navigation.navigate('Map');
  }
  return (
    <NativeBaseProvider>
    <ImageBackground
      source={require('./luebeck.jpg')}
      style={styles.backgroundImage}
    >
     <View style={styles.opacity}>
      <Text style={styles.title}  fontSize="5xl">Smartphone App für Stadtführung und Routenplanung in Lübeck</Text>
      <Button colorScheme="success" style={styles.button} onPress={handleStartPress}>
      Start
      </Button>
      </View>
    </ImageBackground>
    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opacity: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    width: "80%",
    height: "60%",
    color: "black",
  },
  button: {
    width: "50%",
    
  }
});
