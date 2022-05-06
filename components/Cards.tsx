import { Text, View, FlatList, Image, TouchableOpacity, Dimensions} from "react-native";
import testCard from '../testCard';
import { styles } from '../util/styles';
import { AntDesign } from '@expo/vector-icons'; 
import { useContext, useEffect, useState} from "react";
import { UserCardsContext } from "../util/UserCardsProvider";
import { cardsDb } from "../util/Firebase"
import { getDatabase, push, ref, onValue, update, get } from 'firebase/database';
import { LoggedUsernameContext } from "../util/LoggedUsernameProvider";
import { Card } from "react-native-elements";
import { useSpring, easings, animated, config} from "react-spring";
 
type Props = {
    navigation: any
  }

  const AnimatedIcon = animated(AntDesign)

export default function Cards(Props: Props){
    const { userCards, setUserCards } = useContext(UserCardsContext);
    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)
    const [flip, set] = useState(false)

    useEffect(()=>{
      fetchCards();
    },[]);

    async function fetchCards () {
      get(cardsDb)
        .then((snapshot)=>{
          if(snapshot.exists()){
            
            let ownedCards:any = []
            const cardsArray = snapshot.val()
            const cardIds =  Object.keys(cardsArray)
            for (let i = 0; i < cardIds.length; i++){
              if(loggedUsername == cardsArray[cardIds[i]].cardOwner){
                ownedCards = [...ownedCards, cardsArray[cardIds[i]]];
              }
            }
            setUserCards(ownedCards);
            console.log('Got cards from Firebase');
            console.log(ownedCards);
          } else {
            console.log("No data available");
          }
        })
        .catch((error)=>{
          console.error(error);
        })
    }

    // glow animaatio
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
        duration: 1500,
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
   
   //image width height scaling
   //og width 300 height 200
  let width = Dimensions.get('window').width; 
  let height = Dimensions.get("window").height;
  let imgWidth = width * 0.72992; 
  let imgHeight = height * 0.24660;
    
    return (
        <View style={{padding: 20, backgroundColor: "#e1effa"}}>

          <FlatList 
            keyExtractor={(item, index) => index.toString()} 
            renderItem={ ({item}) => 

            <TouchableOpacity
            onPress={ () => Props.navigation.navigate('Card', item)} style={{paddingHorizontal: 10}}>

          <View style={{flex: 1, paddingBottom: 40}}>
          <Card containerStyle={{backgroundColor: "#333C83", paddingHorizontal: 20}}
            wrapperStyle={{backgroundColor: "#333C83"}}>

                <Card.Title style={styles.cardTextHeader}>{item.planeModel}</Card.Title>
     
              
                {item.cardQuality  > 10000? 
                <Text style={{textAlign: "center", paddingBottom: 10}}>
                     {Array.from({ length: 5 }, (_, i) => 
                    <AnimatedIcon name="star" size={24} color="gold" style={gold}/>)}
                </Text>: null }

                {item.cardQuality > 7000 && item.cardQuality <= 10000? 
                <Text style={{textAlign: "center", paddingBottom: 10}}>
                     {Array.from({ length: 4 }, (_, i) => 
                    <AnimatedIcon name="star" size={24} color="orange" style={orange}/>)}
                </Text>: null }
                {item.cardQuality > 4000 && item.cardQuality <= 7000? 
                <Text style={{textAlign: "center", paddingBottom: 10}}>
                    {Array.from({ length: 3 }, (_, i) => 
                   <AnimatedIcon name="star" size={24} color="#c4c4c4" style={grey}/>)}
                </Text>: null }
                {item.cardQuality > 2000 && item.cardQuality <= 4000? 
                <Text style={{textAlign: "center", paddingBottom: 10}}>
                 {Array.from({ length: 2 }, (_, i) => 
                    <AntDesign name="star" size={24} color="#c41c10"/>)}
                </Text>
                : null }
                {item.cardQuality <= 2000? 
                <Text style={{textAlign: "center", paddingBottom: 10}}>
                <AntDesign name="star" size={24} color="white" /></Text>: null }
                
                <Card.Divider/>

                {item.planePicture != ""?  <Image
                source={{uri: item.planePicture}} style={{width: imgWidth, height: imgHeight, alignSelf: "center"}}/>: null }

                <View style={{flex: 1}}>
                <Card.Divider style={{padding: 10}}/>

                <Text style={styles.cardText}>Manufacturer: {item.planeManufacturer}</Text>
                <Text style={styles.cardText}>Model: {item.planeModel}</Text>
                <Text style={styles.cardText}>Operator: {item.planeOperator}</Text>
                <Text style={styles.cardText}>Operator CallSign: {item.planeOperatorCallSign}</Text>
                <Text style={styles.cardText}>Owner: {item.planeOwner}</Text>
                <Card.Divider style={{padding: 10}}/>
                <Text style={styles.cardTextSmall}>Card quality: {item.cardQuality}</Text>
                <Text style={styles.cardTextSmall}>Wins: {item.wins}</Text>
                <Text style={styles.cardTextSmall}>Losses: {item.losses}</Text>
                </View>

                </Card> 
                </View>
                </TouchableOpacity>

              }
            data={userCards}
          />
        </View>
      );

}
