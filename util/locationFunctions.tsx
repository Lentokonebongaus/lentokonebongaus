import Plane from "./Plane";
import * as Location from 'expo-location';
import fetchplanesData from '../util/planesData';
import distanceBetween from "./distanceBetween";

export async function refreshPlanes(location: any, setPlanes: Function) {
    const planesData = await fetchplanesData(location)
    const planesTmp = []
    for (let i = 0; i < planesData.length; i++) {
        let newPlane = new Plane(planesData[i], location)
        planesTmp.push(newPlane)
    }
    setPlanes(planesTmp)
}

export async function getPlaneDistance(icao24: string, userLocation: any) {
    const apiURL = "https://opensky-network.org/api/states/all"
    const response = await fetch(`${apiURL}?icao24=${icao24}`)
    const json = await response.json()
    try {
        const planeLocation = { longitude: json.states[0][5], latitude: json.states[0][6] }
        const distance = distanceBetween(planeLocation.latitude, planeLocation.longitude, userLocation.latitude, userLocation.longitude)
        return distance
    } catch {
        return false
    }
}

export async function getPlaneCurrentData(icao24: string, userLocation: any) {
    const apiURL = "https://opensky-network.org/api/states/all"
    const response = await fetch(`${apiURL}?icao24=${icao24}`)
    const json = await response.json()
    try {
        const planeLocation = { longitude: json.states[0][5], latitude: json.states[0][6] }
        const distance = distanceBetween(planeLocation.latitude, planeLocation.longitude, userLocation.latitude, userLocation.longitude)
        const velocity = json.states[0][9]
        const geometricAltitude = json.states[0][13]
        return { distance: distance, velocity: velocity, geometricAltitude: geometricAltitude }
    } catch {
        return false
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
    setLocation({ longitude: userGpsLocation.coords.longitude, latitude: userGpsLocation.coords.latitude });
}