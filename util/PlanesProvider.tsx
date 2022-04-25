import { useEffect, useState, createContext } from 'react';
import { refreshPlanes } from './locationFunctions';

const PlanesContext = createContext("")

function PlanesProvider({ children }){
    // User is the name of the "data" that gets stored in context
    const [planes, setPlanes] = useState([])
    
    return (
      <PlanesContext.Provider value={{ planes, setPlanes }}>
        {children}
      </PlanesContext.Provider>
    );
}


export { PlanesContext, PlanesProvider }