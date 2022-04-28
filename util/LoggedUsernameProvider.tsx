import { useState, createContext } from 'react';

// Used for creating "global variables" in functional programming without passing props through multiple components. 
const LoggedUsernameContext = createContext("")

function LoggedUsernameProvider({ children }) {
  const [loggedUsername, setLoggedUsername] = useState("Not logged in")
  return (
    <LoggedUsernameContext.Provider value={{ loggedUsername, setLoggedUsername }}>
      {children}
    </LoggedUsernameContext.Provider>
  );
}

export { LoggedUsernameContext, LoggedUsernameProvider }