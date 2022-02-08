import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image} from 'react-native';
import RegisterView from './RegisterView';
import{ initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, update } from 'firebase/database';
import { useEffect, useState } from 'react';
import Kotinakyma from "./kotinakyma";
import { NavigationContainer} from '@react-navigation/native';
import { createBottomTabNavigator } from'@react-navigation/bottom-tabs';
import { Ionicons} from '@expo/vector-icons';  
import Map from "./Map"

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
      screenOptions={({route }) => ({ 
      tabBarIcon: ({ focused, color, size }) => {             
             
        let iconName;            
        if (route.name === 'Home') {             
           iconName = 'md-home';            
          } else if (route.name === 'Map') {
            iconName = 'md-map';            
          }            
          // näyttää punaista mutta toimii
          return <Ionicons name={iconName}size={size}color={color} />;   
            
        },        
        })}>
        <Tab.Screen name="Home" component={Kotinakyma} />
        <Tab.Screen name="Map" component={Map} />
      </Tab.Navigator>
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
