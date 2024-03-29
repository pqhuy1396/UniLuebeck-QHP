import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Text} from 'react-native';
import { Box, AspectRatio, Image, Stack, Center, Heading, HStack , Button  } from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Modal({ visible, onClose, selectedMarker }) {
  if (!visible) {
    return null;
  }
  const [itemExistsInPlans, setItemExistsInPlans] = useState(false);
  const locations = useSelector((state) => state.data.locations);
  const selectedLocation = locations.find((location) => location.title === selectedMarker);

  if (!selectedLocation) {
    return null;
  }

  useEffect(() => {
    const checkItemInPlans = async () => {
      try {
        const existingPlansString = await AsyncStorage.getItem('plans');
        const existingPlans = JSON.parse(existingPlansString) || [];
        const exists = existingPlans.some((plan) => plan.title === selectedLocation.title);
        setItemExistsInPlans(exists);
      } catch (error) {
        console.log('Error checking item in plans:', error);
      }
    };

    checkItemInPlans();
  }, [selectedLocation]);


  const { title, location, pictures } = selectedLocation;
  
  const handleAddToPlan = async () => {
    try {
      const existingPlansString = await AsyncStorage.getItem('plans');
      const existingPlans = JSON.parse(existingPlansString) || [];

      if (itemExistsInPlans) {
        // Remove the location from plans
        const updatedPlans = existingPlans.filter((plan) => plan.title !== selectedLocation.title);
        await AsyncStorage.setItem('plans', JSON.stringify(updatedPlans));
        console.log('Selected location removed from plans.');
      } else {
        // Add the location to plans
        const updatedPlans = [...existingPlans, selectedLocation];
        await AsyncStorage.setItem('plans', JSON.stringify(updatedPlans));
        console.log('Selected location saved to plans.');
      }

      // Toggle the value of itemExistsInPlans
      setItemExistsInPlans(!itemExistsInPlans);

      onClose();
    } catch (error) {
      console.log('Error saving or removing selected location:', error);
    }
  };
  


  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Box
          maxW="80"
          rounded="lg"
          overflow="hidden"
          borderColor="coolGray.200"
          borderWidth="1"
          _dark={{ borderColor: "coolGray.600", backgroundColor: "gray.700" }}
          _web={{ shadow: 2, borderWidth: 0 }}
          _light={{ backgroundColor: "gray.50" }}
        >
          <Box>
            <AspectRatio w="100%" ratio={16 / 9}>
            <Image source={{ uri: pictures[0] }} alt="image" />
            </AspectRatio>
            <Center
              bg="violet.500"
              _dark={{ bg: "violet.400" }}
              _text={{ color: "warmGray.50", fontWeight: "700", fontSize: "xs" }}
              position="absolute"
              bottom="0"
              px="3"
              py="1.5"
            >
              PHOTOS
            </Center>
          </Box>
          <Stack p="4" space={3}>
            <Stack space={2}>
              <Heading size="md" ml="-1">
                {title}
              </Heading>
              <Text fontSize="xs" _light={{ color: "violet.500" }} _dark={{ color: "violet.400" }} fontWeight="500" ml="-0.5" mt="-1">
                {location}
              </Text>
            </Stack>
          </Stack>
          <Button.Group space={2}>
              <Button variant="ghost"  onPress={onClose}>
                Abbrechen
              </Button>
              <Button
                  onPress={handleAddToPlan}
                  colorScheme={itemExistsInPlans ? 'red' : 'green'}
                >
                  {itemExistsInPlans ? 'Entfernen' : 'Speichern'}
                </Button>

            </Button.Group>
        </Box>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
});
