async function fetchPlaneDetails(icao24:String){
    const backendUrl = "http://172.105.80.249"
    const planePromise = await fetch(`${backendUrl}?icao24=${icao24}`)
    const planeDetails = await planePromise.json()
    return planeDetails
}

export default fetchPlaneDetails