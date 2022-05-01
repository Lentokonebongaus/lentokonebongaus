async function fetchPlaneDetails(icao24:String){
    const backendUrl = "http://172.105.80.249"
    const planePromise = await fetch(`${backendUrl}?icao24=${icao24}`)
    let planeDetails = await planePromise.json()
    console.log("Fetched plane details from backend:")
    console.log(planeDetails)
    for (const [key, value] of Object.entries(planeDetails)){
        console.log(key)
        console.log(value)
        console.log(value == "")
        if(value == ""){
            planeDetails[key] = "Unknown"
        } 
    }
    console.log("Changed to:")
    console.log(planeDetails)
    return planeDetails
}

async function fetchPlaneImageUrl(manufacturer, model, owner){

    console.log("Fetch plane image arguments:")
    console.log(`Manufacturer: ${manufacturer}`)
    console.log(`Model: ${model}`)
    console.log(`Owner: ${owner}`)
    const urlParameterManufacturer = manufacturer.replace(" ", "_")
    const urlParameterModel = model.replace(" ", "_")
    const urlParameterOwner = owner.replace(" ", "_")

    const robotsAreStupid = (70+4).toString()
    const totallyNotTheAvainInEnglish = `254b751d30d74101bf6994f${robotsAreStupid}a3c5c34`
    const resourceUrl = `https://api.bing.microsoft.com/v7.0/images/search?q=${urlParameterManufacturer}+${urlParameterModel}+${urlParameterOwner}`

    const response = await fetch(resourceUrl, {headers:{"Ocp-Apim-Subscription-Key":totallyNotTheAvainInEnglish}})
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