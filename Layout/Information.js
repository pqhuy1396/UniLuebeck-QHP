import React, { useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { NativeBaseProvider, VStack, Box, Divider, Button, Select } from 'native-base';
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

  return (
    <NativeBaseProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Information</Text>
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
        <View style={styles.cardsContainer}>
          {filteredData.map((location, index) => (
            <Box key={index} border="1" borderRadius="md">
              <VStack space="4" divider={<Divider />}>
                <Box px="4" pt="4">
                  {location.title}
                </Box>
                <Box px="4">{location.description}</Box>
                <Box px="4" pb="4">
                  {location.category}
                </Box>
              </VStack>
            </Box>
          ))}
        </View>
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
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  dropdownContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dropdownLabel: {
    marginRight: 10,
    fontSize: 18,
  },
  cardsContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  cardText: {
    marginTop: 10,
  },
});
