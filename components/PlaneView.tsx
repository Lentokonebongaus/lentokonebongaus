import { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import Plane from '../Plane';

export default function PlaneView({route, navigation}){
    const plane = route.params.plane
    
    return(
    <View>
        <Text>icao24: {plane.icao24}</Text>
        <Text>Callsign: {plane.callsign}</Text>
        <Text>Country: {plane.originCountry}</Text>
        <Text>Velocity: {plane.velocity}</Text>
        <Text>Barometric altitude: {plane.baroAltitude}</Text>
        <Text>Geometric altitude: {plane.geoAltitude}</Text>

        <Button title="log" onPress={()=>{console.log(plane)}}></Button>
    </View>)
}