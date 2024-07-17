import { Outlet, useNavigate } from "react-router-dom"
import useAuth from "../hooks/useAuth"
import Menu2 from "../components/menus/Menu2" 
import Spinner from '../components/animaciones/Spinner'
import { ToastContainer } from 'react-toastify';
import { useEffect } from "react"

 const RutaProtegida = () => {
  const navigate = useNavigate()
  const {auth, cargando} = useAuth()
    
  useEffect(() => {
    if (!cargando && !auth?.id) {
      navigate('/')
    }
  
     if(auth.est_activo == 0){
      navigate('/')
    } 

  }, [auth?.id, auth.est_activo, cargando, navigate])

  if (cargando) return <Spinner/>
   
  return (
    <>    
      <Menu2 />   

      <main className="lg:mx-20 mx-5  h-screen mt-20 mb-2">
        <ToastContainer />
        <Outlet />
      </main>
    </>
  );
} 

export default RutaProtegida