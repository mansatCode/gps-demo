import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker, Polyline } from 'react-native-maps'
import { decode } from "@mapbox/polyline"
import { GOOGLE_MAPS_APIKEY } from '@env'

const Map = () => {
  const [region, setRegion] = useState(BATH_INITIAL_REGION);
  const [coords, setCoords] = useState([]);

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

  useEffect(() => {
    getDirections(`${DUMMY_LOCATIONS[0].latitude},${DUMMY_LOCATIONS[0].longitude}`, `${DUMMY_LOCATIONS[1].latitude},${DUMMY_LOCATIONS[1].longitude}`)
      .then(coords => setCoords(coords))
      .catch(err => console.log("Something went wrong"));
  }, []);

  const getDirections = async (startLoc, destinationLoc ) => {
    try {
      const KEY = GOOGLE_MAPS_APIKEY;
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`);
      let respJson = await resp.json();
      let points = decode(respJson.routes[0].overview_polyline.points);
      console.log(points);
      let coords = points.map((point, index) => {
        return {
          latitude: point[0],
          longitude: point[1]
        };
      });
      return coords;
    } 
    catch (error) {
      return error;
    }
  }

  return (
  <View style={styles.container}>
    <MapView 
      initialRegion={BATH_INITIAL_REGION}
      style={styles.map}
      //onRegionChangeComplete -> runs when user stops dragging MapView
      onRegionChangeComplete={(region) => setRegion(region)}
    >
      {markerElements}
      {coords.length > 0 && <Polyline coordinates={coords} strokeColor={"#000"} strokeWidth={3}/>}
      {/* <Polyline 
        coordinates={[
          {longitude: DUMMY_LOCATIONS[0].longitude, latitude: DUMMY_LOCATIONS[0].latitude}, 
          {longitude: DUMMY_LOCATIONS[1].longitude, latitude: DUMMY_LOCATIONS[1].latitude},
          {longitude: DUMMY_LOCATIONS[2].longitude, latitude: DUMMY_LOCATIONS[2].latitude},
        ]}
        strokeColor={"#000"}
        strokeWidth={3}
        lineDashPattern={[1]}
      /> */}
    </MapView>
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