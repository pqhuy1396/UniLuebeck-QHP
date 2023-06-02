import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Button, NativeBaseProvider } from 'native-base';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { useSelector } from 'react-redux';
import Modal1 from './Modal';
import * as Location from 'expo-location';

export default function Map({ route }) {
  const stadtLuebeckCoords = { latitude: 53.86893, longitude: 10.68729, latitudeDelta: 0.01, longitudeDelta: 0.01 };

  const mapStyle = [
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
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [filteredMarkers, setFilteredMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
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

  const handleMarkerPress = (title) => {
    setSelectedMarker(title);
    setModalVisible(true);
  };

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

  const MarkerComponent = ({ title, coordinate, pinColor }) => (
    <Marker
      coordinate={coordinate}
      pinColor={pinColor}
      onPress={() => handleMarkerPress(title)}
      showCallout
    >
      <Callout>
        <View style={styles.calloutContainer}>
          <Text style={styles.calloutText}>{title}</Text>
        </View>
      </Callout>
    </Marker>
  );

  return (
    <NativeBaseProvider>
      <MapView
        customMapStyle={mapStyle}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={stadtLuebeckCoords}
        region={currentLocation || stadtLuebeckCoords}
        minZoomLevel={14}
        showsUserLocation={true}
        followsUserLocation={true}
      >
        {filteredMarkers.map((marker, index) => (
          <MarkerComponent
            key={index}
            title={marker.title}
            coordinate={marker.coordinate}
            pinColor={marker.pinColor}
          />
        ))}
      </MapView>

      <Modal1
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        selectedMarker={selectedMarker}
      />
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
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
