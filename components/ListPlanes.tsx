import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import  planesData from '../planesData';
import fetchplanesData from '../planesData';
import Plane from "../Plane"
import distanceBetween from '../distanceBetween';
import * as Location from 'expo-location';

export default function ListPlanes (props:any){
  const [location, setLocation] = useState({longitude:0, latitude:0});
  const [region, setRegion] = useState({longitude:24.9049634, latitude:60.2494251 , latitudeDelta: 0.20, longitudeDelta: 0.02});
  const [errorMsg, setErrorMsg] = useState("");
  const [planes, setPlanes] = useState<any[]>([])

  

  // Note(markus): copypastet Map.tsx:stä
  useEffect(() => {
    setGPSlocation()
   
  }, []);

  useEffect(()=>{
    if(location.longitude != 0 && location.latitude != 0){
      refreshPlanes(location)
    }
  },[location])
  
  async function refreshPlanes(location: any){
    const planesData = await fetchplanesData(location)
    setPlanes([])
    for(let i = 0; i < planesData.length; i++){
      let newPlane = new Plane(planesData[i])
      setPlanes((planes)=>([...planes, newPlane]))
    }
  }

  async function setGPSlocation(){
    let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return false
      }
    const userGpsLocation = await Location.getCurrentPositionAsync({});
    setLocation({longitude:userGpsLocation.coords.longitude, latitude:userGpsLocation.coords.latitude});
  }
  // Note(markus): end copypastet Map.tsx:stä

  

  async function  sortIcao(){
    setPlanes([])
    await refreshPlanes(location);
    let test2 = planes.sort((a, b) => (a.icao24 < b.icao24 ? -1 : 1));
    setPlanes(test2);
    //console.log("icao24"); 
    
  }

  async function  sortCall(){
    setPlanes([])
    await refreshPlanes(location);
    let test3 = planes.sort((a, b) => (a.callsign < b.callsign ? -1 : 1));
    setPlanes(test3);
    //console.log("callsign"); 
  }

  async function sortCountry(){
    setPlanes([])
    await refreshPlanes(location);
    let test4 = planes.sort((a, b) => (a.originCountry < b.originCountry ? -1 : 1));
    setPlanes(test4);
    //console.log("country"); 
    
  }
  
  

  if (!planes){
    return (
      <View>
        <Text>Loading List</Text>
      </View>
    );
  } else {
    return (
      <View>
        {/*
        <View style={styles.refreshbutton}>
          <Button title='refresh' onPress={() => refreshPlanes(location)}/>
        </View>
          */}
        <View style={styles.horizontalMargin}>
          {/*<Button title="icao24" onPress={sortIcao}></Button>*/}
          <Text style={styles.bLink} onPress={sortIcao}>Icao24</Text>
          {/*<Button title="callsign" onPress={sortCall}></Button>*/}
          <Text style={styles.bLink} onPress={sortCall}>Callsign</Text>
          {/*<Button title="country" onPress={sortCountry}></Button>*/}
          <Text style={styles.b2Link} onPress={sortCountry}>Origin Country</Text>
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
}

const styles = {
  horizontal: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    justifyContent:'space-around',
  },
  horizontalMargin: {
    flexDirection: 'row',
    alignItems: 'flex-start', 
    justifyContent:'space-around',
    margin: 10,
  },
  b:{
    fontWeight: "bold",
    flex: 1
  },
  b2:{
    fontWeight: "bold",
    flex: 2
  },
  bLink:{
    fontWeight: "bold",
    flex: 1,
    color: '#006adb'
  },
  b2Link:{
    fontWeight: "bold",
    flex: 2,
    color: '#006adb'
  },
  planelink:{
    color: '#0000aa',
    flex: 1,
    marginLeft: 10,
    marginTop: 5
  },
  listText:{
    flex:1,
    marginTop:5
  },
  listText2:{
    flex:2,
    marginTop:5
  },
  refreshbutton:{
    width: 150,
    margin: 5,
  }
}