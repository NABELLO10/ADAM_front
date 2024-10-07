import {useState, useEffect, createContext} from 'react'
import clienteAxios from '../config/axios'

const authContext = createContext()

const AuthProvider = ({children}) =>{

    const [cargando, setCargando] = useState(true)
    const [auth, setAuth] = useState({})
   
    useEffect(()=>{
        const autenticarUsuario = async () =>{
            const token = localStorage.getItem('token_adam')
                        
            if(!token) {
                setCargando(false)
                return
            }

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`    
                }
            }

            try {
                const {data} = await clienteAxios.get('/perfil', config)                 
                setAuth(data) 
      
                
             } catch (error) {
                 console.log(error.responde.data.msg)
                 setAuth({})
             } 
        
            setCargando(false)                        
        }

        autenticarUsuario()

    },[])


    const cerrarSesion = () =>{
        localStorage.removeItem('token_adam')
        setAuth({})
    }
      

    const guardarPassword = async (datos) => {
        const token = localStorage.getItem('token_adam')            
           
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`    
            }
        }

        try {
            const url = `/actualizar-password`
            const {data} = await clienteAxios.put(url, datos, config)
            return (data)
            
        } catch (error) {
            return({
                msg : error.response.data.msg ,
                error: true
            })            
        }
    }
        

    return(
        <authContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                cerrarSesion,             
                guardarPassword,
                setCargando                     
            }}>
            {children}
        </authContext.Provider>
    )
}

export {
    AuthProvider
}

export default authContext