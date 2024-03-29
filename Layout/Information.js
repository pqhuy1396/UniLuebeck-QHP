import React, { useState } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { NativeBaseProvider, Box, AspectRatio, Button, Select, Image, Stack, Center, Heading } from 'native-base';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

export default function Information() {
  const navigation = useNavigation();
  const data = useSelector((state) => state.data.locations);
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredData = data.filter(
    (location) => selectedCategory === 'All' || location.category === selectedCategory
  );

  const categories = ['All', ...new Set(data.map((location) => location.category))];

  const navigateToPlanDetail = (selectedLocation) => {
    navigation.navigate('Plan Detail', { item: selectedLocation });
  };

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <View style={styles.dropdownContainer}>
          <Text style={styles.dropdownLabel}>Kategorie:</Text>
          <Select
            width={150}
            selectedValue={selectedCategory}
            onValueChange={(itemValue, itemIndex) => setSelectedCategory(itemValue)}
          >
            {categories.map((category, index) => (
              <Select.Item key={index} label={category} value={category} />
            ))}
          </Select>
        </View>
        <ScrollView contentContainerStyle={styles.cardsContainer}>
        <Stack space={4}>
          {filteredData.map((location, index) => (      
            <TouchableOpacity key={index} onPress={() => navigateToPlanDetail(location)}>
              <Box maxW="80" rounded="lg" overflow="hidden" borderColor="coolGray.200" borderWidth="1"
                _dark={{ borderColor: "coolGray.600", backgroundColor: "#F8F4EA" }}
                _web={{ shadow: 2, borderWidth: 0 }}
                _light={{ backgroundColor: "#F8F4EA" }}>
                <Box>
                  <AspectRatio w="100%" ratio={16 / 9}>
                    <Image source={{ uri : location.pictures[0] }} alt="image" />
                  </AspectRatio>
                  <Center bg="violet.500" _dark={{ bg: "violet.400" }}
                    _text={{ color: "warmGray.50", fontWeight: "700", fontSize: "xs" }} position="absolute" bottom="0" px="3" py="1.5">
                    PHOTOS
                 </Center>
                </Box>
                <Stack p="4" space={3}>
                  <Stack space={2}>
                    <Heading size="md" ml="-1">
                      {location.title}
                    </Heading>
                    <Text fontSize="xs" _light={{ color: "violet.500" }} _dark={{ color: "violet.400" }} fontWeight="500" ml="-0.5" mt="-1">
                      {location.location}
                    </Text>
                  </Stack>
                </Stack>
              </Box>
            </TouchableOpacity>
          ))}
        </Stack>
        </ScrollView>
      </View>
      <Box safeAreaBottom backgroundColor="#fff">
        <Box flexDirection="row" justifyContent="center" alignItems="center" height={50}>
          <Button onPress={() => navigation.navigate('Map', { category: selectedCategory })} variant="ghost">
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
    backgroundColor: '#fff',
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    marginLeft: 20,
  },
  dropdownLabel: {
    marginRight: 10,
    fontSize: 18,
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    backgroundColor: '#E6E1E1',
  },
});
