import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import Startpage from './Layout/Startpage';
import Map from './Layout/Map';
import Information from './Layout/Information';
import Plan from './Layout/Plan';
import Event1 from './Layout/Event1';
import { ReduxProvider } from './redux/store';

const Drawer = createDrawerNavigator();



export default function App() {
  return (
    <ReduxProvider>
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Startpage">
        <Drawer.Screen options={{ headerShown: false, headerTitleAlign: 'center',drawerLabel: () => null,   drawerItemStyle: { display: 'none' } }} name="Startpage" component={Startpage} />
        <Drawer.Screen options={{ headerTitleAlign: 'center', drawerLabel: () => null,   drawerItemStyle: { display: 'none' }}}  name="Map" component={Map} />
        <Drawer.Screen  options={{ headerTitleAlign: 'center'}} name="Information" component={Information} />
        <Drawer.Screen   options={{ headerTitleAlign: 'center'}} name="Plan" component={Plan} />
        <Drawer.Screen   options={{ headerTitleAlign: 'center'}} name="Event1" component={Event1} />
      </Drawer.Navigator>
    </NavigationContainer>
    </ReduxProvider>
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
