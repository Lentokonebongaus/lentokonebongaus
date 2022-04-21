import { useState, useEffect, useContext } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import Plane from '../util/Plane';
import Card from '../util/Card';
import fetchPlaneDetails from "../util/planeDetails"
import { cardsDb } from "../util/Firebase"
import { LoggedUsernameContext } from '../util/LoggedUsernameProvider';
import { getDatabase, push, ref, onValue, update } from 'firebase/database';



export default function PlaneView({route, navigation}){
    const plane = route.params.plane
    const [planeDetailsState, setPlaneDetailsState] = useState({owner:"", manufacturername:"", model:""})
    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)

    useEffect(()=>{
        setPlaneBackendDetails()
    },[])

    async function printPlaneDetails(icao24:String){
        const planeDetails = await fetchPlaneDetails(icao24)
        console.log(planeDetails)
    }

    async function setPlaneBackendDetails(){
        const planeDetails = await fetchPlaneDetails(plane.icao24).catch(error => {
            console.error("Error fetching plane details from backend. Backend most likely offline or in a different address.");
        });
        plane.setBackendDetails(planeDetails)
        setPlaneDetailsState(planeDetails)
    }

    //---
    function notDuplicateCard(cardSnapshot:Object, newCard:Card) {
        
        const cardsArray = cardSnapshot.val()
        const cardIds =  Object.keys(cardsArray)
        for (let i = 0; i < cardIds.length; i++){
            if(loggedUsername == cardsArray[cardIds[i]].cardOwner){
                if(cardsArray[cardIds[i]].planeIcao24 == newCard.planeIcao24){
                    return false;
                }
            }
        }
        return true;
    }

    const saveNewCard = (newCard:Card) => {
        if (newCard.planeModel){
            onValue(cardsDb, (snapshot) => {
                if(notDuplicateCard(snapshot, newCard) == true){
                    push(cardsDb, newCard)
                    Alert.alert("Card saved to collection!")
                }
            })
        }
    }
    //----

    const createCard = (plane:Plane) => {
        const newCard = new Card(plane, loggedUsername)
        console.log("PLANE:")
        console.log(plane)
        console.log("CARD:")
        console.log(newCard)
        saveNewCard(newCard);
    }

    return(
        <View>
            <Text>icao24: {plane.icao24}</Text>
            <Text>Callsign: {plane.callsign}</Text>
            <Text>Country: {plane.originCountry}</Text>
            <Text>Velocity: {plane.velocity} m/s</Text>
            <Text>Barometric altitude: {plane.baroAltitude} m</Text>
            <Text>Geometric altitude: {plane.geoAltitude} m</Text>
            <Text>Plane distance: {plane.distance} km</Text>
            <Text>Owner: {planeDetailsState.owner}</Text>
            <Text>Manufacturer: {planeDetailsState.manufacturername}</Text>
            <Text>Model: {planeDetailsState.model}</Text>

            <Button title="SAVE CARD" onPress={()=>{createCard(plane)}}></Button>

            <Button title="log current plane" onPress={()=>{console.log(plane)}}></Button>
            <Button title="log backend details" onPress={()=>{printPlaneDetails(plane.icao24)}}></Button>


        </View>
    )
}