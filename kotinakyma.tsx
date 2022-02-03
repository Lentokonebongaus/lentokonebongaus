import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ImageBackground} from 'react-native';

export default function kotinakyma() {

    const eivtumitaan = () => {

    }

    const image = { uri: "https://images.unsplash.com/photo-1531642765602-5cae8bbbf285?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1918&q=80" };


    return (
        <View style={styles.container}>
        
        <View style={{flex: 2, justifyContent: 'center'}}>
        <Text style={{fontSize: 30}}>Tervetuloa!</Text>
         </View>

        <View style={{flexDirection: 'column', flex: 1, justifyContent: "space-between"}}>
          <Button onPress={eivtumitaan} title="Kartta"></Button>
          <Button onPress={eivtumitaan} title="Kortit"></Button>
          <Button onPress={eivtumitaan} title="Pelaa"></Button>
          <Button onPress={eivtumitaan} title="Asetukset"></Button>
        </View>

        <View style={{flex:1}}>
        </View>
    
          <StatusBar style="auto" />
        </View>
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
