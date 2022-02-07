import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import{ initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, update } from 'firebase/database';
import parseErrorStack from 'react-native/Libraries/Core/Devtools/parseErrorStack';

export default function RegisterView(){

    const styles = {
        textInput:{
            width: 200,
            height: 50,
            backgroundColor:"white",
            borderStyle:"solid",
            borderColor:"black",
            borderRadius:10,
            borderWidth: 2,
            marginBottom: 10
        },
        viewMain:{
            backgroundColor:"deepskyblue",
            flex:1,
            alignItems: 'center',
            justifyContent: 'center',
        }
    }

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
    const [dbTestData, setDbTestData] = useState([])

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
                    // TODO: handleFormSubmit()
                    setRegisteredMessage("You have been registered!")
                }}
            />
            <Text>{registeredMessage}</Text>

        </View>
    )
}