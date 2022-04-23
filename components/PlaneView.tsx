import { useState, useEffect, useContext} from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View, FlatList, Image } from 'react-native';
// import { SvgUri } from "react-native-svg";
import Plane from '../util/Plane';
import Card from '../util/Card';
import { cardsDb } from "../util/Firebase"
import { LoggedUsernameContext } from '../util/LoggedUsernameProvider';
import { UserCardsContext, updateUserCardsContext} from '../util/UserCardsProvider';
import { getDatabase, push, ref, onValue, update, get } from 'firebase/database';
import { LinearGradient } from 'expo-linear-gradient';
import { Wave, Grid } from 'react-native-animated-spinkit';
import {fetchPlaneDetails, fetchPlaneImageUrl} from '../util/planeDetails';
// import getFlagPath from '../util/getFlagPath';
import getFlagEmoji from '../util/getFlagEmoji';
import { Button as KittenButton, Layout, Text as KittenText, Spinner, Icon } from '@ui-kitten/components';



export default function PlaneView({route, navigation}){
    const plane = route.params.plane
    const location = route.params.location
    const [planeDetailsState, setPlaneDetailsState] = useState({owner:"", manufacturername:"", model:"", operator:""})
    const [planeImageUrl, setPlaneImageUrl] = useState("")
    const [flagPath, setFlagPath] = useState("")
    const [flagEmoji, setFlagEmoji] = useState("")
    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)
    const { userCards, setUserCards } = useContext(UserCardsContext)
    const [planeDataLoading, setPlaneDataLoading] = useState(true)
    const [planeAdded, setPlaneAdded] = useState(false)
    const [icao24InUserCards, setIcao24InUserCards] = useState(false)

    useEffect(()=>{
        setPlaneBackendDetails()
        // Currently using emojis instead of SVGs.
        // setFlagPath(getFlagPath(plane.originCountry))
        setFlagEmoji(getFlagEmoji(plane.originCountry))
        icao24NotInUsersCards(plane.icao24)
    },[])


    useEffect(()=>{

        if(planeDetailsState.owner || planeDetailsState.manufacturername || planeDetailsState.model){
            setPlaneDataLoading(false)
            fetchAndSetPlaneImg()
        }
        if(planeDetailsState.owner && !planeDetailsState.operator){
            setPlaneDetailsState(planeDetailsState=>({...planeDetailsState, operator:"Unknown"}))
        }
        for (const [key, value] of Object.entries(planeDetailsState)){
            if(value==undefined){
                setPlaneDetailsState(planeDetailsState=>({...planeDetailsState, key:"NO DATA"}))
            }
        }

        
    },[planeDetailsState])

    async function fetchAndSetPlaneImg(){
        const imgUrl = await fetchPlaneImageUrl(planeDetailsState.manufacturername, planeDetailsState.model, planeDetailsState.owner?planeDetailsState.owner:planeDetailsState.operator)
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

    async function icao24NotInUsersCards(icao24:String){
        get(cardsDb).then((snapshot)=>{
            const cardsArray = snapshot.val()
            const cardIds =  Object.keys(cardsArray)
            for (let i = 0; i < cardIds.length; i++){
                if(loggedUsername == cardsArray[cardIds[i]].cardOwner){
                    if(cardsArray[cardIds[i]].planeIcao24 == icao24){
                        setIcao24InUserCards(true)
                        return true
                    }
                }
            }
            setIcao24InUserCards(false)
        })
    }

    const saveCard = () => {
        const newCard = createCard()
        if (newCard.planeModel){
            get(cardsDb).then((snapshot)=>{
                if(notDuplicateCard(snapshot, newCard) == true){
                    push(cardsDb, newCard)
                    setPlaneAdded(true)
                    updateUserCardsContext(setUserCards, loggedUsername)
                }
            })
        }
    }

    const createCard = () => {
        const newCard = new Card(plane, loggedUsername, planeImageUrl)
        return newCard
    }


    //----------------------- UI Kitten -----------------------------

    const LoadingIndicator = (props) => (
        <View style={[props.style, styles.indicator]}>
          <Spinner size='small'/>
        </View>
    );

    const StarIcon = (props) => (
        <Icon {...props} name='star'/>
    );

    const ForbiddenIcon = (props) => (
        <Icon {...props} name='slash-outline'/>
    );

    //---------------------------------------------------------------


    // TODO: move styles to styles.tsx. UI could still be better, so keeping styles here for the sake of modifibiality.
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
            height: 150,
            width: "100%",
        },
        imageLoading: {
            height: 150,
            width: "100%",
            display: "flex",
            alignItems: "center",
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
        },
        indicator: {
            justifyContent: 'center',
            alignItems: 'center',
        }

    }

    
    //---------------------- Rendering functions --------------------------

    const renderDataLoading = () =>{
        return(<Wave size={25} color="#FFF" style={styles.dataLoading}/>)
    }

    const renderImageLoading = () =>{
        return(
            <View style={styles.imageLoading}>
                <Grid size={100} style={styles.grid} color="#25C8FF"/>
            </View>
        )
    }

    const renderSaveCardButton = () =>{
        if(icao24InUserCards){
            return(
                <KittenButton disabled={true}>
                    PLANE ALREADY ADDED
                </KittenButton>
            )
        }
        else if(planeDataLoading){
            return(
                <KittenButton style={styles.button} appearance='outline' accessoryLeft={LoadingIndicator}>
                    LOADING
                </KittenButton>
            )
        } 
        else if(!planeDataLoading && !planeAdded){
            if(planeDetailsState.manufacturername != "NO DATA" && planeDetailsState.model != "NO DATA"){
                return(
                    <KittenButton status='success' onPress={()=>saveCard()}>
                        ADD PLANE
                    </KittenButton>
                )
            } else{
                return(
                    <KittenButton disabled={true} accessoryRight={ForbiddenIcon}>
                        CAN'T ADD PLANE
                    </KittenButton>
                )
            }
        }
        else if (!planeDataLoading && planeAdded){
            return(
                <KittenButton status='success' accessoryRight={StarIcon}>
                    PLANE ADDED
                </KittenButton>
            )
        }
    }

    /* const renderFlag = () =>{
        console.log("Rendering flag")
        return(
            <SvgUri source={{ uri: "../assets/flag_svgs/FI.svg"}} width="100%"
            height="100%"/>
        )
    }*/

    //-----------------------------------------------------------------------------

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
            {renderSaveCardButton()}
        </View>
    )
}