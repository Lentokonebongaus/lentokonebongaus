import { useContext, useState} from "react"
import { Text, View, SafeAreaView, ScrollView, Button, Image, Alert, ImageBackground } from "react-native";
import { Button as KittenButton, Icon, Layout, Spinner } from '@ui-kitten/components';
import { DataTable } from 'react-native-paper';
import { UserCardsContext, updateUserCardsContext } from "../util/UserCardsProvider";
import { getPlaneCurrentData, getPlaneDistance } from "../util/locationFunctions";
import Card from "../util/Card";
import { UserLocationContext } from "../util/UserLocationProvider";
import { LoggedUsernameContext } from "../util/LoggedUsernameProvider";
import { useSpring, easings, animated } from "react-spring";
import { useEffect } from "react";
import { Card as NativeCard} from "react-native-elements";
import { AntDesign } from '@expo/vector-icons'; 
import { styles as utilStyles } from '../util/styles';
import { getRandomCard, cardsDb, addCardWin, addCardLoss } from "../util/Firebase";
import { get } from 'firebase/database';



export default function PlayView (props:any){

    const { userCards, setUserCards } = useContext(UserCardsContext)
    const { userLocation, setUserLocation } = useContext(UserLocationContext)
    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)
    const [dataTableVisible, setDataTableVisible] = useState(true)
    const [scoreModifier1, setScoreModifier1] = useState(undefined)
    const [scoreModifier2, setScoreModifier2] = useState(undefined)
    const [currentPlayerCard, setCurrentPlayerCard] = useState(undefined)
    const [currentPlayerCardApiData, setCurrentPlayerCardApiData] = useState(undefined)
    const [currentPlayerCardTotalPoints, setCurrentPlayerCardTotalPoints] = useState(undefined)
    const [currentComputerCard, setCurrentComputerCard] = useState(undefined)
    const [currentComputerCardTotalPoints, setCurrentComputerCardTotalPoints] = useState(undefined)
    const [fetchingCurrentComputerCard, setFetchingCurrentComputerCard] = useState(false)
    const [currentComputerCardApiData, setCurrentComputerCardApiData] = useState({velocity:undefined, geometricAltitude:undefined, distance:undefined}) 
    const [currentPlayerPlanesData, setCurrentPlayerPlanesData] = useState([])
    const [planesCurrentDataLoaded, setPlanesCurrentDataLoaded] = useState(false)
    const [playerCards, setPlayerCards] = useState([])
    const [usedCards, setUsedCards] = useState([])
    const [round, setRound] = useState(1)
    const [points, setPoints] = useState({player:0, computer:0})
    const [flip, set] = useState(false);
    const modifierClasses = ["altitude","velocity","distance", "quality"]
    const AnimatedIcon = animated(AntDesign); 
    const MAX_ROUNDS = 5

    const PlayIcon = (props) => (
        <Icon {...props} name='play-circle-outline'/>
    );

    const styles={
        cardsArea:{
            flex: 1,
            height: "100%",
            width: "100%",
            flexDirection: "column"
        },
        modifiersArea:{
            flex: 1,
            border: "solid",
            borderWidth: 1,
            borderColor: "blue",
        },
        playerArea:{
            flex: 4
      
        },
        computerArea:{
            flex: 4
        },
        tableRowCardUnavailable:{
            backgroundColor: "firebrick",
        },
        tableRowCardAvailable:{
        },
        dataTableCell:{
            width: 100
        }
    }

    function glow(start: number, end: number, color: string){
  
        const { textShadowColor, shadowOpacity, textShadowRadius, textShadowOffset } = useSpring({
          from: {
            textShadowColor: color,
            shadowOpacity: 0.8,
            textShadowRadius: start,
            textShadowOffset:{width: 0,height: 1}
          },
          to: {
            textShadowColor: color,
            shadowOpacity: 0.8,
            textShadowRadius: end,
            textShadowOffset:{width: 0,height: 1}
          },
          config: {
            duration: 2000,
            easing: easings.easeInOutQuart,
          },
          delay: 200,
          reset: true,
          reverse: flip,
          onRest: () => set(!flip),
        })
        return { textShadowColor, shadowOpacity, textShadowRadius, textShadowOffset };
    }

    let gold = glow(10, 40, "gold"); 
    let orange = glow(10, 30, "orange"); 
    let grey = glow(10, 15, "#c4c4c4");
    

    useEffect(()=>{
        fetchPlayerPlanesCurrentData()
        setRandomScoreModifiers()
    },[])

    useEffect(()=>{
        if(currentPlayerPlanesData.length > 0){
            setPlanesCurrentDataLoaded(true)
        }
    },[currentPlayerPlanesData])

    useEffect(()=>{
        if(round>MAX_ROUNDS){
            if(points.player > points.computer){
                Alert.alert("Congratulations!", "You won",[{text: "Return to home screen", onPress: () => props.navigation.navigate("Home"), style: "cancel"}])
            } else{
                Alert.alert("Too bad!", "You lost, better luck next time",[{text: "Return to home screen", onPress: () => props.navigation.navigate("Home"), style: "cancel"}])
            }
        }
        setRandomScoreModifiers()
    },[round])

    useEffect(()=>{
        if(currentComputerCardApiData.distance!=undefined && currentPlayerCardApiData.distance!=undefined){
            setCurrentPlayerCardTotalPoints(calculateCardPoints(currentPlayerCard, currentPlayerCardApiData))
            setCurrentComputerCardTotalPoints(calculateCardPoints(currentComputerCard, currentComputerCardApiData))
        }
    },[currentComputerCardApiData, currentPlayerCardApiData])


    async function fetchPlayerPlanesCurrentData(){
        let currentDataTmp = []
        for(let i = 0; i < userCards.length; i++){
            let currentPlaneData = await getPlaneCurrentData(userCards[i].planeIcao24, userLocation)
            currentDataTmp.push({icao24:userCards[i].planeIcao24, distance:currentPlaneData.distance, velocity:currentPlaneData.velocity, geometricAltitude:currentPlaneData.geometricAltitude})
        }
        setCurrentPlayerPlanesData(currentDataTmp)
    }

    const handleCardPick = (index) =>{
        if(currentPlayerPlanesData[index].distance != undefined){
            setCurrentPlayerCard(userCards[index])
            setCurrentPlayerCardApiData(currentPlayerPlanesData[index])
            setDataTableVisible(false)
            setRandomComputerCard()
        } else{
            Alert.alert("Plane not in use","Please pick a plane that is currently in use")
        }
    }

    function gaussianRandom() {
        var rand = 0;
        for (var i = 0; i < 6; i += 1) {
          rand += Math.random();
        }
        return rand / 6;
    }

    function gaussianRandomRange(start:number, end:number) {
        return start + gaussianRandom() * (end - start + 1);
    }
     
    const calculateCardPoints = (planeCard, apiData) =>{
        if(apiData.geometricAltitude == null){
            apiData.geometricAltitude = 1
        }
        let qualityPoints = scoreModifier1.type=="quality"?parseInt(planeCard.cardQuality)*scoreModifier1.multiplier:parseInt(planeCard.cardQuality)
        qualityPoints = scoreModifier2.type=="quality"?parseInt(planeCard.cardQuality)*scoreModifier2.multiplier:parseInt(planeCard.cardQuality)
        let velocityPoints = scoreModifier1.type=="velocity"?parseInt(apiData.velocity)*scoreModifier1.multiplier:parseInt(apiData.velocity)
        velocityPoints = scoreModifier2.type=="velocity"?parseInt(apiData.velocity)*scoreModifier2.multiplier:parseInt(apiData.velocity)
        let altitudePoints = scoreModifier1.type=="altitude"?parseInt(apiData.geometricAltitude)*scoreModifier1.multiplier:parseInt(apiData.geometricAltitude)
        altitudePoints = scoreModifier2.type=="altitude"?parseInt(apiData.geometricAltitude)*scoreModifier2.multiplier:parseInt(apiData.geometricAltitude)
        let distancePoints = scoreModifier1.type=="distance"?parseInt(apiData.distance)*scoreModifier1.multiplier:parseInt(apiData.distance)
        distancePoints = scoreModifier2.type=="distance"?parseInt(apiData.distance)*scoreModifier1.multiplier:parseInt(apiData.distance)
        const totalPoints = Math.floor(qualityPoints+velocityPoints*1.2+altitudePoints*0.7-distancePoints)
        return totalPoints
    }

    const setRandomScoreModifiers = () =>{
        const randIndex1 = Math.floor((Math.random()*modifierClasses.length+1)-1);
        let randIndex2 = Math.floor((Math.random()*modifierClasses.length+1)-1);
        while(randIndex2 == randIndex1){
            randIndex2 = Math.floor((Math.random()*modifierClasses.length+1)-1);
        }
        const scoreModifier1Type = modifierClasses[randIndex1]
        const scoreModifier2Type = modifierClasses[randIndex2]
        let scoreModifier1Multiplier
        let scoreModifier2Multiplier

        if (scoreModifier1Type == "model" || scoreModifier1Type == "manufacturer" || scoreModifier1Type == "owner" || scoreModifier1Type == "operator"){
            scoreModifier1Multiplier = Math.floor((Math.random()*modifierClasses.length*200)-200)
        } else{
            scoreModifier1Multiplier = gaussianRandomRange(0.1, 1.1)
        }

        if (scoreModifier2Type == "model" || scoreModifier2Type == "manufacturer" || scoreModifier2Type == "owner" || scoreModifier2Type == "operator"){
            scoreModifier2Multiplier = Math.floor((Math.random()*modifierClasses.length*200)-200)
        } else{
            scoreModifier2Multiplier = gaussianRandomRange(0.1, 1.1)
        }
        setScoreModifier1({type:scoreModifier1Type, multiplier:scoreModifier1Multiplier})
        setScoreModifier2({type:scoreModifier2Type, multiplier:scoreModifier2Multiplier})
    }

    async function updatePlayerCardStats(){
        get(cardsDb).then((snapshot)=>{
            const cardsArray = snapshot.val()
            const cardIds =  Object.keys(cardsArray)
            for (let i = 0; i < cardIds.length; i++){
                if(loggedUsername == cardsArray[cardIds[i]].cardOwner){
                    if(cardsArray[cardIds[i]].planeIcao24 == currentPlayerCard.planeIcao24){
                        if(currentPlayerCardTotalPoints>currentComputerCardTotalPoints){
                            addCardWin(cardIds[i], cardsArray[cardIds[i]])
                        } 
                        else if (currentPlayerCardTotalPoints<currentComputerCardTotalPoints){
                            addCardLoss(cardIds[i], cardsArray[cardIds[i]])
                        }
                    }
                }
            }
        })
    }

    async function updateComputerCardStats(){
        get(cardsDb).then((snapshot)=>{
            const cardsArray = snapshot.val()
            const cardIds =  Object.keys(cardsArray)
            for (let i = 0; i < cardIds.length; i++){
                if(loggedUsername == cardsArray[cardIds[i]].cardOwner){
                    if(cardsArray[cardIds[i]].planeIcao24 == currentComputerCard.planeIcao24){
                        if(currentComputerCardTotalPoints>currentPlayerCardTotalPoints){
                            addCardWin(cardIds[i], cardsArray[cardIds[i]])
                        } 
                        else if (currentComputerCardTotalPoints<currentPlayerCardTotalPoints){
                            addCardLoss(cardIds[i], cardsArray[cardIds[i]])
                        }
                    }
                }
            }
        })
    }

    async function setRandomComputerCard(){
        setFetchingCurrentComputerCard(true)
        let randomCard = {}
        let randomCardApiData = {velocity:undefined, geometricAltitude:undefined, distance:undefined}
        while(randomCardApiData.distance==undefined || randomCard.cardOwner == loggedUsername){
            randomCard = await getRandomCard()
            randomCardApiData = await getPlaneCurrentData(randomCard.planeIcao24, userLocation)
        }
        setCurrentComputerCard(randomCard)
        setCurrentComputerCardApiData(randomCardApiData)
        setFetchingCurrentComputerCard(false)
    }

    const startNewRound = () =>{
        if(currentPlayerCardTotalPoints>currentComputerCardTotalPoints){
            let newPoints = points
            newPoints.player = points.player+1
            setPoints(newPoints)
        }
        else if(currentPlayerCardTotalPoints<currentComputerCardTotalPoints){
            let newPoints = points
            newPoints.computer = points.computer+1
            setPoints(newPoints)
        }
        updateComputerCardStats()
        updatePlayerCardStats()
        setRound((round)=>round+1)
        setCurrentPlayerCard(undefined)
        setCurrentComputerCard(undefined)
        setDataTableVisible(true)
        setCurrentPlayerCardApiData({velocity:undefined, geometricAltitude:undefined, distance:undefined})
        setCurrentComputerCardApiData({velocity:undefined, geometricAltitude:undefined, distance:undefined})
        setCurrentPlayerCardTotalPoints(undefined)
        setCurrentComputerCardTotalPoints(undefined)
        updateUserCardsContext(setUserCards, loggedUsername)
    }

    /* 
    // Will crash Expo without any error messages for some reason (╯°□°)╯︵ ┻━┻ 

    const convertQualityToStarSize = (quality:number) =>{
        const CARD_STAR_LIMITS = [
            {stars: 5, maxQuality: 20000, minQuality: 10001},
            {stars: 4, maxQuality: 10000, minQuality: 7001},
            {stars: 3, maxQuality: 7000, minQuality: 4001},
            {stars: 2, maxQuality: 4000, minQuality: 2001},
            {stars: 1, maxQuality: 2000, minQuality: 0}
        ]
        const STAR_SIZE_MIN_MAX = {max:18, min:13}
        let qualityMinMax = undefined
        for (let i = 0; i < CARD_STAR_LIMITS.length; i++) {
          if(quality > CARD_STAR_LIMITS[i].minQuality && quality < CARD_STAR_LIMITS[i].maxQuality){
              qualityMinMax = {min:CARD_STAR_LIMITS[i].minQuality, max:CARD_STAR_LIMITS[i].maxQuality}
          }
        }
        if (qualityMinMax == undefined){
            return (STAR_SIZE_MIN_MAX.min)
        } else{
            const starSizesRange = (STAR_SIZE_MIN_MAX.max - STAR_SIZE_MIN_MAX.min)
            const qualityRange = (qualityMinMax.max - qualityMinMax.min)
            // Linear conversion
            const starSize = (((quality - qualityMinMax.min) * starSizesRange) / qualityRange) + STAR_SIZE_MIN_MAX
            return(starSize)
        }
    }
    */


    // -------------------------------------- Render Functions ------------------------------------------------------------

    const renderSpinner = () =>{
        return(<Spinner size='giant'/>)
    }
          
    const renderCardsListLoading = () =>{
        return(
            <View style={{height: "100%", width: "100%",  display: "flex", alignItems: "center", justifyContent: "center"}}>
                    {renderSpinner()}
                    <Text style={{fontSize:20, marginTop: 20}}>Loading cards...</Text>
            </View>
        )
    }

    const renderDataTableRow = (card:Card, index:number) =>{
        if(userCards.includes(card.planeIcao24) == false){
            return(
            <DataTable.Row style={currentPlayerPlanesData[index].distance==undefined?styles.tableRowCardUnavailable:undefined} onPress={()=>{handleCardPick(index)}}>
                <DataTable.Cell style={styles.dataTableCell}>{currentPlayerPlanesData[index].velocity?parseInt(currentPlayerPlanesData[index].velocity):null} <Text>{currentPlayerPlanesData[index].velocity!=undefined?"m/s":null}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{currentPlayerPlanesData[index].geometricAltitude?parseInt(currentPlayerPlanesData[index].geometricAltitude):null}<Text>{currentPlayerPlanesData[index].geometricAltitude!=undefined?" km":null}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{currentPlayerPlanesData[index].distance?parseInt(currentPlayerPlanesData[index].distance):null}<Text>{currentPlayerPlanesData[index].distance!=undefined?" km":null}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{card.cardQuality}</DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}><Text style={currentPlayerPlanesData[index].distance==undefined?undefined:{color:"lime"}}>{currentPlayerPlanesData[index].distance==undefined?"No":"Yes"}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{card.planeManufacturer}</DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{card.planeModel}</DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{card.planeOwner?card.planeOwner:card.planeOperator}</DataTable.Cell>
            </DataTable.Row>
            )
        }
    }

    const renderComputerCard = () =>{
        if(currentComputerCard != undefined && currentComputerCardApiData.distance != undefined){
            return(
                <NativeCard containerStyle={{backgroundColor: "#333C83", paddingHorizontal: 20, height:"80%"}} wrapperStyle={{backgroundColor: "#333C83"}}>
                    <View style={{display:"flex", flexDirection:"row"}}>
                    {currentComputerCard.planePicture != ""?  <Image source={{uri: currentComputerCard.planePicture}} style={{width: 200, height: 100, alignSelf: "center"}}/>: null}
                        <View>
                            {currentComputerCard.cardQuality > 10000? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                    {Array.from({ length: 5 }, (_, i) => 
                                    <AnimatedIcon name="star" size={18} color="gold" style={gold}/>)}
                                </Text>: null 
                            }
                            {currentComputerCard.cardQuality > 7000 && currentComputerCard.cardQuality <= 10000? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                    {Array.from({ length: 4 }, (_, i) => 
                                    <AnimatedIcon name="star" size={18} color="orange" style={orange}/>)}
                                </Text>: null 
                            }
                            {currentComputerCard.cardQuality > 4000 && currentComputerCard.cardQuality <= 7000? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                    {Array.from({ length: 3 }, (_, i) => 
                                    <AnimatedIcon name="star" size={18} color="#c4c4c4" style={grey}/>)}
                                </Text>: null 
                            }
                                {currentComputerCard.cardQuality > 2000 && currentComputerCard.cardQuality <= 4000? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                {Array.from({ length: 2 }, (_, i) => 
                                    <AntDesign name="star" size={18} color="#c41c10"/>)}
                                </Text>
                                : null 
                            }
                                {currentComputerCard.cardQuality <= 2000? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                <AntDesign name="star" size={18} color="white" /></Text>: null
                            }
                        </View>
                        <View style={{position:"absolute", top: 30, right: 10}}>
                            <Text style={utilStyles.cardTextSmall}>Card wins: {currentComputerCard.wins}</Text>
                            <Text style={utilStyles.cardTextSmall}>Card losses: {currentComputerCard.losses}</Text>
                        </View>
                    </View>
                    <NativeCard.Divider/>
                    <View style={{display:"flex", flexDirection:"row"}}>
                        <View style={{marginRight: 10, maxWidth:"50%"}}>
                            <Text style={utilStyles.cardTextSmall}>{currentComputerCard.planeManufacturer}</Text>
                            <Text style={utilStyles.cardTextSmall}>{currentComputerCard.planeModel}</Text>
                            <Text style={utilStyles.cardTextSmall}>{currentComputerCard.planeOwner}</Text>
                            <Text style={utilStyles.cardTextSmall}>Card owner: {currentComputerCard.cardOwner}</Text>
                        </View>
                        <View style={{maxWidth:"50%"}}>
                            <Text style={utilStyles.cardTextSmall}>Card quality: {currentComputerCard.cardQuality}</Text>
                            <Text style={utilStyles.cardTextSmall}>Current altitude: {currentComputerCardApiData.geometricAltitude?Math.floor(currentComputerCardApiData.geometricAltitude):null} km</Text>
                            <Text style={utilStyles.cardTextSmall}>Current velocity: {currentComputerCardApiData.velocity?Math.floor(currentComputerCardApiData.velocity):null} m/s</Text>
                            <Text style={utilStyles.cardTextSmall}>Distance: {Math.floor(currentComputerCardApiData.distance)} km</Text>
                        </View>
                    </View>        
                </NativeCard>
            )
        }
    }

    const renderPlayerCard = () =>{
        if(currentPlayerCard != undefined && currentPlayerCardApiData.distance != undefined){
            return(
                <NativeCard containerStyle={{backgroundColor: "#333C83", paddingHorizontal: 20, height:"80%"}} wrapperStyle={{backgroundColor: "#333C83"}}>
                        <View style={{display:"flex", flexDirection:"row"}}>
                        {currentPlayerCard.planePicture != ""?  <Image source={{uri: currentPlayerCard.planePicture}} style={{width: 200, height: 100, alignSelf: "center"}}/>: null}
                            <View>
                                {currentPlayerCard.cardQuality > 10000? 
                                    <Text style={{textAlign: "center", paddingBottom: 10}}>
                                        {Array.from({ length: 5 }, (_, i) => 
                                        <AnimatedIcon name="star" size={18} color="gold" style={gold}/>)}
                                    </Text>: null 
                                }
                                {currentPlayerCard.cardQuality > 7000 && currentPlayerCard.cardQuality <= 10000?
                                    <Text style={{textAlign: "center", paddingBottom: 10}}>
                                        {Array.from({ length: 4 }, (_, i) => 
                                        <AnimatedIcon name="star" size={18} color="orange" style={orange}/>)}
                                    </Text>: null 
                                }
                                {currentPlayerCard.cardQuality > 4000 && currentPlayerCard.cardQuality <= 7000? 
                                    <Text style={{textAlign: "center", paddingBottom: 10}}>
                                        {Array.from({ length: 3 }, (_, i) => 
                                        <AnimatedIcon name="star" size={18} color="#c4c4c4" style={grey}/>)}
                                    </Text>: null 
                                }
                                    {currentPlayerCard.cardQuality > 2000 && currentPlayerCard.cardQuality <= 4000? 
                                    <Text style={{textAlign: "center", paddingBottom: 10}}>
                                    {Array.from({ length: 2 }, (_, i) => 
                                        <AntDesign name="star" size={18} color="#c41c10"/>)}
                                    </Text>
                                    : null 
                                }
                                    {currentPlayerCard.cardQuality <= 2000? 
                                    <Text style={{textAlign: "center", paddingBottom: 10}}>
                                    <AntDesign name="star" size={18} color="white" /></Text>: null
                                }
                            </View>
                            <View style={{position:"absolute", top: 30, right: 10}}>
                                <Text style={utilStyles.cardTextSmall}>Card wins: {currentPlayerCard.wins}</Text>
                                <Text style={utilStyles.cardTextSmall}>Card losses: {currentPlayerCard.losses}</Text>
                            </View>
                        </View>
                    <NativeCard.Divider/>
                    <View style={{display:"flex", flexDirection:"row"}}>
                        <View style={{marginRight: 10, maxWidth:"50%"}}>
                            <Text style={utilStyles.cardTextSmall}>{currentPlayerCard.planeManufacturer}</Text>
                            <Text style={utilStyles.cardTextSmall}>{currentPlayerCard.planeModel}</Text>
                            <Text style={utilStyles.cardTextSmall}>{currentPlayerCard.planeOwner}</Text>
                        </View>
                        <View style={{maxWidth:"50%"}}>
                            <Text style={utilStyles.cardTextSmall}>Card quality: {currentPlayerCard.cardQuality}</Text>
                            <Text style={utilStyles.cardTextSmall}>Current altitude: {currentPlayerCardApiData.geometricAltitude?Math.floor(currentPlayerCardApiData.geometricAltitude):null} km</Text>
                            <Text style={utilStyles.cardTextSmall}>Current velocity: {currentPlayerCardApiData.velocity?Math.floor(currentPlayerCardApiData.velocity):null} m/s</Text>
                            <Text style={utilStyles.cardTextSmall}>Distance: {Math.floor(currentPlayerCardApiData.distance)} km</Text>
                        </View>
                    </View>        
                </NativeCard>
            )
        }
    }

    const renderDataTable = () =>{
        return(
            <SafeAreaView>
                <ScrollView horizontal>
                <ScrollView>
                    <DataTable>
                        <DataTable.Header>
                            <DataTable.Title>Velocity</DataTable.Title>
                            <DataTable.Title>Altitude</DataTable.Title>
                            <DataTable.Title>Distance</DataTable.Title>
                            <DataTable.Title>Quality</DataTable.Title>
                            <DataTable.Title>In use</DataTable.Title>
                            <DataTable.Title>Manufacturer</DataTable.Title>
                            <DataTable.Title>Model</DataTable.Title>
                            <DataTable.Title>Operator</DataTable.Title>
                        </DataTable.Header>
                        {userCards.map((card, index)=>renderDataTableRow(card, index))}
                    </DataTable>
                </ScrollView>
                </ScrollView>
            </SafeAreaView>
        )
    }

    const roundInfoScreen = () =>{
        if(fetchingCurrentComputerCard){
            return(  
                <View style={{height: "100%", width: "100%",  display: "flex", alignItems: "center", justifyContent: "center"}}>
                    {renderSpinner()}
                    <Text style={{color:"black",fontSize:20, marginTop: 20}}>Loading opponent's card...</Text>
                    <Text style={{fontSize:20, marginTop: 20}}>🤖</Text>
                </View>
            )
        } else{
            if(round<5){
                return(
                    <View style={{height: "100%", width: "100%"}}>
                        <Text style={{fontSize: 18, zIndex: 10, left:50, top: 20, color:points.player>points.computer?"lawngreen":"black"}}>Player: {points.player}</Text>
                        <Text style={{fontSize: 18, zIndex: 10, right: 50, top: 20, position: "absolute", color:points.computer>points.player?"lawngreen":"black"}}>🤖: {points.computer}</Text>
                        <View style={{position: "absolute", backgroundColor:"deepskyblue", height: "100%", width: "100%", justifyContent:"center"}}>
                            <Text style={{textAlign:"center", fontSize:30}}>Round {round}/5</Text>  
                            <Text style={{textAlign:"center", fontSize:23}}>Select a card</Text>  
                        </View>
                    </View>
                )
            } else{
                return(
                    <View style={{backgroundColor:"dodgerblue", height: "100%", width: "100%", justifyContent:"center"}}>
                        <Text style={{textAlign:"center", fontSize:30}}>Final round!</Text>  
                        <Text style={{textAlign:"center", fontSize:23}}>Select a card</Text>  
                    </View>
                )
            }
        }
    }

    const renderScoreModifiersText = () =>{
        if(scoreModifier1!=undefined && scoreModifier2!=undefined){
            let scoreModifierTextColors = [scoreModifier1, scoreModifier2]
            for (let i = 0; i < scoreModifierTextColors.length; i++){
                if(scoreModifierTextColors[i].type == "distance"){
                    if(scoreModifierTextColors[i].multiplier.toFixed(1) > 1.0){
                        scoreModifierTextColors[i] = "red"
                    } else{
                        scoreModifierTextColors[i] = "lime"
                    }
                } else{
                    if(scoreModifierTextColors[i].multiplier.toFixed(1) >= 1.0){
                        scoreModifierTextColors[i] = "lime"
                    } else{
                        scoreModifierTextColors[i] = "red"
                    }
                }
            }
            
            return(
                <View style={{height:"100%", width:"50%", display: "flex", flexDirection:"row", marginLeft: 10}}>
                    <View style={{height:"100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
                        <Text>Score modifiers:</Text>
                    </View>
                    <View style={{height:"100%", display: "flex", alignItems: "center", justifyContent: "center", marginLeft:10}}>
                        <Text style={{fontSize:(14*scoreModifier1.multiplier.toFixed(1)), color:scoreModifierTextColors[0]}}>{scoreModifier1.type}: {scoreModifier1.multiplier.toFixed(1)}</Text>
                        <Text style={{fontSize:(14*scoreModifier2.multiplier.toFixed(1)), color:scoreModifierTextColors[1]}}>{scoreModifier2.type}: {scoreModifier2.multiplier.toFixed(1)}</Text>
                    </View>
                </View>
            )
        }
    }

    const renderComputerTotalPoints = () =>{
        return(
            <View style={{width: "100%", borderBottomWidth: 1, borderStyle:"solid", borderColor: currentComputerCardTotalPoints>currentPlayerCardTotalPoints?"lime":"red", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <View style={{display:"flex", flexDirection:"row"}}>
                    <Text>🤖 total points: </Text>
                    <Text style={{color:currentComputerCardTotalPoints>currentPlayerCardTotalPoints?"limegreen":"red"}}>{currentComputerCardTotalPoints}</Text>
                </View>
            </View>
        )
    }

    const renderPlayerTotalPoints = () =>{
        return(
            <View style={{width: "100%", borderBottomWidth: 1, borderStyle:"solid", borderColor: currentComputerCardTotalPoints<currentPlayerCardTotalPoints?"lime":"red", display: "flex", alignItems: "center", justifyContent: "center"}}>
                <View style={{display:"flex", flexDirection:"row"}}>
                    <Text>Player total points: </Text>
                    <Text style={{color:currentComputerCardTotalPoints<currentPlayerCardTotalPoints?"limegreen":"red"}}>{currentPlayerCardTotalPoints}</Text>
                </View>
            </View>
        )
    }


    return (
        <View style={{flex:1}}>
            <View style={styles.cardsArea}>
                <View style={styles.computerArea}>
                    {currentComputerCardTotalPoints!=undefined?renderComputerTotalPoints():null}
                    {currentComputerCard==undefined?roundInfoScreen():renderComputerCard()}
                </View>
                <View style={styles.modifiersArea}>
                    {renderScoreModifiersText()}
                    {currentComputerCard!=undefined&&currentPlayerCard!=undefined?<KittenButton size="small" style={{width:100, height: "100%", position:"absolute",right:0}} status='success' accessoryLeft={PlayIcon} onPress={()=>{startNewRound()}}/>:null}
                </View>
                <View style={styles.playerArea}>
                    {currentPlayerCardTotalPoints!=undefined?renderPlayerTotalPoints():null}
                    {!planesCurrentDataLoaded&&currentPlayerCard==undefined?renderCardsListLoading():dataTableVisible?renderDataTable():null}
                    {renderPlayerCard()}
                </View>
            </View>
        </View>
    );
}