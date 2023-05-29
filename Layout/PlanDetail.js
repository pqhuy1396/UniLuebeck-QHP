import React, { useEffect, useState } from 'react';
import { View, Text, Image, Linking, StyleSheet,ScrollView } from 'react-native';
import { NativeBaseProvider, Button, Box } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { FontAwesome } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';

const PlanDetail = ({ route }) => {
  const { item } = route.params;
  const [planAdded, setPlanAdded] = useState(false);
  const isFocused = useIsFocused();
  const navigation = useNavigation();

  useEffect(() => {
    checkPlanAdded();
  }, [isFocused]);

  const checkPlanAdded = async () => {
    try {
      const storedPlans = await AsyncStorage.getItem('plans');
      if (storedPlans) {
        const parsedPlans = JSON.parse(storedPlans);
        const planExists = parsedPlans.find((plan) => plan.title === item.title);
        planExists ? setPlanAdded(true) : setPlanAdded(false);
      }
    } catch (error) {
      console.log('Error checking plan in AsyncStorage:', error);
    }
  };

  const addPlan = async () => {
    try {
      const storedPlans = await AsyncStorage.getItem('plans');
      const parsedPlans = storedPlans ? JSON.parse(storedPlans) : [];
      parsedPlans.push(item);
      await AsyncStorage.setItem('plans', JSON.stringify(parsedPlans));
      setPlanAdded(true);
    } catch (error) {
      console.log('Error adding plan to AsyncStorage:', error);
    }
  };

  const deletePlan = async () => {
    try {
      const storedPlans = await AsyncStorage.getItem('plans');
      if (storedPlans) {
        const parsedPlans = JSON.parse(storedPlans);
        const updatedPlans = parsedPlans.filter((plan) => plan.title !== item.title);
        await AsyncStorage.setItem('plans', JSON.stringify(updatedPlans));
        setPlanAdded(false);
      }
    } catch (error) {
      console.log('Error deleting plan from AsyncStorage:', error);
    }
  };

  const openWebsite = () => {
    if (item.website) {
      Linking.openURL(item.website);
    }
  };

  const callPhoneNumber = () => {
    if (item.phoneNumber) {
      Linking.openURL(`tel:${item.phoneNumber}`);
    }
  };
  const calculateTimeDifference = () => {
    if (item.openingTime && item.openingTime.start && item.openingTime.end) {
      const currentTime = new Date();
      const openingTimeParts = item.openingTime.start.split(':');
      const closingTimeParts = item.openingTime.end.split(':');
  
      const openingTime = new Date();
      openingTime.setHours(Number(openingTimeParts[0]));
      openingTime.setMinutes(Number(openingTimeParts[1]));
  
      const closingTime = new Date();
      closingTime.setHours(Number(closingTimeParts[0]));
      closingTime.setMinutes(Number(closingTimeParts[1]));
      if (item.openingTime.start === item.openingTime.end){
        return (
          <Text style={[styles.location, { color: 'green' }]}>
            {`24 Stunden geöffnet`}
          </Text>
        );
      }
      else if (currentTime < openingTime || currentTime > closingTime) {
        const timeDifference = currentTime < openingTime ? openingTime - currentTime : currentTime - closingTime;
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
        const status = currentTime < openingTime ? 'es wird noch' : 'abgeschlossen, es hat vor';
  
        return (
          <Text style={[styles.location, { color: 'red' }]}>
            {`${status} ${hours}:${minutes < 10 ? '0' : ''}${minutes} ${currentTime < openingTime ? 'geöffnet' : 'geschlossen'}`}
          </Text>
        );
      } else {
        const timeDifference = closingTime - currentTime;
        const hours = Math.floor(timeDifference / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
  
        return (
          <Text style={[styles.location, { color: 'green' }]}>
            {`öffnet, es wird im ${hours}:${minutes < 10 ? '0' : ''}${minutes} schließen`}
          </Text>
        );
      }
    } else {
      return null;
    }
  };
  

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <View style={styles.swiperContainer}>
          {item.pictures && item.pictures.length > 0 ? (
            <Swiper showsButtons={true}>
              {item.pictures.map((picture, index) => (  
                  <Image key={index} source={{ uri: picture }} style={styles.swiperImage} />          
              ))}
            </Swiper>
          ) : null}
        </View>
        <View style={styles.titleContent}>
            <Text style={styles.title}>{item.title}</Text>
            {item.location && <Text style={styles.location}>{item.location}</Text>}
            {item.Time && <Text style={styles.location}>{item.Time}</Text>}
            <Text style={styles.location}>{calculateTimeDifference()}</Text>
        </View>
        
        <View style={styles.detailsContainer}>
          {item.website && (
            <FontAwesome name="globe" size={24} style={styles.icon} onPress={openWebsite} />
          )}
          {item.phoneNumber && (
            <FontAwesome name="phone" size={24} style={styles.icon} onPress={callPhoneNumber} />
          )}
        </View>
        <ScrollView style={styles.descriptionContainer}>
          <Text>{item.description}</Text>
        </ScrollView>
      </View>
      <Box safeAreaBottom backgroundColor="#fff">
        <Box flexDirection="row" justifyContent="space-between" alignItems="center" height={50} paddingHorizontal={100}>
          <Button onPress={() => navigation.navigate('Map')} variant="ghost">
            Map
          </Button>
          {!planAdded ? (
            <Button onPress={addPlan} size="sm" colorScheme="primary" style={styles.addButton}>
              Add Plan
            </Button>
          ) : 
          (
            <Button onPress={deletePlan} size="sm" colorScheme="danger" style={styles.addButton}>
              Delete
            </Button>
          )}
        </Box>
      </Box>

    </NativeBaseProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor : '#E6E1E1',
  },
  swiperContainer: {
    height: '30%',
    width: '100%',
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  swiperImage: {
    flex: 1,
  },
  addButton: {
  },
  detailsContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 16,
    marginBottom: 5,
  },
  website: {
    color: 'blue',
    textDecorationLine: 'underline',
    marginBottom: 8,
  },
  location: {
    marginBottom: 8,
    marginLeft: 16,
  },
  titleContent: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
  },
  descriptionContainer: {
    backgroundColor: '#ffffff',
    marginBottom: 8,
    padding: 16,

  },
  icon: {
    marginLeft: 16,
    marginBottom: 8,
    marginTop: 8,
    color: 'green',
  }
});

export default PlanDetail;
