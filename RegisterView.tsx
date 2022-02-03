import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
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
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const [registeredMessage, setRegisteredMessage] = useState("")


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