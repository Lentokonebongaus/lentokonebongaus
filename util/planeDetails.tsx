async function fetchPlaneDetails(icao24:String){
    const backendUrl = "http://192.168.1.143:5000"
    const planePromise = await fetch(`${backendUrl}?icao24=${icao24}`)
    const planeDetails = await planePromise.json()
    return planeDetails
}

export default fetchPlaneDetails