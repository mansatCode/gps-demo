import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete'
import { GOOGLE_MAPS_APIKEY } from '@env'

const InputAutocomplete = () => {
    return (
        <View>
            <GooglePlacesAutocomplete
                styles={{textInput: styles.input}}
                placeholder='Search'
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                }}
                query={{
                    key: GOOGLE_MAPS_APIKEY,
                    language: 'en',
                }}
            />
        </View>
    )
}

export default InputAutocomplete

const styles = StyleSheet.create({})