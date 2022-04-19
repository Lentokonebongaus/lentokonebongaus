import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, Image} from 'react-native';
import { styles } from '../util/styles';
import { useContext } from "react"
import { LoggedUsernameContext } from "../util/LoggedUsernameProvider"
import { UserCardsContext } from "../util/UserCardsProvider"
import { fetchUserCards } from "../util/fetchCards"
import { useEffect } from 'react';
import { cardsDb } from "../util/Firebase"
import { getDatabase, push, ref, onValue, update } from 'firebase/database';
import { Card, ListItem, Icon, CheckBox, Button} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';

type Props = {
  navigation: any
}


export default function Kotinakyma(Props: Props) {

    // Image by Nick Morales on unsplash.com
    // Kuva lataa hetken, assets kansiosta mielummin?
    const backgroundImg = { uri: "https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80" };

    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)
    const { userCards, setUserCards } = useContext(UserCardsContext)

    useEffect(()=>{
      console.log("UserCards:")
      console.log(userCards)
    },[userCards])

    // Laitoin tän tähän yhteyteen ku asynkronisuus ja contextin päivittäminen tuotti ongelmia erillisessä tiedostossa.
    async function fetchCards () {
      onValue(cardsDb, (databaseSnapshot) => {
        const fetchedCards = databaseSnapshot.val()
        const userCardIds = Object.keys(fetchedCards).filter(cardId => fetchedCards[cardId].cardOwner == loggedUsername)
        let sortedUserCards = []
        for(let i = 0; i < userCardIds.length; i++){
          sortedUserCards.push(fetchedCards[userCardIds[i]])
        }
        setUserCards(sortedUserCards)
      })
    }

    return (
      <View style={styles.container}>

        <ImageBackground source={backgroundImg} resizeMode="cover" style={{width: '100%', height: '100%'}}>
          
        <View style={{flex: 1, justifyContent: "center", paddingTop: 40}}>
          
        <Text style={{fontWeight: "bold", fontSize: 50, paddingLeft: 90, paddingBottom: 30, color: "white"}}>
          Welcome</Text>
          <Text style={{fontWeight: "bold", fontSize: 28, paddingLeft: 110, color: "white"}}>
          {loggedUsername}</Text>
        </View>

        <View style={{flex: 2, justifyContent: "space-between", padding: 30}}>
       

        <View style={{flexDirection: 'column', flex: 2, justifyContent: "space-between", paddingBottom: 100}}>
          
          <Button
               TouchableComponent={TouchableScale}
               friction={90} 
               tension={100}
               activeScale={0.95}
              title="LOG IN"
              titleStyle={{ fontWeight: 'bold', fontSize: 14}}
              buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 0,
                backgroundColor: "rgba(20, 39, 155, 0.8)"
                
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 80,
                marginVertical: 10,
              }}
              icon={{
                name: 'user',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress={() => Props.navigation.navigate('Log In')}
            />

              <Button
               TouchableComponent={TouchableScale}
               friction={90} 
               tension={100}
               activeScale={0.95}
              title="CARDS"
              titleStyle={{ fontWeight: 'bold', fontSize: 14}}
              buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 0,
                backgroundColor: "rgba(20, 39, 155, 0.8)"
                
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 80,
                marginVertical: 10,
              }}
              icon={{
                name: 'plane',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress={() => Props.navigation.navigate('Cards')}
            />

            <Button
               TouchableComponent={TouchableScale}
               friction={90} 
               tension={100}
               activeScale={0.95}
              title="PLAY"
              titleStyle={{ fontWeight: 'bold', fontSize: 14}}
              buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 0,
                backgroundColor: "rgba(20, 39, 155, 0.8)"
                
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 80,
                marginVertical: 10,
              }}
              icon={{
                name: 'gamepad',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress={() => Props.navigation.navigate('Play')}
            />

             <Button
               TouchableComponent={TouchableScale}
               friction={90} 
               tension={100}
               activeScale={0.95}
              title="SETTINGS"
              titleStyle={{ fontWeight: 'bold', fontSize: 14}}
              buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 0,
                backgroundColor: "rgba(20, 39, 155, 0.8)"
                
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 80,
                marginVertical: 10,
              }}
              icon={{
                name: 'wrench',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress={() => Props.navigation.navigate('Settings')}
            />

            <Button
               TouchableComponent={TouchableScale}
               friction={90} 
               tension={100}
               activeScale={0.95}
              title="FETCH USER CARDS"
              titleStyle={{ fontWeight: 'bold', fontSize: 14}}
              buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 0,
                backgroundColor: "rgba(20, 39, 155, 0.8)"
                
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 80,
                marginVertical: 10,
              }}
              icon={{
                name: 'arrow-right',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress={() => {fetchCards}}
            />

        </View>

        </View>
        </ImageBackground>
      
        <StatusBar style="auto" />
      </View>
    );
}
