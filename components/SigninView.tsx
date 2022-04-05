import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import parseErrorStack from 'react-native/Libraries/Core/Devtools/parseErrorStack';
import { styles } from '../util/styles';

type Props = {
    navigation: any
}

export default function SigninView(Props: Props){

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")


    // IDE is giving a "No overload matches this call." error message for component styles. Code works though, so will look into this later.
    return(
        <View style={styles.viewMain}>
            <Text>Type in your credentials</Text>
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
            <Button
                title="Sign in"
                onPress={()=>{
                    // TODO: handleFormSubmit()
                }}
            />
            <Text>Don't have an account? Register here!</Text>
            <Button
                title="Register"
                onPress={ () => Props.navigation.navigate('Register') }
            />
        </View>
    )
}