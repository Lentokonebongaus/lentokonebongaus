class Card {
    cardId: string
    cardOwner: string
    cardQuality: number
    planePicture: string
    planeManufacturer: string
    planeModel: string
    // Operator, opratorCallSign or owner values can be an empty string!
    planeOperator: string
    planeOperatorCallSign: string
    planeOwner: string
    planeDistance: number
    planeIcao24: string

    constructor(plane:any, cardOwner:string="default user", cardUrl:string=""){
        this.cardOwner = cardOwner
        this.cardQuality = this.getCardQuality(plane)
        this.planeManufacturer = plane["manufacturerName"]
        this.planeModel = plane["model"]
        this.planeOperator = plane["operator"]
        this.planeOperatorCallSign = plane["operatorCallsign"]
        this.planeOwner = plane["owner"]
        this.cardId = Date.now().toString()+this.planeModel+this.cardQuality
        this.planeDistance = plane.distance
        this.planePicture = cardUrl
        this.planeIcao24 = plane["icao24"]
    }

    getCardQuality(plane:any){
        const distance:number = plane["distance"]
        const velocity:number = plane["velocity"]
        const geoAltitude:number = plane["geoAltitude"]
        return Math.floor(geoAltitude+velocity*2-distance)
    }
}

export default Card