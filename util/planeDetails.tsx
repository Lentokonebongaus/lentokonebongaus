async function fetchPlaneDetails(icao24:String){
    const backendUrl = "http://172.105.80.249"
    const planePromise = await fetch(`${backendUrl}?icao24=${icao24}`)
    const planeDetails = await planePromise.json()
    return planeDetails
}

async function fetchPlaneImageUrl(manufacturer, model, owner){

    console.log("fetchPlaneImage()!!!!")
    const urlParameterManufacturer = manufacturer.replace(" ", "_")
    const urlParameterModel = model.replace(" ", "_")
    const urlParameterOwner = owner.replace(" ", "_")

    const totallyNotTheAvainInEnglish = "254b751d30d74101bf6994f74a3c5c34"
    const resourceUrl = `https://api.bing.microsoft.com/v7.0/images/search?q=${urlParameterManufacturer}+${urlParameterModel}+${urlParameterOwner}`
    console.log(resourceUrl)

    const response = await fetch(resourceUrl, {headers:{"Ocp-Apim-Subscription-Key":totallyNotTheAvainInEnglish}})
    if(response.status == 200){
        const apiData = await response.json()
        const apiDataValues = apiData.value
        const firstImgJson = apiDataValues[0]
        console.log("Fetched image url:")
        console.log(firstImgJson.contentUrl)
        return firstImgJson.contentUrl
    }
}

export { fetchPlaneDetails, fetchPlaneImageUrl }