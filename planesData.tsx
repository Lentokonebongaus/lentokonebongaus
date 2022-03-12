// https://openskynetwork.github.io/opensky-api/rest.html
// https://opensky-network.org/api/states/all?lamin=45.8389&lomin=5.9962&lamax=47.8229&lomax=10.5226
    
async function fetchplanesData(location:any){
    const minMaxDistance = 3
    const url = "https://opensky-network.org/api/states/all"
    const lamin = location.latitude-minMaxDistance
    const lamax = location.latitude+minMaxDistance
    const lomax = location.longitude+minMaxDistance
    const lomin = location.longitude-minMaxDistance
    const planes = await (await fetch( `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`)).json()
    return planes.states
}


export default fetchplanesData
