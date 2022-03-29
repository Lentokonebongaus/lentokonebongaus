import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import  planesData from '../util/planesData';
import fetchplanesData from '../util/planesData';
import Plane from "../util/Plane"
import distanceBetween from '../util/distanceBetween';
import * as Location from 'expo-location';
import { refreshPlanes, setGPSlocation } from "../util/locationFunctions";
import { styles } from '../util/styles';

export default function ListPlanes (props:any){
  const [location, setLocation] = useState({longitude:0, latitude:0});
  const [region, setRegion] = useState({longitude:24.9049634, latitude:60.2494251 , latitudeDelta: 0.20, longitudeDelta: 0.02});
  const [errorMsg, setErrorMsg] = useState("");
  const [planes, setPlanes] = useState<any[]>([])

  
  useEffect(() => {
    setGPSlocation(setLocation, setErrorMsg);
   
  }, []);

  useEffect(()=>{
    if(location.longitude != 0 && location.latitude != 0){
      refreshPlanes(location, setPlanes);
    }
  },[location])

  
  async function sortPlanes(sortBy: any){
    let sortedPlanes = [...planes].sort((a, b) => (a[sortBy] < b[sortBy] ? -1 : 1));
    setPlanes(sortedPlanes);
  }
  

  return (
    <View>
      {/*
      <View style={styles.refreshbutton}>
        <Button title='refresh' onPress={() => refreshPlanes(location, setPlanes)}/>
      </View>
      */}
      <View style={styles.horizontalMargin}>
        <Text style={styles.bLink} onPress={() => sortPlanes('icao24')}>Icao24</Text>
        <Text style={styles.bLink} onPress={() => sortPlanes('callsign')}>Callsign</Text>
        <Text style={styles.b2Link} onPress={() => sortPlanes('originCountry')}>Origin Country</Text>
        <Text style={styles.b}>Longitude</Text>
        <Text style={styles.b}>Latitude</Text>
      </View>
      <FlatList 
        keyExtractor={(item, index) => index.toString()} 
        renderItem={ ({item}) => 
        <View style={styles.horizontal}>
          <Text onPress={()=>{props.navigation.navigate("Plane", {plane:item})}}
            style={styles.planelink}>{item.icao24}</Text>
          <Text style={styles.listText}>{item.callsign}</Text>
          <Text style={styles.listText2}>{item.originCountry}</Text>
          <Text style={styles.listText}>{item.longitude}</Text>
          <Text style={{...styles.listText, marginRight:10}}>{item.latitude}</Text>
        </View> }
        data={planes}
      />
    </View>
  );
  
}