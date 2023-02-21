import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import MapView, { Marker, Polyline } from 'react-native-maps'

const Map = () => {
  const BATH_INITIAL_REGION = {
    latitude: 51.38151507938794, 
    longitude: -2.376689633845235,
    latitudeDelta: 0.0225,
    longitudeDelta: 0.0225,
  }

  const DUMMY_LOCATIONS = [
    {
      id: 1,
      latitude: 51.382481020706635,
      longitude: -2.3812105369639043,
      pinColor:"orange",
    },
    { 
      id: 2,
      latitude: 51.38539845372343, 
      longitude: -2.376339037524514,
      pinColor:"orange",
    },
    {
      id: 3,
      latitude: 51.37685566810041, 
      longitude: -2.370529450651123,
      pinColor:"orange",
    }
  ]

  const markerElements = DUMMY_LOCATIONS.map((location) => (
    <Marker 
      coordinate={{longitude: location.longitude, latitude: location.latitude}}
      pinColor={location.pinColor}
    />
  ))

  const [region, setRegion] = useState(BATH_INITIAL_REGION);

  return (
  <View style={styles.container}>
    <MapView 
      initialRegion={BATH_INITIAL_REGION}
      style={styles.map}
      //onRegionChangeComplete -> runs when user stops dragging MapView
      onRegionChangeComplete={(region) => setRegion(region)}
    >
      {markerElements}
      <Polyline 
        coordinates={[
          {longitude: DUMMY_LOCATIONS[0].longitude, latitude: DUMMY_LOCATIONS[0].latitude}, 
          {longitude: DUMMY_LOCATIONS[1].longitude, latitude: DUMMY_LOCATIONS[1].latitude},
          {longitude: DUMMY_LOCATIONS[2].longitude, latitude: DUMMY_LOCATIONS[2].latitude},
        ]}
        strokeColor={"#000"}
        strokeWidth={3}
        lineDashPattern={[1]}
      />
    </MapView>
    <Text style={styles.text}>Current latitude: {region.latitude}</Text>
    <Text style={styles.text}>Current longitude: {region.longitude}</Text>
  </View>
  );
}

export default Map

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '50%',
  },
  map: {
    width: '100%',
    height: '100%',
  },
});