import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { styles } from '../util/styles';
import { useContext } from 'react';
import { LoggedUsernameContext } from '../util/LoggedUsernameProvider';
import { UserCardsContext } from '../util/UserCardsProvider';
import { usersDb } from '../util/Firebase'
import { get } from 'firebase/database';
import { Snackbar } from 'react-native-paper';


type Props = {
    navigation: any
}

export default function SigninView(props: Props) {

    const [usernameInput, setUsernameInput] = useState("")
    const [passwordInput, setPasswordInput] = useState("")
    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)
    const { userCards, setUserCards } = useContext(UserCardsContext)
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [message, setMessage] = useState("")

    const userAuthenticated = (databaseSnapshot: Object, usernameInput: String, passwordInput: String) => {
        // Getting key-value-pairs from Firebase snapshot object with val() method.
        // [RANDOM_ID{username: STRING, password: STRING}]
        const usersArray = databaseSnapshot.val()
        const userIds = Object.keys(usersArray)
        for (let i = 0; i < userIds.length; i++) {
            if (usernameInput == usersArray[userIds[i]].username) {
                if (passwordInput == usersArray[userIds[i]].password) {
                    return true
                } else {
                    return false
                }
            }
        }
        return false
    }

    const handleSignin = () => {
        get(usersDb).then((databaseSnapshot) => {
            if (userAuthenticated(databaseSnapshot, usernameInput, passwordInput) == true) {
                setLoggedUsername(usernameInput)
                setUserCards([])
                props.navigation.navigate("Home")
            } else {
                setSnackbarMessage('Wrong Credentials! Try again')
            }
        }).catch((err) => {
            console.error(err)
        })
    }

    const setSnackbarMessage = (newMessage:string) => {
        setMessage(newMessage)
        setSnackbarVisible(true)
        setTimeout(() => {
            setSnackbarVisible(false)
        }, 5000)
    }

    const dismissSnackbar = () => {
        setSnackbarVisible(false);
    }

    return (
        <View style={styles.viewMain}>
            <Text>Type in your credentials</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => (setUsernameInput(text))}
                value={usernameInput}
                placeholder="username"
                textAlign="center"
            />
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => (setPasswordInput(text))}
                value={passwordInput}
                placeholder="password"
                textAlign="center"
                secureTextEntry={true}
            />
            <Button
                title="Sign in"
                onPress={handleSignin}
            />
            <Text>Don't have an account? Register here!</Text>
            <Button
                title="Register"
                onPress={() => props.navigation.navigate("Register")}
            />

            <Snackbar
                visible={snackbarVisible}
                onDismiss={dismissSnackbar}
                action={{
                    label: 'Dismiss',
                    onPress: () => {
                        dismissSnackbar
                    },
                }}
            >
                {message}
            </Snackbar>
        </View>
    )
}