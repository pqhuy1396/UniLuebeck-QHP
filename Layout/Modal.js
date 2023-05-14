import React from 'react';
import { useSelector } from 'react-redux';
import { StyleSheet, View, Text, Button } from 'react-native';
import { Box, AspectRatio, Image, Stack, Center, Heading, HStack } from 'native-base';

export default function Modal({ visible, onClose, selectedMarker }) {
  if (!visible) {
    return null;
  }

  const locations = useSelector((state) => state.data.locations);
  const selectedLocation = locations.find((location) => location.title === selectedMarker);

  if (!selectedLocation) {
    return null;
  }

  const { title, location, description } = selectedLocation;

  const handleAddToPlan = () => {
    // Implement the logic to pass the selectedMarker to the Plan page here
    // You can use a state management solution like Redux or React Context to store and share the selected marker data
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
            <Image source={{ uri: "https://www.holidify.com/images/cmsuploads/compressed/Bangalore_citycover_20190613234056.jpg" }} alt="image" />
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
            <Text fontWeight="400">
              {description}
            </Text>
            <HStack alignItems="center" space={4} justifyContent="space-between">
              <HStack alignItems="center">
                <Text color="coolGray.600" _dark={{ color: "warmGray.200" }} fontWeight="400">
                  6 mins ago
                </Text>
              </HStack>
            </HStack>
          </Stack>
        </Box>
        <Button title="Add" onPress={handleAddToPlan} />
        <Button title="Close" onPress={onClose} />
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
