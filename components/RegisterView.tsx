import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Alert, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import{ initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, update } from 'firebase/database';
import parseErrorStack from 'react-native/Libraries/Core/Devtools/parseErrorStack';
import { styles } from '../util/styles';

export default function RegisterView(){

    // -------------- FIREBASE -----------------------------------------------

    const firebaseConfig = {

        apiKey: "AIzaSyD2TF3qwV0gXZ7YPvagpymcuWTMJazIGxc",
      
        authDomain: "lentokonebongaus.firebaseapp.com",
      
        databaseURL: "https://lentokonebongaus-default-rtdb.europe-west1.firebasedatabase.app",
      
        projectId: "lentokonebongaus",
      
        storageBucket: "lentokonebongaus.appspot.com",
      
        messagingSenderId: "313722689412",
      
        appId: "1:313722689412:web:5cfa1aa1fcaf68c40fafd1"
      
    };
      
    const app = initializeApp(firebaseConfig);
    const database = getDatabase(app);
    const usersDb = ref(database, "users");

    // ----------------------------------------------------------------------

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [registeredMessage, setRegisteredMessage] = useState("")


    useEffect(()=>{
        onValue(usersDb, (snapshot) => {
        console.log(snapshot)
        /*const userIDs = Object.keys(data);
        const usersTestData = Array()
        userIDs.map((userID)=>{
            usersTestData.push(userID)
        })
        setDbTestData(usersTestData)*/
        })
    },[])

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


    // IDE is giving a "No overload matches this call." error message for component styles. Code works though, so will look into this later.
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
                onPress={()=>{
                    if (checkRegisterForm()){
                        push(usersDb, {username:username, password:password})
                        Alert.alert("You have been registered!")
                    }
                }}
            />
            <Text>{registeredMessage}</Text>

        </View>
    )
}
