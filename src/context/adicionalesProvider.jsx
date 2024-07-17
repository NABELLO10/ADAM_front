import {useState, useEffect, createContext} from 'react'

const AdicionalesContext = createContext()

const AdicionalesProvider = ({children}) => {

    const [empresaSistema, setEmpresaSistema] = useState('');
    const [id_transportista, setTransportista] = useState('');
  
    
    return(
        <AdicionalesContext.Provider 
            value={{            
                empresaSistema,
                setEmpresaSistema,
                id_transportista,
                setTransportista,
            }}>
            {children}
        </AdicionalesContext.Provider>
    )
}

export {
    AdicionalesProvider
}

export default AdicionalesContext
