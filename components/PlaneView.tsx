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
            fetchAndSetPlaneImg()
            setPlaneDataLoading(false)
        }
        for (const [key, value] of Object.entries(planeDetailsState)){
            if(value==undefined){
                setPlaneDetailsState(planeDetailsState=>({...planeDetailsState, key:"NO DATA"}))
            } 
        }

        
    },[planeDetailsState])

    async function fetchAndSetPlaneImg(){

        let imgUrl
        if(planeDetailsState.owner != "Unknown"){
            imgUrl = await fetchPlaneImageUrl(
                planeDetailsState.manufacturername=="Unknown"?"":planeDetailsState.manufacturername, 
                planeDetailsState.model=="Unknown"?"":planeDetailsState.model,
                planeDetailsState.owner
            )
        } else{
            imgUrl = await fetchPlaneImageUrl(
                planeDetailsState.manufacturername=="Unknown"?"":planeDetailsState.manufacturername, 
                planeDetailsState.model=="Unknown"?"":planeDetailsState.model,
                planeDetailsState.operator=="Unknown"?"":planeDetailsState.operator,
            )
        }
        setPlaneImageUrl(imgUrl)
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
            flex: 1,
            flexDirection: "row"
        },
        planeDataText:{
            fontSize: 20,
            color: "#dee1ff", 
            paddingLeft: 10, 
            paddingTop: 5, 
        },
        planeDataTextBold:{
            fontSize: 20,
            color: "white", 
            paddingLeft: 10, 
            paddingTop: 5, 
            fontWeight: "bold"
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
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "darkblue"
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
        }, 
        bottomDivider: {
            borderBottomColor: 'deepskyblue', 
            borderBottomWidth: 2 
        }, 
        planeCollectableText:{
            color: "chartreuse", 
            fontSize: 20,
            paddingLeft: 10, 
            paddingTop: 5, 
            fontWeight: "bold"
        },
        planeNotCollectableText:{
            color: "crimson", 
            fontSize: 20,
            paddingLeft: 10, 
            paddingTop: 5, 
            fontWeight: "bold"
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
        if (loggedUsername != "Not logged in"){

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
            
            <LinearGradient colors={["darkblue", "deepskyblue"]}
             style={{width: "100%", height: "74%"}}>
            <View style={styles.planeData}>
                <Text style={styles.planeDataTextBold}>icao24:</Text>
                <Text style={styles.planeDataText}>{plane.icao24}</Text>
            </View>
            <View style={styles.bottomDivider}/>
            <View style={styles.planeData}>
                <Text style={styles.planeDataTextBold}>Callsign: </Text>
                <Text style={styles.planeDataText}>{plane.callsign}</Text>
            </View>
            <View style={styles.bottomDivider}/>
            <View style={styles.planeData}>
                <Text style={styles.planeDataTextBold}>Country: </Text>
                <Text style={styles.planeDataText}>{plane.originCountry} {flagEmoji}</Text>
            </View>
            <View style={styles.bottomDivider}/>
            <View style={styles.planeData}>
                <Text style={styles.planeDataTextBold}>Velocity: </Text>
                <Text style={styles.planeDataText}>{plane.velocity} m/s</Text>
            </View>
            <View style={styles.bottomDivider}/>
            <View style={styles.planeData}>
                <Text style={styles.planeDataTextBold}>Barometric altitude: </Text>
                <Text style={styles.planeDataText}>{plane.baroAltitude} m</Text>
            </View>
            <View style={styles.bottomDivider}/>
            <View style={styles.planeData}>
                <Text style={styles.planeDataTextBold}>Geometric altitude: </Text>
                <Text style={styles.planeDataText}>{plane.geoAltitude} m</Text>
            </View>
            <View style={styles.bottomDivider}/>
            <View style={styles.planeData}>
                <Text style={styles.planeDataTextBold}>Plane distance:</Text>
                <Text style={plane.distance<=70?styles.planeCollectableText:styles.planeNotCollectableText}> {plane.distance} km</Text>
            </View>
            <View style={styles.bottomDivider}/>
            <View style={styles.planeData}>
                <Text style={styles.planeDataTextBold}>Owner: </Text>
                <Text style={styles.planeDataText}>{planeDetailsState.owner?planeDetailsState.owner:renderDataLoading()}</Text>
            </View>
            <View style={styles.bottomDivider}/>
            <View style={styles.planeData}>
                <Text style={styles.planeDataTextBold}>Operator: </Text>
                <Text style={styles.planeDataText}>{planeDetailsState.operator?planeDetailsState.operator:renderDataLoading()}</Text>
            </View>
            <View style={styles.bottomDivider}/>
            <View style={styles.planeData}>
                <Text style={styles.planeDataTextBold}>Manufacturer: </Text>
                <Text style={styles.planeDataText}>{planeDetailsState.manufacturername?planeDetailsState.manufacturername:renderDataLoading()}</Text>
            </View>
            <View style={styles.bottomDivider}/>
            <View style={styles.planeData}>
                <Text style={styles.planeDataTextBold}>Model: </Text>
                <Text style={styles.planeDataText}>{planeDetailsState.model?planeDetailsState.model:renderDataLoading()}</Text>
            </View>
            </LinearGradient>
            {renderSaveCardButton()}
        </View>
    )
}