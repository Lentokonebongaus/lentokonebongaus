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

    constructor(plane:any, cardOwner:string="default user"){
        this.cardOwner = cardOwner
        this.cardQuality = this.getCardQuality(plane)
        this.planeManufacturer = plane["manufacturerName"]
        this.planeModel = plane["model"]
        this.planeOperator = plane["operator"]
        this.planeOperatorCallSign = plane["operatorCallsign"]
        this.planeOwner = plane["owner"]
        this.cardId = Date.now().toString()+this.planeModel+this.cardQuality
        this.planeDistance = plane.distance
        this.planePicture = ""
    }

    getCardQuality(plane:any){
        const distance:number = plane["distance"]
        const geoAltitude:number = plane["geoAltitude"]
        return Math.floor(geoAltitude-distance)
    }
}

export default Card