import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MapView from 'react-native-maps'

const Map = () => {
  const BATH_INITIAL_REGION = {
    latitude: 51.38199218014315,
    longitude: -2.3563625593000905,
    latitudeDelta: 0.005,
    longitudeDelta: 0.005 
  }

  return (
  <View style={styles.container}>
    <Text>Map.js</Text>
    <MapView 
      initialRegion={BATH_INITIAL_REGION}
      style={styles.map}
    />
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