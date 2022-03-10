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
  const [test, setTest] = useState(planes);

  // Note(markus): copypastet Map.tsx:stä
  useEffect(() => {
    setGPSlocation()
   
  }, []);

  useEffect(()=>{
    if(location.longitude != 0 && location.latitude != 0){
      refreshPlanes(location)
    }
  },[location])
  
<<<<<<< HEAD
  async function refreshPlanes(location: any){
    const planesData = await fetchplanesData(location)
    setPlanes([])
    for(let i = 0; i < planesData.length; i++){
      let newPlane = new Plane(planesData[i])
      setPlanes((planes)=>([...planes, newPlane]))
    }
  }
=======
      // PlanesData is fetching EVERY plane from OpenSky Network. 
      // Expo is throwing an error when sorting a JSON file that large, so currently only 100 first planes are set to planes state array. -Eeli
      // PlanesData => data.states[(0...).toString] = plane data
      planesData.then((data)=>{
        let distance = 3000
        for(let i = 0; i < 100; i++){
          let planeLat = data.states[i.toString()]["6"]
          let planeLon = data.states[i.toString()]["5"]
          if(distanceBetween(location.latitude, location.longitude, planeLat, planeLon) < distance){
            let newPlane = new Plane(data.states[i.toString()])
            setPlanes((planes)=>([...planes, newPlane]))
          }
        }
      })
      setPlanes(planes)
      console.log(planes);
  };
>>>>>>> 5184c5a (nätimmät napit)

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

  const clearPlanes = () => {
    setPlanes([]);
  }

  // Clear Data -> Refresh -> Sort napit = Ei tuplia + sort
  // Refresh -> Sort napit = tupla koneet + sort, t. Iida
  //todo: await niin vähemmän kikkailua
  const sortIcao = () => {
    let test2 = planes.sort((a, b) => (a.icao24 < b.icao24 ? -1 : 1));
    setTest(test2);
    console.log("icao24"); 
  }

  const sortCall = () => {
    let test3 = planes.sort((a, b) => (a.callsign < b.callsign ? -1 : 1));
    setTest(test3);
    console.log("callsign"); 
  }

  const sortCountry = () => {
    let test4 = planes.sort((a, b) => (a.originCountry < b.originCountry ? -1 : 1));
    setTest(test4);
    console.log("country"); 
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
        <View style={styles.refreshbutton}>
          <Button title='refresh' onPress={() => refreshPlanes(location)}/>
        </View>
        <View style={styles.horizontalMargin}>
          <Text style={styles.b}>icao24</Text>
          <Text style={styles.b}>callsign</Text>
          <Text style={styles.b2}>originCountry</Text>
          <Text style={styles.b}>longitude</Text>
          <Text style={styles.b}>latitude</Text>
        </View>
        <FlatList 
          keyExtractor={(item, index) => index.toString()} 
          renderItem={ ({item}) => 
          <View style={styles.horizontal}>
            <Text onPress={()=>{props.navigation.navigate("Plane", {plane:item})}}
              style={styles.planelink}>{item.icao24}</Text>
            <Text style={{flex:1}}>{item.callsign}</Text>
            <Text style={{flex:2}}>{item.originCountry}</Text>
            <Text style={{flex:1}}>{item.longitude}</Text>
            <Text style={{flex:1, marginRight:10}}>{item.latitude}</Text>
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
  planelink:{
    color: '#0000aa',
    flex: 1,
    marginLeft: 10,
    marginTop: 5
  },
  refreshbutton:{
    width: 150,
    margin: 5,
  }
}