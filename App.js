import React from 'react';
import { StyleSheet, View,TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import Startpage from './Layout/Startpage';
import Map from './Layout/Map';
import Information from './Layout/Information';
import Plan from './Layout/Plan';
import Event1 from './Layout/Event1';

export default function App() {
  const Stack = createStackNavigator();
  const MenuButton = ({ onPress }) => (
    <TouchableOpacity onPress={onPress} style={styles.menuButton}>
      <Ionicons name="md-menu" size={32} color="black" />
    </TouchableOpacity>
  );


  return (
    <>
      <NavigationContainer>
      <Stack.Navigator

      >
        <Stack.Screen name="Startpage" component={Startpage} options={{ headerShown: false }} />
        <Stack.Screen name="Map" component={Map}   
        options={{
          title: 'Map',
          headerTitleAlign: 'center',
          headerRight: (props) => (
              <MenuButton {...props} onPress={() => alert('Open menu')} />
            ),
        }}/>
        <Stack.Screen name="Information" component={Information} 
          options={{
          title: 'Information',
          headerTitleAlign: 'center',
          
        }}
        />
        <Stack.Screen name="Plan" component={Plan} 
          options={{
          title: 'Plan',
          headerTitleAlign: 'center',
        }}
        />
        <Stack.Screen name="Event1" component={Event1} 
          options={{
          title: 'Veranstaltung',
          headerTitleAlign: 'center',
        }}
        />
      </Stack.Navigator>
    </NavigationContainer>
   
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
  menuButton: {
    marginLeft: 16,
  },
});
