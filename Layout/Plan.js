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

  const renderItem = ({ item }) => {
    const hasVisitTime = item.visitTime !== undefined && item.visitTime !== null;
      const visitTime = hasVisitTime
        ? `${item.visitTime.date} ${item.visitTime.time}`
        : "Unknown";
    return (
      
    <SwipeListView
      data={[item]}
      renderItem={({ item }) => (
        <View style={styles.planItem}>
          <Text style={styles.planTitle}>{item.title}</Text>
          {hasVisitTime ? (
            <Text style={styles.planDescription}>
            Besuchszeit: {new Date(item.visitTime.date).toLocaleDateString()}  {new Date(item.visitTime.time).toLocaleTimeString()}
            </Text>
          ) : (
            <Text style={styles.planDescriptionDanger}>Location mit unbekannter Besuchszeit</Text>
          )}
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
  }; 
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

        // Sort the plans based on the presence of visit time and the visit time values
        const sortedPlans = plansArray.sort((a, b) => {
          const aHasVisitTime = a.visitTime !== undefined && a.visitTime !== null;
          const bHasVisitTime = b.visitTime !== undefined && b.visitTime !== null;
  
          if (!aHasVisitTime && !bHasVisitTime) {
            return 0;
          } else if (!aHasVisitTime) {
            return -1;
          } else if (!bHasVisitTime) {
            return 1;
          } else {
            const aVisitTime = new Date(a.visitTime.date + " " + a.visitTime.time);
            const bVisitTime = new Date(b.visitTime.date + " " + b.visitTime.time);
  
            if (aVisitTime.getDate() !== bVisitTime.getDate()) {
              return aVisitTime.getDate() - bVisitTime.getDate();
            } else {
              return new Date(a.visitTime.time) - new Date(b.visitTime.time);
            }
          }
        });
  
        setPlans(sortedPlans || []);
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
  planDescriptionDanger: {
    fontSize: 16,
    color: '#ff4122',
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
