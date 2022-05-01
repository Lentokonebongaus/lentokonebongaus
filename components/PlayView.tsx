import { useContext, useState} from "react"
import { Text, View, SafeAreaView, ScrollView, Button, Image, Alert, ImageBackground } from "react-native";
import { Button as KittenButton, Icon, Layout, Spinner } from '@ui-kitten/components';
import { DataTable } from 'react-native-paper';
import { UserCardsContext } from "../util/UserCardsProvider";
import { getPlaneCurrentData, getPlaneDistance } from "../util/locationFunctions";
import Card from "../util/Card";
import { UserLocationContext } from "../util/UserLocationProvider";
import { LoggedUsernameContext } from "../util/LoggedUsernameProvider";
import { useSpring, easings, animated } from "react-spring";
import { useEffect } from "react";
import { Card as NativeCard} from "react-native-elements";
import { AntDesign } from '@expo/vector-icons'; 
import { styles as utilStyles } from '../util/styles';
import { getRandomCard } from "../util/Firebase";


export default function PlayView (props:any){

    const { userCards, setUserCards } = useContext(UserCardsContext)
    const { userLocation, setUserLocation } = useContext(UserLocationContext)
    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)
    const [cardPlayerDistance, setCardPlayerDistance] = useState("")
    const [cardComputerDistance, setCardComputerDistance] = useState(0)
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
    const MAX_ROUNDS = 5
    const [round, setRound] = useState(1)
    const [points, setPoints] = useState({player:0, computer:0})
    const [flip, set] = useState(false);
    //const modifierClasses = ["model", "manufacturer", "owner", "operator", "altitude", "velocity", "distance"]
    const modifierClasses = ["altitude","velocity","distance", "quality"]

    const AnimatedIcon = animated(AntDesign); 

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
            backgroundColor: "red",
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
        if(currentPlayerPlanesData.length > 0){
            setPlanesCurrentDataLoaded(true)
        }
    },[currentPlayerPlanesData])

    useEffect(()=>{
        fetchPlayerPlanesCurrentData()
        setRandomScoreModifiers()
    },[])

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

    async function fetchComputerCardCurrentApiData(){
        const planeData = await getPlaneCurrentData(currentComputerCard.planeIcao24, userLocation)
        setCurrentComputerCardApiData(planeData)
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
        // (ㆆ_ㆆ)
        let qualityPoints = scoreModifier1.type=="quality"?parseInt(planeCard.cardQuality)*scoreModifier1.multiplier:parseInt(planeCard.cardQuality)
        qualityPoints = scoreModifier2.type=="quality"?parseInt(planeCard.cardQuality)*scoreModifier2.multiplier:parseInt(planeCard.cardQuality)
        let velocityPoints = scoreModifier1.type=="velocity"?parseInt(apiData.velocity)*scoreModifier1.multiplier:parseInt(apiData.velocity)
        velocityPoints = scoreModifier2.type=="velocity"?parseInt(apiData.velocity)*scoreModifier2.multiplier:parseInt(apiData.velocity)
        let altitudePoints = scoreModifier1.type=="altitude"?parseInt(apiData.geometricAltitude)*scoreModifier1.multiplier:parseInt(apiData.geometricAltitude)
        altitudePoints = scoreModifier2.type=="altitude"?parseInt(apiData.geometricAltitude)*scoreModifier2.multiplier:parseInt(apiData.geometricAltitude)
        let distancePoints = scoreModifier1.type=="distance"?parseInt(apiData.distance)*scoreModifier1.multiplier:parseInt(apiData.distance)
        distancePoints = scoreModifier2.type=="distance"?parseInt(apiData.distance)*scoreModifier1.multiplier:parseInt(apiData.distance)
        const totalPoints = Math.floor(qualityPoints+velocityPoints+altitudePoints-distancePoints)

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

    const renderCardsListLoading = () =>{
        return(
            <View style={{height: "100%", width: "100%",  display: "flex", alignItems: "center", justifyContent: "center"}}>
                    {renderSpinner()}
                    <Text style={{fontSize:20, marginTop: 20}}>Loading cards...</Text>
            </View>
        )
    }

    async function setRandomComputerCard(){
        setFetchingCurrentComputerCard(true)
        let randomCard = {}
        let randomCardApiData = {velocity:undefined, geometricAltitude:undefined, distance:undefined}
        let logTries = 1
        while(randomCardApiData.distance==undefined || randomCard.cardOwner == loggedUsername){
            console.log(`Fetching random card on use. Try number ${logTries}`)
            randomCard = await getRandomCard()
            randomCardApiData = await getPlaneCurrentData(randomCard.planeIcao24, userLocation)
            logTries += 1
        }
        setCurrentComputerCard(randomCard)
        setCurrentComputerCardApiData(randomCardApiData)
        setFetchingCurrentComputerCard(false)
    }

    const getDataTableRow = (card:Card, index:number) =>{
        if(userCards.includes(card.planeIcao24) == false){
            return(
            <DataTable.Row style={currentPlayerPlanesData[index].distance==undefined?styles.tableRowCardUnavailable:undefined} onPress={()=>{handleCardPick(index)}}>
                <DataTable.Cell style={{width:50}}><Text style={currentPlayerPlanesData[index].distance==undefined?undefined:{color:"lime"}}>{currentPlayerPlanesData[index].distance==undefined?"No":"Yes"}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{card.planeManufacturer}</DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{card.planeModel}</DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{card.planeOwner?card.planeOwner:card.planeOperator}</DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{card.cardQuality}</DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{currentPlayerPlanesData[index].velocity?parseInt(currentPlayerPlanesData[index].velocity):null} <Text>{currentPlayerPlanesData[index].velocity!=undefined?"m/s":null}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{currentPlayerPlanesData[index].geometricAltitude?parseInt(currentPlayerPlanesData[index].geometricAltitude):null}<Text>{currentPlayerPlanesData[index].geometricAltitude!=undefined?" km":null}</Text></DataTable.Cell>
                <DataTable.Cell style={styles.dataTableCell}>{currentPlayerPlanesData[index].distance?parseInt(currentPlayerPlanesData[index].distance):null}<Text>{currentPlayerPlanesData[index].distance!=undefined?" km":null}</Text></DataTable.Cell>
            </DataTable.Row>
            )
        }
    }

    const renderComputerCard = () =>{
        if(currentComputerCard != undefined && currentComputerCardApiData.distance != undefined){
            return(
                <NativeCard containerStyle={{backgroundColor: "#333C83", paddingHorizontal: 20}}
                wrapperStyle={{backgroundColor: "#333C83"}}>
                    <View style={{display:"flex", flexDirection:"row"}}>
                    {currentComputerCard.planePicture != ""?  <Image source={{uri: currentComputerCard.planePicture}} style={{width: 200, height: 100, alignSelf: "center"}}/>: null}
                        <View>
                            {currentComputerCard.cardQuality < 5? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                    {Array.from({ length: 5 }, (_, i) => 
                                    <AnimatedIcon name="star" size={24} color="gold" style={gold}/>)}
                                </Text>: null 
                            }
                            {currentComputerCard.cardQuality < 100 && currentComputerCard.cardQuality > 5? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                    {Array.from({ length: 4 }, (_, i) => 
                                    <AnimatedIcon name="star" size={24} color="orange" style={orange}/>)}
                                </Text>: null 
                            }
                            {currentComputerCard.cardQuality < 500 && currentComputerCard.cardQuality > 100? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                    {Array.from({ length: 3 }, (_, i) => 
                                    <AnimatedIcon name="star" size={24} color="#c4c4c4" style={grey}/>)}
                                </Text>: null 
                            }
                                {currentComputerCard.cardQuality < 1000 && currentComputerCard.cardQuality > 500? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                {Array.from({ length: 2 }, (_, i) => 
                                    <AntDesign name="star" size={24} color="#c41c10"/>)}
                                </Text>
                                : null 
                            }
                                {currentComputerCard.cardQuality > 1000? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                <AntDesign name="star" size={24} color="white" /></Text>: null
                            }
                        </View>
                    </View>
                    <NativeCard.Divider/>
                    <View style={{display:"flex", flexDirection:"row"}}>
                        <View style={{marginRight: 10}}>
                            <Text style={utilStyles.cardTextSmall}>Manufacturer: {currentComputerCard.planeManufacturer}</Text>
                            <Text style={utilStyles.cardTextSmall}>Model: {currentComputerCard.planeModel}</Text>
                            <Text style={utilStyles.cardTextSmall}>Operator: {currentComputerCard.planeOperator}</Text>
                            <Text style={utilStyles.cardTextSmall}>CallSign: {currentComputerCard.planeCallSign}</Text>
                            <Text style={utilStyles.cardTextSmall}>Owner: {currentComputerCard.planeOwner}</Text>
                        </View>
                        <View>
                            <Text style={utilStyles.cardTextSmall}>Card quality: {currentComputerCard.cardQuality}</Text>
                            <Text style={utilStyles.cardTextSmall}>Current altitude: {currentComputerCardApiData.geometricAltitude?Math.floor(currentComputerCardApiData.geometricAltitude):null} km</Text>
                            <Text style={utilStyles.cardTextSmall}>Current velocity: {currentComputerCardApiData.velocity?Math.floor(currentComputerCardApiData.velocity):null} m/s</Text>
                            <Text style={utilStyles.cardTextSmall}>Distance: {Math.floor(currentComputerCardApiData.distance)} km</Text>
                            <Text style={utilStyles.cardTextSmall}>Card owner: {currentComputerCard.cardOwner}</Text>
                        </View>
                    </View>        
                </NativeCard>
            )
        }
    }

    const renderPlayerCard = () =>{
        if(currentPlayerCard != undefined && currentPlayerCardApiData.distance != undefined){
            return(
                <NativeCard containerStyle={{backgroundColor: "#333C83", paddingHorizontal: 20}}
                wrapperStyle={{backgroundColor: "#333C83"}}>
                    <View style={{display:"flex", flexDirection:"row"}}>
                    {currentPlayerCard.planePicture != ""?  <Image source={{uri: currentPlayerCard.planePicture}} style={{width: 200, height: 100, alignSelf: "center"}}/>: null}
                        <View>
                            {currentPlayerCard.cardQuality < 5? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                    {Array.from({ length: 5 }, (_, i) => 
                                    <AnimatedIcon name="star" size={24} color="gold" style={gold}/>)}
                                </Text>: null 
                            }
                            {currentPlayerCard.cardQuality < 100 && currentPlayerCard.cardQuality > 5? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                    {Array.from({ length: 4 }, (_, i) => 
                                    <AnimatedIcon name="star" size={24} color="orange" style={orange}/>)}
                                </Text>: null 
                            }
                            {currentPlayerCard.cardQuality < 500 && currentPlayerCard.cardQuality > 100? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                    {Array.from({ length: 3 }, (_, i) => 
                                    <AnimatedIcon name="star" size={24} color="#c4c4c4" style={grey}/>)}
                                </Text>: null 
                            }
                                {currentPlayerCard.cardQuality < 1000 && currentPlayerCard.cardQuality > 500? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                {Array.from({ length: 2 }, (_, i) => 
                                    <AntDesign name="star" size={24} color="#c41c10"/>)}
                                </Text>
                                : null 
                            }
                                {currentPlayerCard.cardQuality > 1000? 
                                <Text style={{textAlign: "center", paddingBottom: 10}}>
                                <AntDesign name="star" size={24} color="white" /></Text>: null
                            }
                        </View>
                    </View>
                    <NativeCard.Divider/>
                    <View style={{display:"flex", flexDirection:"row"}}>
                        <View style={{marginRight: 10}}>
                            <Text style={utilStyles.cardTextSmall}>Manufacturer: {currentPlayerCard.planeManufacturer}</Text>
                            <Text style={utilStyles.cardTextSmall}>Model: {currentPlayerCard.planeModel}</Text>
                            <Text style={utilStyles.cardTextSmall}>Operator: {currentPlayerCard.planeOperator}</Text>
                            <Text style={utilStyles.cardTextSmall}>CallSign: {currentPlayerCard.planeCallSign}</Text>
                            <Text style={utilStyles.cardTextSmall}>Owner: {currentPlayerCard.planeOwner}</Text>
                        </View>
                        <View>
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
                            <DataTable.Title>In use</DataTable.Title>
                            <DataTable.Title>Manufacturer</DataTable.Title>
                            <DataTable.Title>Model</DataTable.Title>
                            <DataTable.Title>Operator</DataTable.Title>
                            <DataTable.Title>Quality</DataTable.Title>
                            <DataTable.Title>Velocity</DataTable.Title>
                            <DataTable.Title>Altitude</DataTable.Title>
                            <DataTable.Title>Distance</DataTable.Title>
                        </DataTable.Header>
                        {userCards.map((card, index)=>getDataTableRow(card, index))}
                    </DataTable>
                </ScrollView>
                </ScrollView>
            </SafeAreaView>
        )
    }

    const renderSpinner = () =>{
        return(<Spinner size='giant'/>)
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
        setRound((round)=>round+1)
        setCurrentPlayerCard(undefined)
        setCurrentComputerCard(undefined)
        setDataTableVisible(true)
        setCurrentPlayerCardApiData({velocity:undefined, geometricAltitude:undefined, distance:undefined})
        setCurrentComputerCardApiData({velocity:undefined, geometricAltitude:undefined, distance:undefined})
        setCurrentPlayerCardTotalPoints(undefined)
        setCurrentComputerCardTotalPoints(undefined)
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