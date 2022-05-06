import { Text, View, FlatList, Image, TouchableOpacity, Animated, Dimensions} from "react-native";
import {useEffect, useRef, useState} from "react";
import testCard from '../testCard';
import { styles } from '../util/styles';
//import {useSpring, to, animated} from "react-spring"
import { AntDesign } from '@expo/vector-icons'; 
import Draggable from "react-native-draggable";
import { Card } from 'react-native-elements';
import { useSpring, easings, animated, config} from "react-spring";

type Props = {
    // card id 
}

const AnimatedIcon = animated(AntDesign); 

export default function CardView(Props: Props){

  const [flip, set] = useState(false);


    // Text doesn't show without Flatlist

    /*
    //testcard broke rip
    let tester = {
      "cardId": "1648568469955A321-21211618.58",
      "cardQuality": 100000.58,
      "planeManufacturer": "Airbus",
      "planeModel": "A321-212",
      "planeOperator": "Iberia Airlines",
      "planeOperatorCallSign": "IBERIA",
      "planeOwner": "Iberia",
      "planePicture": "",
    }; 
    
    let manyCardsTest = [tester]; 
    
    useEffect(() => {
        console.log(Props.route.params);
      }, [])
  */

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

    //image width height scaling
    //og width 300 height 200
    let width = Dimensions.get('window').width; 
    let height = Dimensions.get("window").height;
    let imgWidth = width * 0.72992; 
    let imgHeight = height * 0.24660;
  
    let gold = glow(10, 40, "gold"); 
    let orange = glow(10, 30, "orange"); 
    let grey = glow(10, 15, "#c4c4c4");

     let item = Props.route.params;

    return (
        <View style={{padding: 20}}>

        <Draggable x={20} y={150}>

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
                source={{uri: item.planePicture}} style={{width: 300, height: 200, alignSelf: "center"}}/>: null }

                <Card.Divider style={{padding: 10}}/>
                <Text style={styles.cardText}>Manufacturer: {item.planeManufacturer}</Text>
                <Text style={styles.cardText}>Model: {item.planeModel}</Text>
                <Text style={styles.cardText}>Operator: {item.planeOperator}</Text>
                <Text style={styles.cardText}>Operator CallSign: {item.planeOperatorCallSign}</Text>
                <Text style={styles.cardText}>Owner: {item.planeOwner}</Text>
                <Card.Divider/>
                <Text style={styles.cardTextSmall}>Card quality {item.cardQuality}</Text>
                <Text style={styles.cardTextSmall}>Wins: {item.wins}</Text>
                <Text style={styles.cardTextSmall}>Losses: {item.losses}</Text>


                </Card> 
           </Draggable>
        </View>
      );

}