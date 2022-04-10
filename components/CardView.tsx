import { Text, View, FlatList, Image, TouchableOpacity, Animated} from "react-native";
import {useEffect, useRef, useState} from "react";
import testCard from '../testCard';
import star from "../assets/star4.png";
import star2 from "../assets/2star.png";
import star3 from "../assets/3star.png";
import star4 from "../assets/4star.png";
import star5 from "../assets/5star.png";
import { styles } from '../util/styles';
import {useSpring, to, animated} from "react-spring";
const tag ='[GESTURE]'
import  {PanGestureHandler, PinchGestureHandler} from 'react-native-gesture-handler'

type Props = {
    // card id 
}

export default function CardView(Props: Props){

    // Text doesn't show without Flatlist
    let manyCardsTest = [testCard]; 

    useEffect(() => {
      }, [])

      let translateX = new Animated.Value(0)
      let translateY = new Animated.Value(0)
      let scale  = new Animated.Value(1)

      const onPanGestureEvent = Animated.event(
        [
          {
            nativeEvent: {
              translationX: translateX,
              translationY: translateY,
            },
          },
        ],
        { useNativeDriver: true }
      );

    return (
        <View style={{padding: 20}}>

          <FlatList 
            keyExtractor={(item, index) => index.toString()} 
            renderItem={ ({item}) => 
            <View style={styles.horizontalCard}>
                
                <PanGestureHandler onGestureEvent={onPanGestureEvent}>
                <Animated.View style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingTop: 40,
                    backgroundColor: '#75c9fa', 
                    borderRadius: 5, 
                    borderWidth: 5,
                    borderColor: "#0285d1",
                    padding: 20, 
                    shadowColor: 'black',
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 6,
                    shadowOpacity: 0.26,
                    elevation: 8, 
                    transform: [
                        {
                          translateX: translateX,
                        },
                        {
                          translateY: translateY,
                        },
                      ],
                }}>

                <Text style={styles.cardTextHeader}>{item.planeModel}</Text>
                
                {item.planePicture != ""?  <Image
                source={{uri: item.planePicture}}/>: null }

                {item.cardQuality < 5?  <Image
                source={star5}/>: null }
                {item.cardQuality < 100 && item.cardQuality > 5? <Image
                source={star4}/>: null }
                {item.cardQuality < 500 && item.cardQuality > 100? <Image
                source={star3}/>: null }
                {item.cardQuality < 1000 && item.cardQuality > 500? <Image
                source={star2}/>: null }
                {item.cardQuality > 1000? <Image
                source={star}/>: null }

                <Text style={styles.cardText}>Manufacturer: {item.planeManufacturer}</Text>
                <Text style={styles.cardText}>Model: {item.planeModel}</Text>
                <Text style={styles.cardText}>Operator: {item.planeOperator}</Text>
                <Text style={styles.cardText}>Operator CallSign: {item.planeOperatorCallSign}</Text>
                <Text style={styles.cardText}>Owner: {item.planeOwner}</Text>

                </Animated.View>
                </PanGestureHandler>

            </View> }
            data={manyCardsTest}
          />
        </View>
      );

}