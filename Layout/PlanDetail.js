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
    const openingTimeText = item.openingTime.start;
    const openingTimeParts = openingTimeText.split(':');
    const openingTime = new Date();
    openingTime.setHours(Number(openingTimeParts[0]));
    openingTime.setMinutes(Number(openingTimeParts[1]));
    
    const currentTime = new Date();
    
    if (currentTime < openingTime) {
      // Calculate time until the door opens
      const timeDifference = openingTime - currentTime;
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      return (
        <Text style={[styles.location, { color: 'red' }]}>
          {`abgeschlossen, es wird${hours}:${minutes < 10 ? '0' : ''}${minutes} bis sich geöffnet`}
        </Text>
      );
    } else {
      // Calculate time until the door closes
      const closingTimeText = item.openingTime.end;
      const closingTimeParts = closingTimeText.split(':');
      const closingTime = new Date();
      closingTime.setHours(Number(closingTimeParts[0]));
      closingTime.setMinutes(Number(closingTimeParts[1]));
      const timeDifference = closingTime - currentTime;
      const hours = Math.floor(timeDifference / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
      return (
        <Text style={[styles.location, { color: 'green' }]}>
          {`öffnet, es wird ${hours}:${minutes < 10 ? '0' : ''}${minutes} bis sich schließt`}
        </Text>
      );
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
            {item.price && <Text style={styles.location}>{item.price}</Text>}
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
        <Box flexDirection="row" justifyContent="center" alignItems="center" height={50}>
          <Button onPress={() => navigation.navigate('Map')} variant="ghost">
            Map
          </Button>
          {!planAdded && (
          <Button onPress={addPlan} size="sm" colorScheme="primary" style={styles.addButton}>
            Add Plan
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
  },
});

export default PlanDetail;
