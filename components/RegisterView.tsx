import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';
import { Alert, StyleSheet, Text, TextInput, View, ImageBackground, Dimensions} from 'react-native';
import parseErrorStack from 'react-native/Libraries/Core/Devtools/parseErrorStack';
import { styles } from '../util/styles';
import { usersDb } from '../util/Firebase'
import { getDatabase, push, ref, onValue, get, update } from 'firebase/database';
import { useContext } from 'react';
import { LoggedUsernameContext } from '../util/LoggedUsernameProvider';
import { Icon, Button, Input} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// Siirsin noi Firebase-jutut util kansioon. Täällä tarvii vielä ainakin tota Firebase-kirjaston onValue-funktiota useEffectin yhteydessä.


type Props = {
    navigation: any
}

export default function RegisterView(props: Props){

    const backgroundImg = { uri: "https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80" };

    const [errorUsername, setErrorUsername] = useState("")
    const [errorPassword, setErrorPassword] = useState("")
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
            setErrorPassword("Passwords don't match.")
        }
        /*else if (usernames.includes(username)){
            Alert.alert("Sorry, that username is already taken.")
        }*/
        else if (password == "" || passwordConfirm == ""){
            setErrorPassword("Please fill both password fields.")
        }
        else if (username == ""){
            setErrorUsername("Please give an username to register.")
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
                    setRegisteredMessage("You have been registered!");
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

     // this stops background img from scaling weird with phone keyboard
     let width = Dimensions.get('window').width; 
     let height = Dimensions.get("window").height - 55;
 
     return(
         <View style={styles.container}>
             <KeyboardAwareScrollView>
             <ImageBackground source={backgroundImg} resizeMode="cover" style={{
             width: width, 
             height: height}}>

            <Text style={{fontWeight: "bold", fontSize: 30, paddingVertical: 10, color: "white", textAlign: "center"}}>
                Create an account</Text>
            
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
                onChangeText={(text)=>(setUsername(text))}
                value={username}
                inputContainerStyle={{borderColor: "white"}}
                containerStyle={{paddingVertical: 15}}
                errorMessage = {errorUsername}
                errorStyle={{ color: 'red'}}
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
                onChangeText={(text)=>(setPassword(text))}
                value={password}
                inputContainerStyle={{borderColor: "white"}}
                secureTextEntry={true}
                containerStyle={{paddingVertical: 15}}
                errorMessage = {errorPassword}
                errorStyle={{ color: 'red'}}
                />
            
                <Input
                placeholder='CONFIRM PASSWORD'
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
                onChangeText={(text)=>(setPasswordConfirm(text))}
                value={passwordConfirm}
                inputContainerStyle={{borderColor: "white"}}
                secureTextEntry={true}
                containerStyle={{paddingVertical: 15}}
                errorMessage = {registeredMessage}
                errorStyle={{ color: 'green', textAlign: "center"}}
                />
        
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
              onPress={()=>{handleRegisterButton()}}
            />

        </ImageBackground>
        </KeyboardAwareScrollView>
        </View>
    )
}
