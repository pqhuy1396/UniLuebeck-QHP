import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { NativeBaseProvider, Box, Button } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';


export default function Plan() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const renderItem = ({ item }) => (
    <SwipeListView
      data={[item]}
      renderItem={({ item }) => (
        <View style={styles.planItem}>
          <Text style={styles.planTitle}>{item.title}</Text>
        </View>
      )}
      renderHiddenItem={({ item }) => (
        <View style={styles.hiddenItem}>
          <Button onPress={() => moreInformation(item)} borderRadius="none" colorScheme="success" style={styles.hiddenButton}>
            Mehr
          </Button>
          <Button onPress={() => deleteItem(item)} borderRadius="none" colorScheme="danger" style={styles.hiddenButton}>
            Delete
          </Button>
        </View>
      )}
      rightOpenValue={-120}
      disableRightSwipe={true}
    />
  );
  
  const moreInformation = (item) => {
    navigation.navigate('Plan Detail', { item });
  };
  
  const deleteItem = async (item) => {
    try {
      const updatedPlans = plans.filter((plan) => plan.title !== item.title);
      setPlans(updatedPlans);
      await AsyncStorage.setItem('plans', JSON.stringify(updatedPlans));
    } catch (error) {
      console.log('Error deleting item:', error);
    }
  };

  useEffect(() => {
    const getPlansFromStorage = async () => {
      try {
        const plansString = await AsyncStorage.getItem('plans');
        const plansArray = JSON.parse(plansString);
        setPlans(plansArray || []);
      } catch (error) {
        console.log('Error retrieving plans:', error);
      }
    };

    getPlansFromStorage();
  }, [isFocused]);

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <FlatList
          data={plans}
          renderItem={renderItem}
          keyExtractor={(item) => item.title}
          extraData={selectedPlan}
        />
      </View>
      <Box safeAreaBottom backgroundColor="#fff">
        <Box flexDirection="row" justifyContent="center" alignItems="center" height={50}>
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
    backgroundColor: '#eee',
    justifyContent: 'center',
  },
  planItem: {
    padding: 20,
    backgroundColor: '#F8F4EA',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planDescription: {
    fontSize: 16,
    color: '#666',
  },
  hiddenItem: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  hiddenButton: {
    height: '100%',
    justifyContent: 'center',
  },
});
