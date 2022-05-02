import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { StyleSheet, Text, TextInput, View, ImageBackground, Dimensions} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import parseErrorStack from 'react-native/Libraries/Core/Devtools/parseErrorStack';
import { styles } from '../util/styles';
import { useContext } from 'react';
import { LoggedUsernameContext } from '../util/LoggedUsernameProvider';
import { usersDb } from '../util/Firebase'
import { getDatabase, push, ref, onValue, update } from 'firebase/database';
import { Icon, Button, Input} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { PlanesContext } from "../util/PlanesProvider"
import { UserCardsContext, updateUserCardsContext } from "../util/UserCardsProvider"

type Props = {
    navigation: any
}

export default function SigninView(props: Props){

    const backgroundImg = { uri: "https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80" };

    useEffect(()=>{
        setErrorMsg("");
      },[])

    const [usernameInput, setUsernameInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)
    const { userCards, setUserCards } = useContext(UserCardsContext)
    const  [errorMsg, setErrorMsg ] = useState("")
    
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

    // this stops background img from scaling weird with phone keyboard
    let width = Dimensions.get('window').width; 
    let height = Dimensions.get("window").height - 55;

    return(
        <View style={styles.container}>
            <ImageBackground source={backgroundImg} resizeMode="cover" style={{
            width: width, 
            height: height}}>
           
            <Text style={{fontWeight: "bold", fontSize: 30, paddingVertical: 30, color: "white", textAlign: "center"}}>
                Type in your credentials</Text>
            
                <Input
                placeholder='USERNAME'
                placeholderTextColor={"white"}
                leftIcon={{
                    name: 'user',
                    type: 'font-awesome',
                    size: 30,
                    color: 'white',
                  }}
                style={{paddingVertical: 20, textAlign: "center"}}
                inputStyle={{color: "white"}}
                labelStyle={{color: "white", textAlign: "center"}}
                onChangeText={(text)=>(setUsernameInput(text))}
                value={usernameInput}
                inputContainerStyle={{borderColor: "white"}}
                containerStyle={{paddingVertical: 15}}
                />

                <Input
                placeholder='PASSWORD'
                placeholderTextColor={"white"}
                leftIcon={{
                    name: 'lock',
                    type: 'font-awesome',
                    size: 30,
                    color: 'white',
                  }}
                style={{paddingVertical: 20, textAlign: "center"}}
                inputStyle={{color: "white"}}
                labelStyle={{color: "white", textAlign: "center"}}
                onChangeText={(text)=>(setPasswordInput(text))}
                value={passwordInput}
                inputContainerStyle={{borderColor: "white"}}
                secureTextEntry={true}
                containerStyle={{paddingVertical: 15}}
                errorMessage = {errorMsg}
                errorStyle={{ color: 'red', textAlign: "center"}}
                />

               <Button
               TouchableComponent={TouchableScale}
               friction={90} 
               tension={100}
               activeScale={0.95}
               title="SIGN IN"
               titleStyle={{ fontWeight: 'bold', fontSize: 14}}
               buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 20,
                backgroundColor: "rgba(20, 39, 155, 0.8)"
                
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 80,
                marginVertical: 10,
                alignSelf: "center"
              }}
              icon={{
                name: 'arrow-right',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress={()=>{
                onValue(usersDb, (databaseSnapshot) => {
                if(userAuthenticated(databaseSnapshot, usernameInput, passwordInput) == true){
                    setLoggedUsername(usernameInput)
                    setUserCards([])
                    setErrorMsg("")
                    updateUserCardsContext(setUserCards, usernameInput)
                    props.navigation.navigate("Home")
                } else{
                    setErrorMsg("Username or password is wrong!")
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

            <Text style={{fontWeight: "bold", fontSize: 15, paddingVertical: 10, color: "white", textAlign: "center"}}>
                Don't have an account? Register here!</Text>

                <Button
               TouchableComponent={TouchableScale}
               friction={90} 
               tension={100}
               activeScale={0.95}
               title="REGISTER"
               titleStyle={{ fontWeight: 'bold', fontSize: 14}}
               buttonStyle={{
                borderWidth: 0,
                borderColor: 'transparent',
                borderRadius: 20,
                backgroundColor: "rgba(20, 39, 155, 0.8)"
                
              }}
              containerStyle={{
                width: 200,
                marginHorizontal: 80,
                marginVertical: 10,
                alignSelf: "center"
              }}
              icon={{
                name: 'arrow-right',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={{ marginLeft: 10, marginRight: -10 }}
              onPress={ () => props.navigation.navigate("Register") }
            />

            </ImageBackground>
        </View>
    )
}