import React, { useState, useEffect } from 'react';
import { StyleSheet, View, FlatList, Text, TouchableOpacity, Modal, TextInput } from 'react-native';
import { NativeBaseProvider, Box, Button, Divider } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { SwipeListView } from 'react-native-swipe-list-view';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { FontAwesome } from 'react-native-vector-icons';
import * as Location from 'expo-location';

export default function Plan() {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [plans, setPlans] = useState([]);
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [visitTimeAdded, setVisitTimeAdded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState(null);
  const [tripStatus, setTripStatus] = useState('');
  const [currentLocation, setCurrentLocation] = useState(null);
  const [showItemModal, setShowItemModal] = useState(false);

  
  useEffect(() => {
    const checkPermissions = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        startLocationUpdates();
      } else {
        console.log('Foreground location permission denied');
      }
    };

    checkPermissions();
  }, []);

  const startLocationUpdates = async () => {
    try {
      Location.startLocationUpdatesAsync('locationUpdates', {
        accuracy: Location.Accuracy.High,
        distanceInterval: 10,
      });
    } catch (error) {
      console.log('Error starting location updates:', error);
    }
  };

  useEffect(() => {
    const locationListener = Location.watchPositionAsync(
      { accuracy: Location.Accuracy.High, timeInterval: 1000, distanceInterval: 10 },
      (location) => {
        const userLocation = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };
        setCurrentLocation(userLocation);
      }
    );

    return () => {
      if (locationListener) {
        locationListener.remove();
      }
    };
  }, []);
  const handleIconPress = () => {
    setShowModal(true);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time);
    hideTimePicker();
  };

  const handleVisitTimeAdd = () => {
    if (selectedDate && selectedTime) {
      // Add visit time to the selected plan or do whatever you need with the selected date and time
      setVisitTimeAdded(true);
      setShowModal(false);
      AsyncStorage.setItem('visitTime', JSON.stringify(selectedTime));
    }
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    // Use appropriate distance calculation formula based on your needs
    // For example, you can use the Haversine formula
    // This is just a dummy example using a simple calculation
    const dx = Math.abs(lon2 - lon1);
    const dy = Math.abs(lat2 - lat1);
    return Math.sqrt(dx * dx + dy * dy) * 100000; // Multiply by 100000 to get meters
  };
  
  const calculateTime = (distance) => {
    // Calculate time based on your needs
    // For example, you can assume an average walking speed
    // This is just a dummy example using a fixed value
    const speed = 1.4; // meters per second
    return distance / (speed * 60); // Divide by (speed * 60) to get minutes
  };

  
  const renderItem = ({ item , index}) => {
    let label = "null";
    if (index === 0 && currentLocation) {
      const distance = calculateDistance(currentLocation.latitude, currentLocation.longitude, item.coordinate.latitude, item.coordinate.longitude);
      const time = calculateTime(distance);
      label = `Entfernung vom aktuellen Standort: ${distance.toFixed(0)} Meter, Zeit: ${time.toFixed(0)} Minuten`;
    } else if (index > 0 && plans[index - 1]) {
      const prevLocation = plans[index - 1];
      const distance = calculateDistance(prevLocation.coordinate.latitude, prevLocation.coordinate.longitude, item.coordinate.latitude, item.coordinate.longitude);
      const time = calculateTime(distance);
      label = `Entfernung vom vorherigen Standort: ${distance.toFixed(0)} Meter, Zeit: ${time.toFixed(0)} Minuten`;
    }
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
              {`${status} ${hours} Studen ${minutes < 10 ? '0' : ''}${minutes} Minuten ${currentTime < openingTime ? 'geöffnet' : 'geschlossen'}`}
            </Text>
          );
        } else {
          const timeDifference = closingTime - currentTime;
          const hours = Math.floor(timeDifference / (1000 * 60 * 60));
          const minutes = Math.floor((timeDifference / (1000 * 60)) % 60);
    
          return (
            <Text style={[styles.location, { color: 'green' }]}>
              {`geöffnet, es wird in ${hours} Stunden ${minutes < 10 ? '0' : ''}${minutes} Minuten schließen`}
            </Text>
          );
        }
      } else {
        return null;
      }
    };
  
    return (
      <SwipeListView
        data={[item]}
        renderItem={({ item }) => (
          <TouchableOpacity onLongPress={() => handleItemClick(item)}>
          <View style={styles.planItem}>
            <Text>{label}</Text>
            <Text style={styles.planTitle}>{item.title}</Text>
            <Text>{calculateTimeDifference()}</Text>
          </View>
          </TouchableOpacity>
        )}
        renderHiddenItem={({ item }) => (
          <View style={styles.hiddenItem}>
            <Button onPress={() => moreInformation(item)} borderRadius="none" colorScheme="success" style={styles.hiddenButton}>
              Details
            </Button>
            <Button onPress={() => deleteItem(item)} borderRadius="none" colorScheme="danger" style={styles.hiddenButton2}>
              Löschen
            </Button>
          </View>
        )}
        rightOpenValue={-140}
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

  const lastItem = async (item) => {
    try {
      const updatedPlans = [...plans];
      const index = updatedPlans.findIndex((plan) => plan.title === item.title);
      
      if (index !== -1) {
        updatedPlans.splice(index, 1); // Remove the item from the array
        updatedPlans.push(item); // Add the item back at the end
        
        setPlans(updatedPlans);
        await AsyncStorage.setItem('plans', JSON.stringify(updatedPlans));
      }
    } catch (error) {
      console.log('Error deleting item:', error);
    }
    handleCloseModal();
  };


  const firstItem = async (item) => {
    try {
      const updatedPlans = [...plans];
      const index = updatedPlans.findIndex((plan) => plan.title === item.title);
  
      if (index !== -1) {
        updatedPlans.splice(index, 1); // Remove the item from the array
        updatedPlans.unshift(item); // Add the item to the beginning of the array
  
        setPlans(updatedPlans);
        await AsyncStorage.setItem('plans', JSON.stringify(updatedPlans));
      }
    } catch (error) {
      console.log('Error deleting item:', error);
    }
    handleCloseModal();
  };

  const handleItemClick = (item) => {
    setSelectedPlan(item);
    setShowItemModal(true);
  };

  const handleCloseModal = () => {
    setShowItemModal(false);
  };
  useEffect(() => {
    const getPlansFromStorage = async () => {
      try {
        const plansString = await AsyncStorage.getItem('plans');
        const plansArray = JSON.parse(plansString);
        setPlans(plansArray);
      } catch (error) {
        console.log('Error retrieving plans:', error);
      }
    };

    getPlansFromStorage();
  }, [isFocused]);

  useEffect(() => {
    const getVisitTimeFromStorage = async () => {
      try {
        const visitTime = await AsyncStorage.getItem('visitTime');
        if (visitTime) {
          setVisitTimeAdded(true);
          setSelectedTime(new Date(JSON.parse(visitTime)));
        } else {
          setVisitTimeAdded(false);
          setSelectedTime(null);
        }
      } catch (error) {
        console.log('Error retrieving visit time:', error);
      }
    };

    getVisitTimeFromStorage();
  }, []);

  useEffect(() => {
    const calculateTripStatus = () => {
      if (selectedTime && selectedDate) {
        const now = new Date();
        const timeDiff = selectedTime.getTime() - now.getTime();
        const dayDiff = selectedDate.getDate() - now.getDate();
  
        if (dayDiff === 0 && timeDiff <= 0) {
          setTripStatus('Die Reise hat begonnen');
        } else if (dayDiff === 0 && timeDiff >= 0) {
          const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
          const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
          setTripStatus(`Die Reise beginnt in ${hoursLeft} Stunden und ${minutesLeft} Minuten`);
        } else if (dayDiff === 1) {
          const formattedTime = selectedTime.toLocaleTimeString();
          setTripStatus(`Reise beginnt am Morgen um ${formattedTime}`);
        } else {
          const formattedDate = selectedDate.toLocaleDateString();
          setTripStatus(`Reise beginnt am ${formattedDate}`);
        }
      } else {
        setTripStatus('Kein Plan für die Reise');
      }
    };
  
    calculateTripStatus();
  }, [selectedDate, selectedTime]);
  
    

  deleteVisitTime = async () => {
    try {
      await AsyncStorage.removeItem('visitTime');
      setVisitTimeAdded(false);
      setSelectedTime(null);
    } catch (error) {
      console.log('Error deleting visit time:', error);
    }
  };

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
      <View style={styles.dropdownContainer}>
        <Text style={styles.dropdownLabel}> Startzeit des Besuch:</Text>
        <TouchableOpacity onPress={handleIconPress}>
          {visitTimeAdded ? (
            <FontAwesome name="clock-o" size={24} style={styles.icon} />
          ) : (
            <FontAwesome name="clock-o" size={24} style={[styles.icon, styles.redIcon]} />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteVisitTime}>
          {visitTimeAdded ? (
            <FontAwesome name="trash" size={24} style={[styles.icon, styles.redIcon]} />
          ) : (
            <FontAwesome name="trash" size={24} style={[styles.icon, styles.gray]} />
          )}
        </TouchableOpacity>
        
      </View>
      <View style={styles.dropdownContainer2}>
        <Text style={styles.tripStatus}>{tripStatus}</Text>
      </View>
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

      {showItemModal && (
        <Modal visible={showItemModal} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>{selectedPlan.title}</Text>
              <Divider my={2} />
              <Box style={styles.modalContent2} justifyContent="space-between">
              <Text marginBottom={2}>Haben Sie Ihren Besuch an diesem Ort beendet?</Text>
              <Button marginBottom={4} size={"sm"} colorScheme={"red"}  onPress={() => lastItem(selectedPlan)}>
                Beenden
              </Button>
              <Text marginBottom={2}>Möchten Sie diesen Ort sofort besuchen?</Text>
              <Button size={"sm"} colorScheme={"green"} onPress={() => firstItem(selectedPlan)}>
                Sofort
              </Button>
              </Box>
              </View>
            
            </View>
      </Modal>
      )}
      {showModal && (
        <Modal visible={showModal} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.title}>Besuchszeit hinzufügen</Text>
              <Divider my={2} />
              <Box flexDirection="row" justifyContent="space-between" alignItems="flex-end" marginTop={4}>
                <Button width={155} onPress={showDatePicker}>
                  Datum auswählen
                </Button>
                <TextInput
                  placeholder="Datum..."
                  editable={false}
                  value={selectedDate ? selectedDate.toDateString() : ''}
                />
                <DateTimePickerModal
                  isVisible={isDatePickerVisible}
                  mode="date"
                  onConfirm={handleDateConfirm}
                  onCancel={hideDatePicker}
                />
              </Box>
              <Box flexDirection="row" justifyContent="space-between" alignItems="flex-end" marginTop={4}>
                <Button width={155} onPress={showTimePicker}>
                  Uhrzeit wählen
                </Button>
                <TextInput
                  placeholder="Uhrzeit..."
                  editable={false}
                  value={selectedTime ? selectedTime.toLocaleTimeString() : ''}
                />
                <DateTimePickerModal
                  isVisible={isTimePickerVisible}
                  mode="time"
                  onConfirm={handleTimeConfirm}
                  onCancel={hideTimePicker}
                />
              </Box>
              <Divider mt={6} />
              <Box
                mt={3}
                flexDirection="row"
                justifyContent="space-between"
                alignItems="flex-end"
                height={50}
                paddingHorizontal={100}
              >
                <Button colorScheme="success" mr={5} onPress={() => handleVisitTimeAdd()}>
                  Hinzufügen
                </Button>
                <Button variant="ghost" onPress={() => setShowModal(false)}>
                  Abbrechen
                </Button>
              </Box>
            </View>
          </View>
        </Modal>
      )}
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingLeft: 10,
  },
  dropdownContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
    paddingBottom: 10,
  },
  dropdownLabel: {
    marginRight: 10,
    fontSize: 18,
  },
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
  hiddenButton2: {
    height: '100%',
    justifyContent: 'center',
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
  gray: {
    color: '#ccc',
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
  modalContent2: {
    
    padding: 8,

  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 5,
    marginLeft: 16,
    marginBottom: 5,
  },
  tripStatus: {
    marginTop: 10,
    marginLeft: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
