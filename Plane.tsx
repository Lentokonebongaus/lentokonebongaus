class Plane {
    icao24: string
    callsign: string
    originCountry: string
    timePosition: number
    lastContact: number
    longitude: number
    latitude: number
    baroAltitude: number
    onGround: boolean
    velocity: number

    geoAltitude: number

    constructor(planeData) {
        this.icao24 = planeData[0]
        this.callsign = planeData[1]
        this.originCountry = planeData[2]
        this.timePosition = planeData[3]
        this.lastContact = planeData[4]
        this.longitude = planeData[5]
        this.latitude = planeData[6]
        this.baroAltitude = planeData[7]
        this.onGround = planeData[8]
        // Velocity in m/s
        this.velocity = planeData[9]

        this.geoAltitude = planeData[13]
    }
}

export default Plane