import { useEffect, useState } from "react";
import { Button, FlatList, Text, View } from "react-native";
import  planesData from '../planesData';
import Plane from "../Plane"
import distanceBetween from '../distanceBetween';
import * as Location from 'expo-location';

export default function ListPlanes (){

  // Note(markus): copypastet Map.tsx:stä + haun tunkeminen omaan funktioon

  // Because MapView is rendered before user location is set, region state is used to set the initial map view to a pre-determined location.
  // A short loading screen would maybe be another, more adequate solution? -Eeli
  const [location, setLocation] = useState({longitude:0, latitude:0});
  const [region, setRegion] = useState({longitude:24.9049634, latitude:60.2494251 , latitudeDelta: 0.20, longitudeDelta: 0.02});
  const [errorMsg, setErrorMsg] = useState("");
  const [planes, setPlanes] = useState<any[]>([])

  
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
  
        let userGpsLocation = await Location.getCurrentPositionAsync({});
        setLocation({longitude:userGpsLocation.coords.longitude, latitude:userGpsLocation.coords.latitude});
      })();
  
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
  };

  // Note(markus): end copypastet Map.tsx:stä

  
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
        fontSize: 20,
        fontWeight: "bold"
    }
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
                <Button title='refresh' onPress={fetchData}/>
                <View style={styles.horizontalMargin}>
                    <Text style={styles.b}>icao24</Text>
                    <Text style={styles.b}>callsign</Text>
                    <Text style={styles.b}>originCountry</Text>
                    <Text style={styles.b}>longitude</Text>
                    <Text style={styles.b}>latitude</Text>
                </View>
                <FlatList 
                    keyExtractor={(item, index) => index.toString()} 
                    renderItem={ ({item}) => 
                    <View style={styles.horizontal}>
                        <Text>{item.icao24}</Text>
                        <Text>{item.callsign}</Text>
                        <Text>{item.originCountry}</Text>
                        <Text>{item.longitude}</Text>
                        <Text>{item.latitude}</Text>
                    </View> }
                    data={planes}
                />
            </View>
        );
    }
}