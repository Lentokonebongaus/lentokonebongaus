class Plane {
    //------------ From OpenSky API --------------
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
    trueTrack: number
    verticalRate: number
    // sensors: array
    geoAltitude: number
    squawk: string
    spi: boolean
    positionSource: number
    // ----------- From Backend -------------------
    manufacturerName: string 
    model: string
    operator: string
    operatorCallsign: string
    owner: string
    /*
    registration: string 
    manufacturericao: string
    typecode: string
    serialnumber: string 
    linenumber: string
    icaoaircrafttype : string
    operatoricao: string
    operatoriata: string
    testreg: string
    registered: string
    reguntil: string
    status: string
    built: string
    firstflightdate: string
    seatconfiguration: string
    engines: string
    modes: string
    adsb: string
    acars: string
    notes: string
    categoryDescription: string
    */

    constructor(planeData:any) {
        this.icao24 = planeData[0]
        this.callsign = planeData[1]
        this.originCountry = planeData[2]
        this.timePosition = planeData[3]
        this.lastContact = planeData[4]
        this.longitude = planeData[5]
        this.latitude = planeData[6]
        this.baroAltitude = planeData[7]
        this.onGround = planeData[8]
        this.velocity = planeData[9]
        this.trueTrack = planeData[10]
        this.verticalRate = planeData[11]
        //this.sensors = planeData[12]
        this.geoAltitude = planeData[13]
        this.squawk = planeData[14]
        this.spi = planeData[15]
        this.positionSource = planeData[16]
        this.manufacturerName = ""
        this.model = ""
        this.operator = ""
        this.operatorCallsign = ""
        this.owner = ""
    }

    getBackendData(){
        // TODO
        this.manufacturerName = "Airbus"
        this.model = "A319-115"
        this.operator = ""  // Not every plane has operator value. Value could be "Iberia Airlines", for example.
        this.operatorCallsign = "AMERICAN"
        this.owner = "American Airlines Inc"
    }
}

export default Plane