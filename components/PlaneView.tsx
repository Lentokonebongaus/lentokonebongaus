import { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import Plane from '../util/Plane';
import fetchPlaneDetails from "../util/planeDetails"

export default function PlaneView({route, navigation}){
    const plane = route.params.plane
    
    async function printPlaneData(icao24:String){
        const planeDetails = await fetchPlaneDetails(icao24)
        console.log(planeDetails)
    }

    return(
    <View>
        <Text>icao24: {plane.icao24}</Text>
        <Text>Callsign: {plane.callsign}</Text>
        <Text>Country: {plane.originCountry}</Text>
        <Text>Velocity: {plane.velocity}</Text>
        <Text>Barometric altitude: {plane.baroAltitude}</Text>
        <Text>Geometric altitude: {plane.geoAltitude}</Text>
        <Button title="log" onPress={()=>{printPlaneData(plane.icao24)}}></Button>
    </View>)
}