import Plane from "./Plane";
import * as Location from 'expo-location';
import fetchplanesData from '../util/planesData';

export async function refreshPlanes(location: any, setPlanes: Function) {
    const planesData = await fetchplanesData(location)
    setPlanes([])
    for (let i = 0; i < planesData.length; i++) {
        let newPlane = new Plane(planesData[i], location)
        setPlanes((planes) => ([...planes, newPlane]))
    }
}

export async function setGPSlocation(setLocation: Function, setErrorMsg: Function) {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        if (setErrorMsg) {
            setErrorMsg('Permission to access location was denied');
        }
        return false
    }
    const userGpsLocation = await Location.getCurrentPositionAsync({});
    console.log("USERLOCATION SET:")
    console.log(userGpsLocation)
    setLocation({ longitude: userGpsLocation.coords.longitude, latitude: userGpsLocation.coords.latitude });
}