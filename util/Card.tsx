class Card {
    cardId: string
    cardQuality: number
    planePicture: string
    planeManufacturer: string
    planeModel: string
    // Operator, opratorCallSign or owner values can be an empty string!
    planeOperator: string
    planeOperatorCallSign: string
    planeOwner: string

    constructor(plane:any){
        this.cardQuality = this.getCardQuality(plane)
        this.planeManufacturer = plane["manufacturerName"]
        this.planeModel = plane["model"]
        this.planeOperator = plane["operator"]
        this.planeOperatorCallSign = plane["operatorCallsign"]
        this.planeOwner = plane["owner"]
        this.cardId = Date.now().toString()+this.planeModel+this.cardQuality
        this.planePicture = ""
    }

    getCardQuality(plane:any){
        const velocity:number = plane["velocity"]
        const geoAltitude:number = plane["geoAltitude"]
        return velocity+geoAltitude
    }
}

export default Card