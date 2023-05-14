import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Modal, Text } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { useSelector } from 'react-redux';


export default function Map({ route }) {
  const stadtLuebeckCoords = { latitude: 53.86893, longitude: 10.68729, latitudeDelta: 0.01, longitudeDelta: 0.01 };
  
  const mapStyle= [
    {
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "administrative",
      "elementType": "geometry",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "poi",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "transit",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    }
  ]
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState([]);

  const markers = useSelector((state) => state.data.locations);

  useEffect(() => {
    const { category } = route.params || { category: 'All' };
    if (category === 'All') {
      setFilteredMarkers(markers);
    } else {
      const filtered = markers.filter((marker) => marker.category === category);
      setFilteredMarkers(filtered);
    }
  }, [markers, route.params]);
  
  const MarkerComponent = ({ title, coordinate, pinColor }) => (
    <Marker
      coordinate={coordinate}
      pinColor={pinColor}
      onCalloutPress={() => {
        setSelectedMarker(title);
        setModalVisible(true);
      }}
      showCallout
    >
      <Callout >
              <View style={styles.calloutContainer}>
                <Text style={styles.calloutText}>{title}</Text>
              </View>
            </Callout>
    </Marker>
  );
  return (
    <NativeBaseProvider>
      <MapView  customMapStyle={mapStyle} style={styles.map} provider={PROVIDER_GOOGLE}  initialRegion={stadtLuebeckCoords} region={stadtLuebeckCoords} minZoomLevel={14}>
      {filteredMarkers.map((marker, index) => (
          <MarkerComponent
            key={index}
            title={marker.title}
            coordinate={marker.coordinate}
            pinColor={marker.pinColor}
          />
        ))}
      </MapView>
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Selected Marker: {selectedMarker}</Text>
            <Text style={styles.closeButton} onPress={() => setModalVisible(false)}>Close</Text>
          </View>
        </View>
      </Modal>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
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
  closeButton: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  calloutContainer: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  calloutText: {
    fontSize: 16,
  },
});
