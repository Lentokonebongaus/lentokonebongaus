import { useEffect, useState, createContext } from 'react';
import { get } from 'firebase/database';
import { cardsDb } from "../util/Firebase"

const UserCardsContext = createContext("")

function UserCardsProvider({ children }){
    const [userCards, setUserCards] = useState([])
    return (
      <UserCardsContext.Provider value={{ userCards, setUserCards }}>
        {children}
      </UserCardsContext.Provider>
    );
}

async function updateUserCardsContext(setUserCards, loggedUsername){
  get(cardsDb).then((snapshot)=>{
    const cardsArray = snapshot.val()
    const cardIds =  Object.keys(cardsArray)
    const userCardsTmp = []
    for (let i = 0; i < cardIds.length; i++){
        if(loggedUsername == cardsArray[cardIds[i]].cardOwner){
            userCardsTmp.push(cardsArray[cardIds[i]])
        }
    }
    setUserCards(userCardsTmp)
})
}

function icao24InUsersCards(userCards, icao24:String){
  for(let i = 0; i < userCards.length; i++){
    if(userCards[i].planeIcao24 == icao24){
      return true
    }
  }
  return false
}

export { UserCardsContext, UserCardsProvider, updateUserCardsContext, icao24InUsersCards  }