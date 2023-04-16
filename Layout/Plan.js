import React, { useState } from 'react';
import { StyleSheet, View, FlatList, Text } from 'react-native';
import { NativeBaseProvider } from 'native-base';
const plans = [
  { id: 1, title: 'Plan 1', description: 'This is the first plan' },
  { id: 2, title: 'Plan 2', description: 'This is the second plan' },
  { id: 3, title: 'Plan 3', description: 'This is the third plan' },
  { id: 4, title: 'Plan 4', description: 'This is the fourth plan' },
  { id: 5, title: 'Plan 5', description: 'This is the fifth plan' },
];

export default function Plan() {
  const [selectedPlan, setSelectedPlan] = useState(null);

  const renderItem = ({ item }) => (
    <View style={styles.planItem}>
      <Text style={styles.planTitle}>{item.title}</Text>
      <Text style={styles.planDescription}>{item.description}</Text>
    </View>
  );

  return (
    <NativeBaseProvider>
    <View style={styles.container}>
      <FlatList
        data={plans}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        extraData={selectedPlan}
      />
    </View>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  planItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  planDescription: {
    fontSize: 16,
    color: '#666',
  },
});