import React, { useEffect, useState } from 'react';
import { View, Text, Image, Linking, StyleSheet,ScrollView,TouchableOpacity, Modal, TextInput } from 'react-native';
import { NativeBaseProvider, Button, Box, Divider  } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused } from '@react-navigation/native';
import Swiper from 'react-native-swiper';
import { FontAwesome } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Platform } from 'react-native';


const PlanDetail = ({ route }) => {
  const { item } = route.params;
  const [planAdded, setPlanAdded] = useState(false);
  const [visitTimeAdded, setVisitTimeAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
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
        if (planExists) {
          setPlanAdded(true);
          if (planExists.visitTime) {
            setVisitTimeAdded(true);
          }
        } else {
          setPlanAdded(false);
          setVisitTimeAdded(false);
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
      setVisitTimeAdded(false);
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
        setVisitTimeAdded(false);
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
  const openMapsForDirections = () => {
    const { latitude, longitude } = item.coordinate;
      const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;

      Linking.openURL(url);

  
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
  const handleIconPress = () => {
    if (planAdded) {
      setShowModal(true);
    } else {
      addPlan();
    }
  };
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };
  const handleVisitTimeAdd = async () => {
    try {
      const storedPlans = await AsyncStorage.getItem('plans');
      if (storedPlans) {
        const parsedPlans = JSON.parse(storedPlans);
        const updatedPlans = parsedPlans.map((plan) => {
          if (plan.title === item.title) {
            return {
              ...plan,
              visitTime: {
                date: selectedDate,
                time: selectedTime,
              },
            };
          }
          return plan;
        });
        await AsyncStorage.setItem('plans', JSON.stringify(updatedPlans));
        setVisitTimeAdded(true);
        setShowModal(false);
      }
    } catch (error) {
      console.log('Error adding visit time to plan in AsyncStorage:', error);
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
          <TouchableOpacity onPress={handleIconPress}>
            {planAdded ? (
              <FontAwesome name="clock-o" size={24} style={[styles.icon, visitTimeAdded ? styles.greenIcon : styles.redIcon]} />
            ) : (
              <FontAwesome name="clock-o" size={24} style={styles.icon} />
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={openMapsForDirections}>
            <FontAwesome name="map" size={24} style={styles.icon} />
          </TouchableOpacity>
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
            <Button onPress={addPlan} size="sm" colorScheme="success" style={styles.addButton}>
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
      {showModal && (
        <Modal visible={showModal} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Besuchszeit hinzufügen</Text>
              <Divider my={2} />
              <Box flexDirection="row" justifyContent="space-between" alignItems="flex-end" marginTop={4}>
                <Button width={155} onPress={showDatePicker}>Datum auswählen</Button>
                <TextInput placeholder="Datum...">{selectedDate && selectedDate.toDateString()}</TextInput>
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleDateConfirm}
                  onCancel={hideDatePicker}
                />
              </Box>
              <Box flexDirection="row" justifyContent="space-between" alignItems="flex-end" marginTop={4}>
                <Button width={155} onPress={showTimePicker}>Uhrzeit wählen</Button>
                <TextInput placeholder="Uhrzeit...">{selectedTime && selectedTime.toLocaleTimeString()}</TextInput>
                <DateTimePickerModal
                  isVisible={isTimePickerVisible}
                  mode="time"
                  onConfirm={handleTimeConfirm}
                  onCancel={hideTimePicker}
                />
              </Box>
              <Divider mt={6} />
              <Box mt={3} flexDirection="row" justifyContent="space-between" alignItems="flex-end" height={50} paddingHorizontal={100}>
                <Button colorScheme="success" mr={5} onPress={() => handleVisitTimeAdd()}>Hinzufügen</Button>
                <Button variant="ghost" onPress={() => setShowModal(false)}>Abbrechen</Button>
              </Box>
            </View>
          </View>
        </Modal>
        
      )}
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
  redIcon: {
    color: 'red',
  },
  greenIcon: {
    color: 'green',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
  },
});

export default PlanDetail;
