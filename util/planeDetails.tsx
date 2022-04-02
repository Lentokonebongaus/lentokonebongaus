async function fetchPlaneDetails(icao24:String){
    const backendUrl = "http://192.168.1.7:5000"
    const planePromise = await fetch(`http://192.168.1.7:5000?icao24=${icao24}`)
    const planeDetails = await planePromise.json()
    return planeDetails
}

export default fetchPlaneDetails