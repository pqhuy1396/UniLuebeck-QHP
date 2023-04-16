import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { NativeBaseProvider } from 'native-base';

export default function Event1() {
  const [selectedMonth, setSelectedMonth] = useState('January'); // default selected month is January
  
  // sample events data
  const eventsData = [
    {
      id: 1,
      title: 'Event 1',
      month: 'January'
    },
    {
      id: 2,
      title: 'Event 2',
      month: 'February'
    },
    {
      id: 3,
      title: 'Event 3',
      month: 'March'
    },
    {
      id: 4,
      title: 'Event 4',
      month: 'April'
    },
    {
      id: 5,
      title: 'Event 5',
      month: 'May'
    },
    {
      id: 6,
      title: 'Event 6',
      month: 'June'
    }
  ];

  // filter events by selected month
  const filteredEvents = eventsData.filter(event => event.month === selectedMonth);

  return (
    <NativeBaseProvider>
    

          <View style={styles.monthPicker}>
            <TouchableOpacity onPress={() => setSelectedMonth('January')}>
              <Text style={[styles.month, selectedMonth === 'January' && styles.selectedMonth]}>January</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMonth('February')}>
              <Text style={[styles.month, selectedMonth === 'February' && styles.selectedMonth]}>February</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMonth('March')}>
              <Text style={[styles.month, selectedMonth === 'March' && styles.selectedMonth]}>March</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMonth('April')}>
              <Text style={[styles.month, selectedMonth === 'April' && styles.selectedMonth]}>April</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMonth('May')}>
              <Text style={[styles.month, selectedMonth === 'May' && styles.selectedMonth]}>May</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedMonth('June')}>
              <Text style={[styles.month, selectedMonth === 'June' && styles.selectedMonth]}>June</Text>
            </TouchableOpacity>
          </View>

    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  monthPicker: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  month: {
    fontWeight: 'bold',
  },
  selectedMonth: {
    color: 'blue',
  },
});