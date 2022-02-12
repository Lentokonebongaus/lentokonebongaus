const planesData = new Promise((resolve,reject) =>{
    fetch("https://opensky-network.org/api/states/all")
    .then(response => response.json())
    .then(data => resolve(data))
    .catch(err => reject(err))

})

export default planesData