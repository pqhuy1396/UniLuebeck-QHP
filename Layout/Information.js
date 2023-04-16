import React, { useState } from 'react';
import { StyleSheet, View, Text} from 'react-native';
import { NativeBaseProvider, VStack, Box, Divider,Button,Select  } from 'native-base';
import { useNavigation } from '@react-navigation/native';


const categories = ['Category 1', 'Category 2', 'Category 3', 'Category 4', 'Category 5', 'Category 6'];

export default function Information () {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const categoryCards = [1, 2, 3, 4, 5]; // replace with actual data for each category

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
        {categoryCards.map((card, index) => (
        
          <Box key={index} border="1" borderRadius="md">
            <VStack space="4" divider={<Divider />}>
              <Box px="4" pt="4">
              Card {card}
              </Box>
              <Box px="4">
                NativeBase is a free and open source framework that enable developers
                to build high-quality mobile apps using React Native iOS and Android
                apps with a fusion of ES6.
              </Box>
              <Box px="4" pb="4">
                GeekyAnts
              </Box>
            </VStack>
          </Box>
          
        ))}
      </View>
    </View>
    <Box safeAreaBottom backgroundColor="#fff">
        <Box flexDirection="row" justifyContent="center" alignItems="center" height={50}>
          <Button onPress={() =>   navigation.navigate('Information')} variant="ghost">
            Info
          </Button>
          <Button onPress={() => navigation.navigate('Map')} variant="ghost">
            Map
          </Button>
        </Box>
      </Box>
    </NativeBaseProvider>
  );
};

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

