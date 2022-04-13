import { Text, View, FlatList, Image, TouchableOpacity, Animated} from "react-native";
import {useEffect, useRef, useState} from "react";
import testCard from '../testCard';
import { styles } from '../util/styles';
//import {useSpring, to, animated} from "react-spring"
import { AntDesign } from '@expo/vector-icons'; 
import Draggable from "react-native-draggable";

type Props = {
    // card id 
}

export default function CardView(Props: Props){

    // Text doesn't show without Flatlist

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
        console.log(testCard);
      }, [])

      let translateX = new Animated.Value(0)
      let translateY = new Animated.Value(0)
      let scale  = new Animated.Value(1)

    return (
        <View style={{padding: 20}}>

        <Draggable x={60} y={200}>

          <FlatList 
            keyExtractor={(item, index) => index.toString()} 
            renderItem={ ({item}) => 
            <View style={styles.horizontalCard}>
                
                <View style={styles.card}>

                <Text style={styles.cardTextHeader}>{item.planeModel}</Text>
                
                {item.planePicture != ""?  <Image
                source={{uri: item.planePicture}}/>: null }

                {item.cardQuality < 5? 
                <Text>
                     {Array.from({ length: 5 }, (_, i) => 
                    <AntDesign name="star" size={24} color="gold" />)}
                </Text>: null }
                {item.cardQuality < 100 && item.cardQuality > 5? 
                <Text>
                     {Array.from({ length: 4 }, (_, i) => 
                    <AntDesign name="star" size={24} color="orange" />)}
                </Text>: null }
                {item.cardQuality < 500 && item.cardQuality > 100? <Text>
                    {Array.from({ length: 3 }, (_, i) => 
                    <AntDesign name="star" size={24} color="#c4c4c4" />)}
                </Text>: null }
                {item.cardQuality < 1000 && item.cardQuality > 500? 
                <Text>
                 {Array.from({ length: 2 }, (_, i) => 
                    <AntDesign name="star" size={24} color="#c41c10" />)}
                </Text>
                : null }
                {item.cardQuality > 1000? 
                <AntDesign name="star" size={24} color="white" />: null }

                <Text style={styles.cardText}>Manufacturer: {item.planeManufacturer}</Text>
                <Text style={styles.cardText}>Model: {item.planeModel}</Text>
                <Text style={styles.cardText}>Operator: {item.planeOperator}</Text>
                <Text style={styles.cardText}>Operator CallSign: {item.planeOperatorCallSign}</Text>
                <Text style={styles.cardText}>Owner: {item.planeOwner}</Text>

                </View>

            </View> }
            data={manyCardsTest}
          />
           </Draggable>
        </View>
      );

}