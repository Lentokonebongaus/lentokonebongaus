import { onValue } from 'firebase/database';
import { usersDb, cardsDb } from '../util/Firebase'

//placeholder card, remove after firebase read is finished
let testCard = {
    "cardId": "1650488333739Bombardier CRJ 900 ER NG7938",
    "cardOwner": '123asd',
    "cardQuality": 7938,
    "planeIcao24": '5110e2',
    "planeManufacturer": "Bombardier",
    "planeModel": "Bombardier CRJ 900 ER NG",
    "planeOperator": "Nordica",
    "planeOperatorCallSign": "REVAL",
    "planeOwner": "Nordica",
    "planePicture": "",
  }; 

const getAllCards = () => {
    let cards = [];
    onValue(cardsDb, (snapshot) => {
        console.log(snapshot)
        // TODO: haluan snapshotin datan usersiin kun se on saatavilla ja vasta sitten palauttaa
    })
    //return(cards);
    
    // placeholder
    return [testCard];
}

function getAllUsernames() {
    let users = [];
    onValue(usersDb, (snapshot) => {
        users = snapshot;
        console.log(users)
        // TODO: haluan snapshotin datan usersiin kun se on saatavilla ja vasta sitten palauttaa
        // idk
    })
    return(users);
}

export const notDuplicateCard = (card:any) => {
    getAllCards().forEach(dbCard => {
        if (dbCard.cardOwner == card.cardOwner && dbCard.planeIcao24 == card.planeIcao24){
            return false;
        }
    });
    return true;
}

export const notDuplicateUser = (newUser:any) => {
    let users = getAllUsernames();
    //...
    users.forEach(dbUser => {
        if (dbUser.username == newUser.username){
            return false;
        }
    })
    return true;
}