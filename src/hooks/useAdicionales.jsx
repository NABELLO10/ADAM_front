import { useContext } from 'react'
import adicionalesProvider from '../context/adicionalesProvider'

const useAdicionales= () =>{
    return useContext(adicionalesProvider)
}

export default useAdicionales