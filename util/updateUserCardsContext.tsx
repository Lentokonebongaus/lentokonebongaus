import { get } from 'firebase/database';
import { cardsDb } from "./Firebase"

export default async function updateUserCardsContext(setUserCards, loggedUsername){
    get(cardsDb).then((snapshot)=>{
      const cardsArray = snapshot.val()
      const cardIds =  Object.keys(cardsArray)
      const userCardsTmp = []
      for (let i = 0; i < cardIds.length; i++){
          if(loggedUsername == cardsArray[cardIds[i]].cardOwner){
              userCardsTmp.push(cardsArray[cardIds[i]])
          }
      }
      console.log("PROVIDER")
      setUserCards(userCardsTmp)
  })
  }