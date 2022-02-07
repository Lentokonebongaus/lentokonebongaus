import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RegisterView from './RegisterView';
import{ initializeApp } from "firebase/app";
import { getDatabase, push, ref, onValue, update } from 'firebase/database';
import { useEffect, useState } from 'react';


export default function App() {

  return (
    <View style={styles.container}>
      <Text></Text>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
