import { useEffect, useState, createContext } from 'react';

// A wild create context appears! Used for creating "global variables" in functional programming without passing props through multiple components. 
const LoggedUsernameContext = createContext("")

function LoggedUsernameProvider({ children }){
    // User is the name of the "data" that gets stored in context
    const [loggedUsername, setLoggedUsername] = useState("Not logged in")
    return (
      <LoggedUsernameContext.Provider value={{ loggedUsername, setLoggedUsername }}>
        {children}
      </LoggedUsernameContext.Provider>
    );
}

export { LoggedUsernameContext, LoggedUsernameProvider}