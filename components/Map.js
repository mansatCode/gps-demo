import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps'
import { decode } from "@mapbox/polyline"
import { GOOGLE_MAPS_APIKEY } from '@env'
import Geolocation from "react-native-geolocation-service"
import * as Location from 'expo-location'
import Constants from "expo-constants"
import InputAutocomplete from './InputAutocomplete'

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;



const Map = () => {
  const [region, setRegion] = useState(BATH_INITIAL_REGION);
  const [coords, setCoords] = useState([]);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");

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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      let location = await Location.getCurrentPositionAsync({})
      setOrigin(location)
    })();
  }, []);

  // Use the user's current location as the ORIGIN of the route
  useEffect(() => {
    let originLat = origin?.coords?.latitude
    let originLong = origin?.coords?.longitude
    console.log(`Origin: ${originLat}, ${originLong}`)
  }, [origin])
  useEffect(() => {
    console.log(`Destination: ${destination.latitude}, ${destination.longitude}`)
  }, [destination])
  // DELETABLE STUFF

  function onPlaceSelected(data, details = null) {
    const pos = {
      latitude: details?.geometry.location.lat,
      longitude: details?.geometry.location.lng,
    }
    setDestination(pos);
  } 
  
  const getDirections = async (startLoc, destinationLoc ) => {
    try {
      const KEY = GOOGLE_MAPS_APIKEY;
      let resp = await fetch(`https://maps.googleapis.com/maps/api/directions/json?origin=${startLoc}&destination=${destinationLoc}&key=${KEY}`);
      let respJson = await resp.json();
      let points = decode(respJson.routes[0].overview_polyline.points);
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
    <View style={styles.searchContainer}>
        <InputAutocomplete onPlaceSelected={onPlaceSelected}/>
    </View>
    <MapView 
      initialRegion={BATH_INITIAL_REGION}
      style={styles.map}
      showsUserLocation={true}
      followsUserLocation={true}
      provider={PROVIDER_GOOGLE}
      //onRegionChangeComplete -> runs when user stops dragging MapView
      onRegionChangeComplete={(region) => setRegion(region)}
    >
      {markerElements}
      {coords.length > 0 && <Polyline coordinates={coords} strokeColor={"#000"} strokeWidth={3}/>}
    </MapView>
  </View>
  );
}

export default Map

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  searchContainer: {
    position: "absolute",
    width: "90%",
    backgroundColor: "white",
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 4,
    padding: 8,
    borderRadius: 8,
    top: Constants.statusBarHeight,
  },
  input: {
    borderColor: "#888",
    borderWidth: 1,
  },
  button: {
    backgroundColor: "#bbb",
    paddingVertical: 12,
    marginTop: 16,
    borderRadius: 4,
  },
  buttonText: {
    textAlign: "center",
  },
});