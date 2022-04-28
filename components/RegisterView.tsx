import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { styles } from '../util/styles';
import { usersDb } from '../util/Firebase'
import { push, get } from 'firebase/database';
import { useContext } from 'react';
import { LoggedUsernameContext } from '../util/LoggedUsernameProvider';
import { Snackbar } from 'react-native-paper';

type Props = {
    navigation: any
}

export default function RegisterView(props: Props) {
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConfirm, setPasswordConfirm] = useState("")
    const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)
    const [snackbarVisible, setSnackbarVisible] = useState(false)
    const [message, setMessage] = useState("")


    const checkRegisterForm = () => {
        if (password != passwordConfirm) {
            setSnackbarMessage("Passwords don't match.")
        }
        else if (password == "" || passwordConfirm == "") {
            setSnackbarMessage("Please fill both password fields.")
        }
        else if (username == "") {
            setSnackbarMessage("Please give an username to register.")
        }
        else {
            return true
        }
    }


    function usernameFree(usersSnapshot: Object) {
        const userIds = Object.keys(usersSnapshot)
        for (let i = 0; i < userIds.length; i++) {
            if (username == usersSnapshot[userIds[i]].username) {
                return false;
            }
        }
        return true;
    }

    async function handleRegisterButton() {
        if (checkRegisterForm() && loggedUsername == "Not logged in") {
            get(usersDb).then((snapshot) => {
                if (usernameFree(snapshot.val()) == true) {
                    setSnackbarMessage("You have been registered!")
                    setLoggedUsername(username)
                    props.navigation.navigate("Home")
                    push(usersDb, { username: username, password: password })
                } else {
                    setSnackbarMessage("Username not available")
                }
            }).catch((err) => {
                console.error(err);
            })
        }
    }

    const setSnackbarMessage = (message:string) => {
        setMessage(message)
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
            <Text>Username: {username}</Text>
            <Text>Password: {password}</Text>
            <Text>Confirmed password: {passwordConfirm}</Text>
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => (setUsername(text))}
                value={username}
                placeholder="username"
                textAlign="center"
            />
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => (setPassword(text))}
                value={password}
                placeholder="password"
                textAlign="center"
                secureTextEntry={true}
            />
            <TextInput
                style={styles.textInput}
                onChangeText={(text) => (setPasswordConfirm(text))}
                value={passwordConfirm}
                placeholder="confirm password"
                textAlign="center"
                secureTextEntry={true}
            />
            <Button
                title="register"
                onPress={() => { handleRegisterButton() }}
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
