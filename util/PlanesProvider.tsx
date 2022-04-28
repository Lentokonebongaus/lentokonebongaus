import { useState, createContext } from 'react';

const PlanesContext = createContext("")

function PlanesProvider({ children }) {
  const [planes, setPlanes] = useState([])

  return (
    <PlanesContext.Provider value={{ planes, setPlanes }}>
      {children}
    </PlanesContext.Provider>
  );
}


export { PlanesContext, PlanesProvider }