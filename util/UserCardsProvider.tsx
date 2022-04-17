import { useEffect, useState, createContext } from 'react';

const UserCardsContext = createContext("")

function UserCardsProvider({ children }){
    // User is the name of the "data" that gets stored in context
    const [userCards, setUserCards] = useState([])
    return (
      <UserCardsContext.Provider value={{ userCards, setUserCards }}>
        {children}
      </UserCardsContext.Provider>
    );
}

export { UserCardsContext, UserCardsProvider }