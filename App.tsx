import RegisterView from './components/RegisterView';
import { useEffect, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreenTabs from './components/HomeScreenTabs';
import SigninView from './components/SigninView';
import Cards from './components/Cards';
import Play from './components/Play';
import Settings from './components/Settings';
import PlaneView from './components/PlaneView';
import CardView from './components/CardView';
import { LoggedUsernameProvider } from './util/LoggedUsernameProvider';
import { UserCardsProvider } from './util/UserCardsProvider';
import { PlanesProvider } from './util/PlanesProvider';
import { UserLocationProvider, UserLocationContext, refreshUserLocationContext } from './util/UserLocationProvider';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';

const Stack = createNativeStackNavigator();

export default function App() {

  const { userLocation, setUserLocation } = useContext(UserLocationContext)
  
  // Doesn't execute for some reason. 
  useEffect(() => {
    refreshUserLocationContext(setUserLocation)
  }, [])

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <LoggedUsernameProvider>
          <UserLocationProvider>
            <PlanesProvider>
              <UserCardsProvider>
                <NavigationContainer>
                  <Stack.Navigator>
                    <Stack.Screen name="Home " component={HomeScreenTabs} />
                    <Stack.Screen name="Log In" component={SigninView} />
                    <Stack.Screen name="Register" component={RegisterView} />
                    <Stack.Screen name="Cards" component={Cards} />
                    <Stack.Screen name="Play" component={Play} />
                    <Stack.Screen name="Settings" component={Settings} />
                    <Stack.Screen name="Plane" component={PlaneView} />
                    <Stack.Screen name="Card" component={CardView} />
                  </Stack.Navigator>
                </NavigationContainer>
              </UserCardsProvider>
            </PlanesProvider>
          </UserLocationProvider>
        </LoggedUsernameProvider>
      </ApplicationProvider>
    </>
  );
}
