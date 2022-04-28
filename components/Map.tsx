import { useState, useContext } from 'react';
import { View } from 'react-native';
import MapView, { Marker, Circle } from 'react-native-maps';
import { PROVIDER_GOOGLE } from 'react-native-maps';
import Plane from "../util/Plane"
import planeIcon from '../assets/plane_icon.png'
import planeIconGrounded from '../assets/plane_icon_grounded.png'
import planeIconGroundedCollected from '../assets/plane_icon_grounded_collected.png'
import planeIconCollected from '../assets/plane_icon_collected.png'
import { UserCardsContext, updateUserCardsContext } from '../util/UserCardsProvider';
import { PlanesContext } from '../util/PlanesProvider';
import { styles } from '../util/styles';
import { UserLocationContext, refreshUserLocationContext } from '../util/UserLocationProvider';

export default function Map(props: any) {

  // Because MapView is rendered before user location is set, region state is used to set the initial map view to a pre-determined location.
  // A short loading screen would maybe be another, more adequate solution? -Eeli
  const [region, setRegion] = useState({ longitude: 24.9049634, latitude: 60.2494251, latitudeDelta: 0.20, longitudeDelta: 0.02 });
  const [errorMsg, setErrorMsg] = useState("");
  const { userCards, setUserCards } = useContext(UserCardsContext)
  const { planes, setPlanes } = useContext(PlanesContext)
  const { userLocation, setUserLocation } = useContext(UserLocationContext)

  const getPlaneIcon = (plane: Plane) => {

    const planeInUserCards = icao24NotInUsersCards(plane.icao24)
    if (plane.onGround && !planeInUserCards) {
      return planeIconGrounded
    } else if (plane.onGround && planeInUserCards) {
      return planeIconGroundedCollected
    } else if (!plane.onGround && planeInUserCards) {
      return planeIconCollected
    } else {
      return planeIcon
    }
  }

  function icao24NotInUsersCards(icao24: String) {

    const cardIds = Object.keys(userCards)
    for (let i = 0; i < cardIds.length; i++) {
      if (userCards[cardIds[i]].planeIcao24 == icao24) {
        return true
      }
    }
    return false
  }

  return (
    <View style={styles.container}>
      <MapView
        style={{ height: '100%', width: '100%' }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsCompass={true}
        showsScale={true}
        showsTraffic={false}
        initialRegion={region}
      >
        {planes ?
          planes.map((plane, index) => {
            if (plane.latitude && plane.longitude) {
              return (
                <Marker
                  icon={getPlaneIcon(plane)}
                  key={index}
                  coordinate={{
                    latitude: plane.latitude,
                    longitude: plane.longitude,
                  }}
                  title={plane.icao24}
                  onPress={() => { props.navigation.navigate("Plane", { plane: plane, location: userLocation }) }}
                  // plane_icon.png isn't currently aligned with Plane object's trueTrack attribute, so even though trueTrack is measured in degrees
                  // similar to Marker component's rotation prop, png file's unalignment needs to be taken into account. 
                  rotation={plane.trueTrack + 50}
                />
              )
            }
          }) : undefined
        }
        <Circle
          center={{ latitude: userLocation.latitude, longitude: userLocation.longitude }}
          radius={70000}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#e6e600",
            fillOpacity: 0.35,
            clickable: false,
            draggable: false,
            editable: false,
            visible: true,
            zIndex: 1
          }}
        >
        </Circle>
      </MapView>
    </View>
  );
}
