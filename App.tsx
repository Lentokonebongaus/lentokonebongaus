import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image} from 'react-native';
import RegisterView from './components/RegisterView';
import{ initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import Kotinakyma from "./components/Kotinakyma";
import { NavigationContainer} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Map from "./components/Map"
import HomeScreenTabs from './components/HomeScreenTabs';
import SigninView from './components/SigninView';
import Cards from './components/Cards';
import Play from './components/Play';
import Settings from './components/Settings';
import planesData from './planesData';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreenTabs}/>
        <Stack.Screen name="Log In" component={SigninView}/>
        <Stack.Screen name="Register" component={RegisterView}/>
        <Stack.Screen name="Cards" component={Cards}/>
        <Stack.Screen name="Play" component={Play}/>
        <Stack.Screen name="Settings" component={Settings}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
