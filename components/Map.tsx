import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import {PROVIDER_GOOGLE} from 'react-native-maps';
// Hakee ainakin Androidilla sijainnin expo-location -kirjaston avulla. Kannattaa vielä testata, että toimii myös iOS:llä. -Eeli 
import * as Location from 'expo-location';
import { async } from '@firebase/util';
import  planesData from '../util/planesData';
import Plane from "../util/Plane"
import distanceBetween from '../util/distanceBetween';
import fetchplanesData from '../util/planesData';
import planeIcon from '../assets/plane_icon.png'
import { refreshPlanes, setGPSlocation } from '../util/locationFunctions';
import { styles } from '../util/styles';


export default function Map(props:any) {
 
  // Because MapView is rendered before user location is set, region state is used to set the initial map view to a pre-determined location.
  // A short loading screen would maybe be another, more adequate solution? -Eeli
  const [location, setLocation] = useState({longitude:0, latitude:0});
  const [initialLocationChanged, setInitialLocationChanged] = useState(false)
  const [region, setRegion] = useState({longitude:24.9049634, latitude:60.2494251 , latitudeDelta: 0.20, longitudeDelta: 0.02});
  const [errorMsg, setErrorMsg] = useState("");
  const [planes, setPlanes] = useState<any[]>([])
  
  useEffect(() => {
    setGPSlocation(setLocation, setErrorMsg)
  }, []);

  // refreshLoop can't be executed on inital load, as it would use unset GPS location (0,0) for every loop.
  // Also, a new refreshLoop can't be ran everytime location state changes, as it would create multiple concurrent loops that never break.
  // Therefore initialLocationChanged is used to run refreshLoop only once after a location is set. 
  useEffect(() => {
    if(initialLocationChanged == true){
      refreshLoop(location)
    }
  }, [initialLocationChanged])

  useEffect(()=>{
    if(location.longitude != 0 && location.latitude != 0){
      refreshPlanes(location, setPlanes)
      setInitialLocationChanged(true)
    }
  },[location])
  

  const refreshLoop = (location: any) =>{
    setInterval(()=>{refreshPlanes(location, setPlanes)},7000)
  }
  
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
                  icon={planeIcon}
                  key={index}
                  coordinate={{
                    latitude: plane.latitude,
                    longitude: plane.longitude,
                  }}
                  title={plane.icao24}
                  onPress={()=>{props.navigation.navigate("Plane", {plane:plane})}}
                  // plane_icon.png isn't currently aligned with Plane object's trueTrack attribute, so even though trueTrack is measured in degrees
                  // similar to Marker component's rotation prop, png file's unalignment needs to be taken into account. 
                  rotation={plane.trueTrack+50}
                >
                </Marker>
              )
            }
          })
        }
        <Circle 
          center={{latitude:location.latitude, longitude:location.longitude}} 
          radius={10000}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#e6e600",
            fillOpacity: 0.35,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            zIndex: 1
          }}
          >
        </Circle>
      </MapView>
      {/*<Button title='log_and_refresh' onPress={()=>{console.log(planes);refreshPlanes(location)}}></Button>*/}
    </View>
  );
}
