import Plane from "./util/Plane"
import Card from "./util/Card"

let testPlane = new Plane(["aaef89","AAL2521 ","United States",1648566496,1648566496,-101.9991,38.7543,11269.98,false,234.3,129.39,0.33,null,11384.28,"7144",false,0,1])
testPlane.getBackendData()
const testCard = new Card(testPlane)

/* Console.log:
Card {
  "cardId": "1648568469955A321-21211618.58",
  "cardQuality": 11618.58,
  "planeManufacturer": "Airbus",
  "planeModel": "A321-212",
  "planeOperator": "Iberia Airlines",
  "planeOperatorCallSign": "IBERIA",
  "planeOwner": "Iberia",
  "planePicture": "",
}
*/

export default testCard