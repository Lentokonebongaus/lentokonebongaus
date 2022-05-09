import { StatusBar } from 'expo-status-bar';
import { Text, View, ImageBackground } from 'react-native';
import { styles } from '../util/styles';
import { useContext, useState } from "react"
import { LoggedUsernameContext } from "../util/LoggedUsernameProvider"
import { UserCardsContext, updateUserCardsContext } from "../util/UserCardsProvider"
import { useEffect } from 'react';
import { authAnonymousUser } from "../util/Firebase"
import { Button } from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import { UserLocationContext, refreshUserLocationContext } from '../util/UserLocationProvider';
import { PlanesContext } from '../util/PlanesProvider';
import { refreshPlanes } from '../util/locationFunctions'



type Props = {
  navigation: any
}


export default function Kotinakyma(Props: Props) {

  // Image by Nick Morales on unsplash.com
  // Kuva lataa hetken, assets kansiosta mielummin?
  const backgroundImg = { uri: "https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80" };

  const { loggedUsername, setLoggedUsername } = useContext(LoggedUsernameContext)
  const { userCards, setUserCards } = useContext(UserCardsContext)
  const { userLocation, setUserLocation } = useContext(UserLocationContext)
  const { planes, setPlanes } = useContext(PlanesContext)
  const [initialLocationChanged, setInitialLocationChanged] = useState(false)


  useEffect(() => {
    authAnonymousUser()
    refreshUserLocationContext(setUserLocation)
    if (loggedUsername != "Not logged in") {
      updateUserCardsContext(setUserCards, loggedUsername)
    }
  }, [])

  useEffect(() => {
    if (initialLocationChanged == true) {
      refreshLoop(userLocation)
    }
  }, [initialLocationChanged])

  useEffect(() => {
    if (userLocation.longitude != 0 && userLocation.latitude != 0) {
      setInitialLocationChanged(true)
    }
  }, [userLocation])

  const refreshLoop = (location: any) => {
    setInterval(() => { refreshPlanes(userLocation, setPlanes) }, 7000)
  }

  const handleSignOut = () => {
    setLoggedUsername("Not logged in")
    setUserCards([])
    setPlanes([])
  }


  return (
    <View style={styles.container}>

      <ImageBackground source={backgroundImg} resizeMode="cover" style={{ width: '100%', height: '100%' }}>

        <View style={styles.homescreenContainer}>

          <Text style={styles.homescreenWelcome}>
            Welcome</Text>
          <Text style={styles.homescreenUsername}>
            {(loggedUsername != "Not logged in") ?
              loggedUsername :
              'Please log in'}</Text>
        </View>

        <View style={{ flex: 2, justifyContent: "space-between", padding: 30 }}>


          <View style={styles.homescreenButtonArea}>

            <Button
              TouchableComponent={TouchableScale}
              friction={90}
              tension={100}
              activeScale={0.95}
              title={loggedUsername == "Not logged in" ? "LOG IN" : "SIGN OUT"}
              titleStyle={styles.homescreenTitleStyle}
              buttonStyle={styles.homescreenButtonstyle}
              containerStyle={styles.homescreenButtonContainer}
              icon={{
                name: 'user',
                type: 'font-awesome',
                size: 15,
                color: 'white',
              }}
              iconRight
              iconContainerStyle={styles.homescreenIconContainerStyle}
              onPress={() => loggedUsername == "Not logged in" ? Props.navigation.navigate('Log In') : handleSignOut()}
            />
            {
              (loggedUsername != "Not logged in") ?
                <Button
                  TouchableComponent={TouchableScale}
                  friction={90}
                  tension={100}
                  activeScale={0.95}
                  title="CARDS"
                  titleStyle={styles.homescreenTitleStyle}
                  buttonStyle={styles.homescreenButtonstyle}
                  containerStyle={styles.homescreenButtonContainer}
                  icon={{
                    name: 'plane',
                    type: 'font-awesome',
                    size: 15,
                    color: 'white',
                  }}
                  iconRight
                  iconContainerStyle={styles.homescreenIconContainerStyle}
                  onPress={() => Props.navigation.navigate('Cards')}
                /> : null
            }
            {
              (loggedUsername != "Not logged in") ?
                <Button
                  TouchableComponent={TouchableScale}
                  friction={90}
                  tension={100}
                  activeScale={0.95}
                  title="PLAY"
                  titleStyle={styles.homescreenTitleStyle}
                  buttonStyle={styles.homescreenButtonstyle}
                  containerStyle={styles.homescreenButtonContainer}
                  icon={{
                    name: 'gamepad',
                    type: 'font-awesome',
                    size: 15,
                    color: 'white',
                  }}
                  iconRight
                  iconContainerStyle={styles.homescreenIconContainerStyle}
                  onPress={() => Props.navigation.navigate('Play')}
                />
                : null

            }

          </View>

        </View>
      </ImageBackground>

      <StatusBar style="auto" />
    </View>
  );
}
