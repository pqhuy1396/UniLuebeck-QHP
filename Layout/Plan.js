import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { NativeBaseProvider, Box, Button } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';

export default function Plan() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const renderItem = ({ item }) => (
    <View style={styles.planItem}>
      <Text style={styles.planTitle}>{item.title}</Text>
      <Text style={styles.planDescription}>{item.description}</Text>
      <Button onPress={() => deleteItem(item)} variant="outline" colorScheme="danger">
        Delete
      </Button>
    </View>
  );

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  planItem: {
    padding: 20,
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
});
