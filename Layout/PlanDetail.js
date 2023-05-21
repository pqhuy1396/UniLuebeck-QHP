import React, { useEffect, useState } from 'react';
import { View, Text, Image, Linking } from 'react-native';
import { NativeBaseProvider, Button } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';

const PlanDetail = ({ route }) => {
  const { item } = route.params;
  const [planAdded, setPlanAdded] = useState(false);
  const isFocused = useIsFocused();

  useEffect(() => {
    console.log('useEffect called');
    checkPlanAdded();
  }, [isFocused]);

  const checkPlanAdded = async () => {
    try {
      const storedPlans = await AsyncStorage.getItem('plans');
      if (storedPlans) {
        const parsedPlans = JSON.parse(storedPlans);
        const planExists = parsedPlans.find((plan) => plan.title === item.title);
        if (planExists) {
            setPlanAdded(true);
        }else{          
            setPlanAdded(false);
        }
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

  return (
    <NativeBaseProvider>
    {!planAdded && (
          <Button onPress={addPlan} size="sm" colorScheme="primary">
            Add Plan
          </Button>
        )}
      <View>
        <Text>{item.title}</Text>
        {item.image && <Image source={{ uri: item.image }} style={{ width: 200, height: 200 }} />}
        {item.website && <Text onPress={openWebsite}>{item.website}</Text>}
        {item.phoneNumber && <Text>{item.phoneNumber}</Text>}
        {item.openingTime && <Text>{item.openingTime}</Text>}
        {item.location && <Text>{item.location}</Text>}
        {item.price && <Text>{item.price}</Text>}
        {item.pictures &&
          item.pictures.map((picture, index) => (
            <Image key={index} source={{ uri: picture }} style={{ width: 200, height: 200 }} />
          ))}
      </View>
      
    </NativeBaseProvider>
  );
};

export default PlanDetail;
