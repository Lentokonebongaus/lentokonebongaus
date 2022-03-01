import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import {PROVIDER_GOOGLE} from 'react-native-maps';
// Hakee ainakin Androidilla sijainnin expo-location -kirjaston avulla. Kannattaa vielä testata, että toimii myös iOS:llä. -Eeli 
import * as Location from 'expo-location';
import { async } from '@firebase/util';
import  planesData from '../planesData';
import Plane from "../Plane"
import distanceBetween from '../distanceBetween';
import fetchplanesData from '../planesData';


export default function Map() {
 
  // Because MapView is rendered before user location is set, region state is used to set the initial map view to a pre-determined location.
  // A short loading screen would maybe be another, more adequate solution? -Eeli
  const [location, setLocation] = useState({longitude:0, latitude:0});
  const [region, setRegion] = useState({longitude:24.9049634, latitude:60.2494251 , latitudeDelta: 0.20, longitudeDelta: 0.02});
  const [errorMsg, setErrorMsg] = useState("");
  const [planes, setPlanes] = useState<any[]>([])
  const [fetchedPlanesArray, setFetchedPlanes] = useState<any[]>([])

  
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

    for(let i = 0; i < planesData.length; i++){
      let planeInArray = false

      /*
      // For updating already existing planes in planes array. Would need to be updated through set hook, so probably needs a filtering function.
      // Will do later, but for now this function will create duplicate markers for every plane.
      for(let j = 0; j < planes.length; i++){
        if(planes[i].icao24 == planesData[i][0]){}
          planeInArray = true
        }*/
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
    console.log("LOCATION")
    setLocation({longitude:userGpsLocation.coords.longitude, latitude:userGpsLocation.coords.latitude});
  }

  // Plane markers are rendered only after refreshing Expo :( 
  // Might have something to do with conditional rendering and planes state being empty initially. 
  return (
    <View style={styles.container}>
      <MapView 
        style={{height: '100%', width: '100%'}} 
        provider={PROVIDER_GOOGLE} 
        showsUserLocation={true} 
        showsCompass={true} 
        showsScale={true} 
        showsTraffic={false}
        initialRegion={region}
      >
        {
          planes.map((plane, index) => {
            if(plane.latitude && plane.longitude){
              return(
                <Marker
                  key={index}
                  coordinate={{
                    latitude: plane.latitude,
                    longitude: plane.longitude,
                  }}
                  title={plane.icao24}
                />
              )
            }
          })
        } 
      </MapView>
      <Button title='log_and_refresh' onPress={()=>{console.log(planes);refreshPlanes(location)}}></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
