import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ImageBackground, Image} from 'react-native';
import { styles } from '../util/styles';
import { useContext } from "react"
import { LoggedUsernameContext } from "../util/LoggedUsernameProvider"
import { UserCardsContext } from "../util/UserCardsProvider"
import { fetchUserCards } from "../util/fetchCards"
import { useEffect } from 'react';
import { cardsDb } from "../util/Firebase"
import { getDatabase, push, ref, onValue, update } from 'firebase/database';



type Props = {
  navigation: any
}


export default function Kotinakyma(Props: Props) {

    const nothing = () => {

    }

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
        <View style={{flex: 1, justifyContent: "flex-start", paddingTop: 40}}>
          <Image
            style={{width: 300, height: 200}}
            source={{uri: "https://media.istockphoto.com/photos/airplane-isolated-on-white-picture-id831530162?k=20&m=831530162&s=612x612&w=0&h=3M4vqQQ1q2S2ugqMcJN6_kP_oDHxJhDmDEGc6u6Sr-U="}}
            />
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 60}}>
          <Text style={{fontSize: 30}}>Welcome {loggedUsername}</Text>
        </View>

        <View style={{flexDirection: 'column', flex: 2, justifyContent: "space-between", paddingBottom: 100}}>
          <Button title="Log in" onPress={
            () => Props.navigation.navigate('Log In')} />
          <Button title="Cards" onPress={
            () => Props.navigation.navigate('Cards')} />
          <Button title="Play" onPress={
            () => Props.navigation.navigate('Play')} />
          <Button title="Settings" onPress={
            () => Props.navigation.navigate('Settings')} />
          
            
          <Button title="Card view test" onPress={
            () => Props.navigation.navigate('Card view')
          } />
          <Button title="Fetch user cards" onPress={
            () => {
              fetchCards()
            }
          } />
          <Button title="Log out" onPress={
            ()=>setLoggedUsername("Not logged in")
          } />
        </View>
      
        <StatusBar style="auto" />
      </View>
    );
}
