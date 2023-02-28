import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import { GOOGLE_MAPS_APIKEY } from '@env'
import * as Location from 'expo-location'
import Constants from "expo-constants"
import InputAutocomplete from './InputAutocomplete'
import MapViewDirections from 'react-native-maps-directions'

const { width, height } = Dimensions.get("window");
const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.02;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const Map = () => {
  const [origin, setOrigin] = useState();
  const [destination, setDestination] = useState();
  const [showDirections, setShowDirections] = useState(false);
  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const mapRef = useRef(null);

  const [waypoints, setWaypoints] = useState([
  {
    latitude: 51.382481020706635,
    longitude: -2.3812105369639043,
  }, 
  {
    latitude: 51.37685566810041, 
    longitude: -2.370529450651123,
  }]);

  const edgePaddingValue = 70;
  const edgePadding = {
    top: edgePaddingValue,
    right: edgePaddingValue,
    bottom: edgePaddingValue,
    left: edgePaddingValue,
  };

  const DUMMY_LOCATIONS = [
    {
      id: 1,
      latitude: 51.382481020706635,
      longitude: -2.3812105369639043,
      pinColor:"orange",
    },
    {
      id: 2,
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
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      let location = await Location.getCurrentPositionAsync({})
      setOrigin(location);
      moveCamera(location.coords);
    })();
  }, []);

  function onPlaceSelected(data, details = null) {
    const pos = {
      latitude: details?.geometry.location.lat,
      longitude: details?.geometry.location.lng,
    }
    setDestination(pos);
    moveCamera(pos);
  }

  function traceRoute() {
    if (origin && destination) {
      setShowDirections(true);
      mapRef.current?.fitToCoordinates([origin.coords, destination], { edgePadding });
    }
  }

  function traceRouteOnReady(args) {
    if (args) {
      setDistance(args.distance);
      setDuration(args.duration);
    }
  }

  async function moveCamera(pos) {
    const camera = await mapRef.current?.getCamera();
    if (camera) {
      camera.center = pos;
      mapRef.current?.animateCamera(camera, { duration: 1000 });
    }
  }

  return (
  <View style={styles.container}>
    <View style={styles.searchContainer}>
        <InputAutocomplete onPlaceSelected={onPlaceSelected}/>
        <TouchableOpacity style={styles.button} onPress={traceRoute}>
          <Text style={styles.buttonText}>Trace route</Text>
        </TouchableOpacity>
        {distance && duration ? (
          <View>
            <Text>Distance: {distance.toFixed(2)}</Text>
            <Text>Duration: {Math.ceil(duration)} min</Text>
          </View>
        ) : null}
    </View>
    <MapView
      testID="map"
      ref={mapRef}
      initialRegion={{
        longitude: origin ? origin.longitude : 0,
        latitude: origin ? origin.latitude : 0,
        latitudeDelta: 0.0225,
        longitudeDelta: 0.0225,
      }}
      style={styles.map}
      showsUserLocation={true}
      followsUserLocation={true}
      provider={PROVIDER_GOOGLE}
    >
      {destination && <Marker coordinate={{longitude: destination?.longitude, latitude: destination?.latitude}}/>}
      {showDirections && <MapViewDirections 
        origin={origin.coords}
        destination={destination}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={4}
        strokeColor="red"
        onReady={traceRouteOnReady}
        waypoints={waypoints}
      />}
      {/* {markerElements} */}
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