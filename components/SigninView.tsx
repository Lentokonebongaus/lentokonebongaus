import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import parseErrorStack from 'react-native/Libraries/Core/Devtools/parseErrorStack';
import { styles } from '../util/styles';
import { useContext } from 'react';
import { LoggedUsernameContext } from '../util/LoggedUsernameProvider';
import { UserCardsContext } from '../util/UserCardsProvider';
import { usersDb } from '../util/Firebase'
import { getDatabase, push, ref, onValue, update } from 'firebase/database';


type Props = {
    navigation: any
}

export default function SigninView(props: Props){

    const [usernameInput, setUsernameInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)
    const { userCards, setUserCards } = useContext(UserCardsContext)
    
    const userAuthenticated = (databaseSnapshot:Object, usernameInput:String, passwordInput:String) =>{
        // Getting key-value-pairs from Firebase snapshot object with val() method.
        // [RANDOM_ID{username: STRING, password: STRING}]
        const usersArray = databaseSnapshot.val()
        const userIds =  Object.keys(usersArray)
        for (let i = 0; i < userIds.length; i++){
            if(usernameInput == usersArray[userIds[i]].username){
                if(passwordInput == usersArray[userIds[i]].password){
                    return true
                } else{
                    return false
                }
            }
        }
        return false
    }

    return(
        <View style={styles.viewMain}>
            <Text>Type in your credentials</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text)=>(setUsernameInput(text))}
                value={usernameInput}
                placeholder="username"
                textAlign="center"
            />
            <TextInput
                style={styles.textInput}
                onChangeText={(text)=>(setPasswordInput(text))}
                value={passwordInput}
                placeholder="password"
                textAlign="center"
                secureTextEntry={true}
            />
            <Button
                title="Sign in"
                onPress={()=>{
                    onValue(usersDb, (databaseSnapshot) => {
                    if(userAuthenticated(databaseSnapshot, usernameInput, passwordInput) == true){
                        setLoggedUsername(usernameInput)
                        setUserCards([])
                        props.navigation.navigate("Home")
                    } else{
                        // TODO: Ehkä vähän hienovaraisemmin teksti tonne näkymään ku alertilla? Esim. <Text>-tagin sisälle.
                        alert("WRONG")
                    }
                    /*const userIDs = Object.keys(data);
                    const usersTestData = Array()
                    userIDs.map((userID)=>{
                        usersTestData.push(userID)
                    })
                    setDbTestData(usersTestData)*/
                    })
                }}
            />
            <Text>Don't have an account? Register here!</Text>
            <Button
                title="Register"
                onPress={ () => props.navigation.navigate("Register") }
            />
        </View>
    )
}