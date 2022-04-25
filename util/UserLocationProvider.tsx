import { useEffect, useState, createContext } from 'react';
import * as Location from 'expo-location';

const UserLocationContext = createContext("")

function UserLocationProvider({ children }){

    const [userLocation, setUserLocation] = useState({longitude:0, latitude:0})
    return (
      <UserLocationContext.Provider value={{ userLocation, setUserLocation }}>
        {children}
      </UserLocationContext.Provider>
    );
}

async function refreshUserLocationContext(setUserLocation){
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log("Could not refresh user location with refreshUserLocationContext().")
    }
    const userGpsLocation = await Location.getCurrentPositionAsync({});
    console.log("Setting new location with refreshUserLocationContext():")
    console.log(userGpsLocation)
    setUserLocation({longitude:userGpsLocation.coords.longitude, latitude:userGpsLocation.coords.latitude});
}

export { UserLocationContext, UserLocationProvider, refreshUserLocationContext }