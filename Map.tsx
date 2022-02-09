import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import MapView from 'react-native-maps';
import {PROVIDER_GOOGLE} from 'react-native-maps';



export default function Map() {
  return (
    <View style={styles.container}>
      <MapView style={{height: '100%', width: '100%'}} provider={PROVIDER_GOOGLE} showsUserLocation={true} showsCompass={true} showsScale={true} showsTraffic={true} />
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