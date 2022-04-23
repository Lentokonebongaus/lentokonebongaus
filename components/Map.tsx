import { useState, useEffect, useContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, Image } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import {PROVIDER_GOOGLE} from 'react-native-maps';
import * as Location from 'expo-location';
import { async } from '@firebase/util';
import  planesData from '../util/planesData';
import Plane from "../util/Plane"
import distanceBetween from '../util/distanceBetween';
import fetchplanesData from '../util/planesData';
import planeIcon from '../assets/plane_icon.png'
import planeIconGrounded from '../assets/plane_icon_grounded.png'
import planeIconGroundedCollected from '../assets/plane_icon_grounded_collected.png'
import planeIconCollected from '../assets/plane_icon_collected.png'
import { cardsDb } from '../util/Firebase';
import { refreshPlanes, setGPSlocation } from '../util/locationFunctions';
import { getDatabase, push, ref, onValue, update, get } from 'firebase/database';
import { LoggedUsernameContext } from '../util/LoggedUsernameProvider';
import { UserCardsContext, updateUserCardsContext } from '../util/UserCardsProvider';
import { styles } from '../util/styles';


export default function Map(props:any) {
 
  // Because MapView is rendered before user location is set, region state is used to set the initial map view to a pre-determined location.
  // A short loading screen would maybe be another, more adequate solution? -Eeli
  const [location, setLocation] = useState({longitude:0, latitude:0});
  const [initialLocationChanged, setInitialLocationChanged] = useState(false)
  const [region, setRegion] = useState({longitude:24.9049634, latitude:60.2494251 , latitudeDelta: 0.20, longitudeDelta: 0.02});
  const [errorMsg, setErrorMsg] = useState("");
  const [planes, setPlanes] = useState<any[]>([])
  const [userCardIcaos, setUserCardIcaos] = useState([])
  const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)
  const { userCards, setUserCards } = useContext(UserCardsContext)

  
  useEffect(() => {
    setGPSlocation(setLocation, setErrorMsg)
    updateUserCardsContext(setUserCards, loggedUsername)
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
  
  const getPlaneIcon = (plane:Plane) => {

    const planeInUserCards = icao24NotInUsersCards(plane.icao24)
    if(plane.onGround && !planeInUserCards){
      return planeIconGrounded
    } else if (plane.onGround && planeInUserCards){
      return planeIconGroundedCollected
    } else if (!plane.onGround && planeInUserCards){
      return planeIconCollected
    } else {
      return planeIcon
    }
  }

  function icao24NotInUsersCards(icao24:String){

    const cardIds = Object.keys(userCards)
      for (let i = 0; i < cardIds.length; i++){
        if(userCards[cardIds[i]].planeIcao24 == icao24){
          return true
        }
      }
      return false
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
        {planes?
          planes.map((plane, index) => {
            if(plane.latitude && plane.longitude){
              return(
                <Marker
                  icon={getPlaneIcon(plane)}
                  key={index}
                  coordinate={{
                    latitude: plane.latitude,
                    longitude: plane.longitude,
                  }}
                  title={plane.icao24}
                  onPress={()=>{props.navigation.navigate("Plane", {plane:plane, location:location})}}
                  // plane_icon.png isn't currently aligned with Plane object's trueTrack attribute, so even though trueTrack is measured in degrees
                  // similar to Marker component's rotation prop, png file's unalignment needs to be taken into account. 
                  rotation={plane.trueTrack+50}
                />
              )
            }
          }):undefined
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
    </View>
  );
}
