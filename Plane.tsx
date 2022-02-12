class Plane {
    icao24: string
    callsign: string
    originCountry: string
    longitude: number
    latitude: number

    constructor(planeData) {
        this.icao24 = planeData[0]
        this.callsign = planeData[1]
        this.originCountry = planeData[2]
        this.longitude = planeData[5]
        this.latitude = planeData[6]
    }
}

export default Plane