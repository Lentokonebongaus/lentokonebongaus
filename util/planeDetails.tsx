import { SUPER_SECRET_AZURE_KEY } from '../util/keys';

async function fetchPlaneDetails(icao24:String){
    const backendUrl = "http://172.105.80.249"
    const planePromise = await fetch(`${backendUrl}?icao24=${icao24}`)
    let planeDetails = await planePromise.json()
    if(planeDetails.ok != false){
        for (const [key, value] of Object.entries(planeDetails)){
            if(value == ""){
                planeDetails[key] = "Unknown"
            } 
        }
        return planeDetails
    } else{
        return false
    }
}

async function fetchPlaneImageUrl(manufacturer, model, owner){

    const urlParameterManufacturer = manufacturer.replace(" ", "_")
    const urlParameterModel = model.replace(" ", "_")
    const urlParameterOwner = owner.replace(" ", "_")
    const resourceUrl = `https://api.bing.microsoft.com/v7.0/images/search?q=${urlParameterManufacturer}+${urlParameterModel}+${urlParameterOwner}`

    const response = await fetch(resourceUrl, {headers:{"Ocp-Apim-Subscription-Key":SUPER_SECRET_AZURE_KEY}})
    if(response.status == 200){
        const apiData = await response.json()
        const apiDataValues = apiData.value
        const firstImgJson = apiDataValues[0]
        return firstImgJson.contentUrl
    } else if(response.status == 403){ //Forbidden
        return false
    }
}

export { fetchPlaneDetails, fetchPlaneImageUrl }