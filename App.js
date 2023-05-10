import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import Ionicons from '@expo/vector-icons/Ionicons';

import Startpage from './Layout/Startpage';
import Map from './Layout/Map';
import Information from './Layout/Information';
import Plan from './Layout/Plan';
import Event1 from './Layout/Event1';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

const MenuButton = ({ onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.menuButton}>
    <Ionicons name="md-menu" size={32} color="black" />
  </TouchableOpacity>
);

const AppHeader = ({ title, navigation }) => {
  return {
    title: title,
    headerRight: () => (
      <MenuButton onPress={() => navigation.openDrawer()} />
    ),
    headerShown: true,
    headerTitleAlign: 'center',
  };
};

const AppFooter = ({ title, navigation }) => {
  return (
    <TouchableOpacity
      style={styles.footerButton}
      onPress={() => navigation.navigate('Map')}>
      <Text style={styles.footerButtonText}>{title}</Text>
    </TouchableOpacity>
  );
};


export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Startpage">
        <Drawer.Screen options={{ headerShown: false, headerTitleAlign: 'center',drawerLabel: () => null,   drawerItemStyle: { display: 'none' } }} name="Startpage" component={Startpage} />
        <Drawer.Screen options={{ headerTitleAlign: 'center', drawerLabel: () => null,   drawerItemStyle: { display: 'none' }}}  name="Map" component={Map} />
        <Drawer.Screen  options={{ headerTitleAlign: 'center'}} name="Information" component={Information} />
        <Drawer.Screen   options={{ headerTitleAlign: 'center'}} name="Plan" component={Plan} />
        <Drawer.Screen   options={{ headerTitleAlign: 'center'}} name="Event1" component={Event1} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


const styles = StyleSheet.create({
  menuButton: {
    marginLeft: 16,
  },
  footerButton: {
    backgroundColor: 'blue',
    padding: 16,
    borderRadius: 32,
    position: 'absolute',
    bottom: 32,
    right: 32,
  },
});
