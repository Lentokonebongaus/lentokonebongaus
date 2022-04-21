import { useState, useEffect, useContext} from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, FlatList, Image } from 'react-native';
// import { SvgUri } from "react-native-svg";
import Plane from '../util/Plane';
import Card from '../util/Card';
import { cardsDb } from "../util/Firebase"
import { LoggedUsernameContext } from '../util/LoggedUsernameProvider';
import { getDatabase, push, ref, onValue, update } from 'firebase/database';
import { LinearGradient } from 'expo-linear-gradient';
import { Wave, Grid } from 'react-native-animated-spinkit';
import {fetchPlaneDetails, fetchPlaneImageUrl} from '../util/planeDetails';
// import getFlagPath from '../util/getFlagPath';
import getFlagEmoji from '../util/getFlagEmoji';



export default function PlaneView({route, navigation}){
    const plane = route.params.plane
    const [planeDetailsState, setPlaneDetailsState] = useState({owner:"", manufacturername:"", model:"", operator:""})
    const [planeImageUrl, setPlaneImageUrl] = useState("")
    const [flagPath, setFlagPath] = useState("")
    const [flagEmoji, setFlagEmoji] = useState("")
    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)

    useEffect(()=>{
        setPlaneBackendDetails()
        // Currently using emojis instead of SVGs.
        // setFlagPath(getFlagPath(plane.originCountry))
        setFlagEmoji(getFlagEmoji(plane.originCountry))
    },[])


    useEffect(()=>{

        if(planeDetailsState.owner && planeDetailsState.manufacturername && planeDetailsState.model){
            fetchAndSetPlaneImg()
        }
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

    async function fetchAndSetPlaneImg(){
        const imgUrl = await fetchPlaneImageUrl(planeDetailsState.manufacturername, planeDetailsState.model, planeDetailsState.owner)
        setPlaneImageUrl(imgUrl)
    }

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
        // TODO: save plane image URL to card
        const newCard = new Card(plane, loggedUsername)
        console.log("PLANE:")
        console.log(plane)
        console.log("Saved card to DB:")
        console.log(newCard)
        push(cardsDb, newCard)
    }

    // TODO: move styles to styles.tsx
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
        dataLoading: {
            position: "absolute",
            marginLeft: 1000,
        },
        imageFrame: {
            height: 100,
            width: "100%",
        },
        imageLoading: {
            height: 100,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "deepskyblue"
        },
        grid: {
            
        },
        planeImage: {
            height: "100%",
            width: "100%",
        },
        flag: {
            height: 200,
            width: 200,
            position: "absolute",
            zIndex: 100
        }

    }

    
    const renderDataLoading = () =>{
        return(<Wave size={25} color="#FFF" style={styles.dataLoading}/>)
    }

    const renderImageLoading = () =>{
        return(
            <View style={styles.imageLoading}>
                <Grid size={100} style={styles.grid}/>
            </View>
        )
    }

    /* const renderFlag = () =>{
        console.log("Rendering flag")
        return(
            <SvgUri source={{ uri: "../assets/flag_svgs/FI.svg"}} width="100%"
            height="100%"/>
        )
    }*/

    return(
        <View style={{flex: 1, flexDirection: "column"}}>
            <View style={styles.imageFrame}>
                {planeImageUrl == "" && renderImageLoading()}
                {planeImageUrl != "" && <Image source={{uri: planeImageUrl}} style={styles.planeImage}></Image>}
            </View>
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>icao24: {plane.icao24}</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Callsign: {plane.callsign}</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Country: {plane.originCountry} {flagEmoji}</Text>
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
                <Text style={styles.planeDataText}>Owner: {planeDetailsState.owner?planeDetailsState.owner:renderDataLoading()}</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Operator: {planeDetailsState.operator?planeDetailsState.operator:renderDataLoading()}</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Manufacturer: {planeDetailsState.manufacturername?planeDetailsState.manufacturername:renderDataLoading()}</Text>
            </View>
            <LinearGradient colors={["rgba(0,0,200,10)", 'transparent']} style={styles.divider} />
            <View style={styles.planeData}>
                <Text style={styles.planeDataText}>Model: {planeDetailsState.model?planeDetailsState.model:renderDataLoading()}</Text>
            </View>
            
            <Button title="SAVE CARD" onPress={()=>{createCard(plane)}}></Button>
            <Button title="log current plane" onPress={()=>{console.log(plane)}}></Button>
            <Button title="log url" onPress={()=>{console.log("dsfasdf")}}></Button>


        </View>
    )
}