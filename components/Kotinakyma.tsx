import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, ImageBackground, Image} from 'react-native';

type Props = {
  navigation: any
}

export default function Kotinakyma(Props: Props) {

    const nothing = () => {

    }
  
    return (
      <View style={styles.container}>
        <View style={{flex: 1, justifyContent: "flex-start", paddingTop: 40}}>
          <Image
            style={{width: 300, height: 200}}
            source={{uri: "https://media.istockphoto.com/photos/airplane-isolated-on-white-picture-id831530162?k=20&m=831530162&s=612x612&w=0&h=3M4vqQQ1q2S2ugqMcJN6_kP_oDHxJhDmDEGc6u6Sr-U="}}
            />
        </View>

        <View style={{flex: 1, justifyContent: 'flex-end', paddingBottom: 60}}>
          <Text style={{fontSize: 30}}>Welcome!</Text>
        </View>

        <View style={{flexDirection: 'column', flex: 2, justifyContent: "space-between", paddingBottom: 100}}>
          <Button title="Log in" onPress={
            () => Props.navigation.navigate('Log In')} />
          <Button title="Cards" onPress={
            () => Props.navigation.navigate('Cards')} />
          <Button title="Play" onPress={
            () => Props.navigation.navigate('Play')} />
          <Button title="Settings" onPress={
            () => Props.navigation.navigate('Settings')} />
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
  stretch: {
    width: 50,
    height: 200,
    resizeMode: 'stretch',
  },
});
