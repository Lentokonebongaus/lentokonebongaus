import { useState, useEffect, useContext } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, FlatList } from 'react-native';
import Plane from '../util/Plane';
import Card from '../util/Card';
import fetchPlaneDetails from "../util/planeDetails"
import { cardsDb } from "../util/Firebase"
import { LoggedUsernameContext } from '../util/LoggedUsernameProvider';
import { getDatabase, push, ref, onValue, update } from 'firebase/database';
import { LinearGradient } from 'expo-linear-gradient';
import { Wave } from 'react-native-animated-spinkit'


export default function PlaneView({route, navigation}){
    const plane = route.params.plane
    const [planeDetailsState, setPlaneDetailsState] = useState({owner:"", manufacturername:"", model:"", operator:""})
    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)

    useEffect(()=>{
        setPlaneBackendDetails()
    },[])

    useEffect(()=>{
        if(planeDetailsState.owner && !planeDetailsState.operator){
            setPlaneDetailsState(planeDetailsState=>({...planeDetailsState, operator:"Unknown"}))
        }
        for (const [key, value] of Object.entries(planeDetailsState)){
            console.log(value)
            if(value==undefined){
                setPlaneDetailsState(planeDetailsState=>({...planeDetailsState, key:"NO DATA"}))
            }
        }
    },[planeDetailsState])

    async function printPlaneDetails(icao24:String){
        const planeDetails = await fetchPlaneDetails(icao24)
        console.log(planeDetails)
    }

    async function setPlaneBackendDetails(){
        const planeDetails = await fetchPlaneDetails(plane.icao24).catch(error => {
            console.error("Error fetching plane details from backend. Backend most likely offline or in a different address.");
        });

        if(planeDetails.ok != false){
            setPlaneDetailsState(planeDetails)
            plane.setBackendDetails(planeDetails)
        } else{
            setPlaneDetailsState({owner:"NO DATA", manufacturername: "NO DATA", model: "NO DATA", operator: "NO DATA"})
        }
    }

    const createCard = (plane:Plane) => {
        const newCard = new Card(plane, loggedUsername)
        // TODO: Add card to database: cardsDb.push(###)
        console.log("PLANE:")
        console.log(plane)
        console.log("Saved card to DB:")
        console.log(newCard)
        push(cardsDb, newCard)
    }


    const styles = {
        divider:{
            
            height: 10
        },
        planeData:{
            backgroundColor: "deepskyblue",
            flex: 1,
        },
        planeDataText:{
            fontSize: 20,
        },
        background: {
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            height: 300,
          },
        loadingWave: {
            position: "absolute",
            marginLeft: 1000,
        }
    }

    const renderLoading = () =>{
        return(<Wave size={25} color="#FFF" style={styles.loadingWave}/>)
    }
    return(
        <View style={{flex: 1, flexDirection: "column"}}>
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>icao24: {plane.icao24}</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Callsign: {plane.callsign}</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Country: {plane.originCountry}</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Velocity: {plane.velocity} m/s</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Barometric altitude: {plane.baroAltitude} m</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Geometric altitude: {plane.geoAltitude} m</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Plane distance: {plane.distance} km</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Owner: {planeDetailsState.owner?planeDetailsState.owner:renderLoading()}</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Operator: {planeDetailsState.operator?planeDetailsState.operator:renderLoading()}</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Manufacturer: {planeDetailsState.manufacturername?planeDetailsState.manufacturername:renderLoading()}</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Model: {planeDetailsState.model?planeDetailsState.model:renderLoading()}</Text>
            </View>
            
            <Button title="SAVE CARD" onPress={()=>{createCard(plane)}}></Button>
            <Button title="log current plane" onPress={()=>{console.log(plane)}}></Button>
            <Button title="log backend details" onPress={()=>{printPlaneDetails(plane.icao24)}}></Button>


        </View>
    )
}