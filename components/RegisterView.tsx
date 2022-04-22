import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import parseErrorStack from 'react-native/Libraries/Core/Devtools/parseErrorStack';
import { styles } from '../util/styles';
import { usersDb } from '../util/Firebase'
import { getDatabase, push, ref, onValue, get, update } from 'firebase/database';
import { useContext } from 'react';
import { LoggedUsernameContext } from '../util/LoggedUsernameProvider';
// Siirsin noi Firebase-jutut util kansioon. Täällä tarvii vielä ainakin tota Firebase-kirjaston onValue-funktiota useEffectin yhteydessä.


type Props = {
    navigation: any
}

export default function RegisterView(props: Props){


    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [registeredMessage, setRegisteredMessage] = useState("")
    const {loggedUsername, setLoggedUsername} = useContext(LoggedUsernameContext)
    const [firebaseUsers, setFirebaseUsers] = useState({});
    const [usernameFreeFlag, setUsernameFreeflag] = useState(false)

    useEffect(()=>{
        if(usernameFreeFlag == true){
           
        }
    },[usernameFreeFlag])
    /*
    useEffect(()=>{
        onValue(usersDb, (snapshot) => {
        console.log(snapshot)
        /*const userIDs = Object.keys(data);
        const usersTestData = Array()
        userIDs.map((userID)=>{
            usersTestData.push(userID)
        })
        setDbTestData(usersTestData)*//*
        })
    },[])
    */

    const checkRegisterForm = () => {
        if (password != passwordConfirm){
            Alert.alert("Passwords don't match.")
        }
        /*else if (usernames.includes(username)){
            Alert.alert("Sorry, that username is already taken.")
        }*/
        else if (password == "" || passwordConfirm == ""){
            Alert.alert("Please fill both password fields.")
        }
        else if (username == ""){
            Alert.alert("Please give an username to register.")
        }
        else{
           return true
        }
    }


    function usernameFree(usersSnapshot:Object) {
        const userIds =  Object.keys(usersSnapshot)
        for (let i = 0; i < userIds.length; i++){
            if(username == usersSnapshot[userIds[i]].username){
                return false;
            }
        }
        return true;
    }

    async function handleRegisterButton () {
        if (checkRegisterForm() && loggedUsername == "Not logged in"){
            get(usersDb).then((snapshot)=>{
                if(usernameFree(snapshot.val()) == true){
                    Alert.alert("You have been registered!")
                    setLoggedUsername(username)
                    //setTimeout(()=>{props.navigation.navigate("Home")},2000)
                    props.navigation.navigate("Home")
                    push(usersDb, {username:username, password:password})
                 } else {
                     // FIXME: se eksyy tänne vaikka rekisteröityminen onnistuukin
                     Alert.alert("Username not available") 
                 }
            })
        }
    }

    return(
        <View style={styles.viewMain}>
            <Text>Username: {username}</Text>
            <Text>Password: {password}</Text>
            <Text>Confirmed password: {passwordConfirm}</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text)=>(setUsername(text))}
                value={username}
                placeholder="username"
                textAlign="center"
            />
            <TextInput
                style={styles.textInput}
                onChangeText={(text)=>(setPassword(text))}
                value={password}
                placeholder="password"
                textAlign="center"
                secureTextEntry={true}
            />
            <TextInput
                style={styles.textInput}
                onChangeText={(text)=>(setPasswordConfirm(text))}
                value={passwordConfirm}
                placeholder="confirm password"
                textAlign="center"
                secureTextEntry={true}
            />
            <Button
                title="register"
                onPress={()=>{handleRegisterButton()}}
            />
            <Text>{registeredMessage}</Text>

        </View>
    )
}
