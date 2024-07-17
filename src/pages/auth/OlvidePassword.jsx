import { useState } from "react"
import { Link } from "react-router-dom"
import { msgError, msgInfo, msgOk, msgWarning } from "../../components/Alertas";
import { ToastContainer } from 'react-toastify';
import clienteAxios from "../../config/axios";

const OlvidePassword = () => {

    const [email, setEmail]  = useState('')

    const handleSubmit = async (e) =>{
        e.preventDefault()
        
        if([email].includes('')){             
            msgInfo("Ingrese Email")        
            return
        }
      
        try {         
            const {data} = await clienteAxios.post('olvide-password', {email})
            msgOk(data.msg)
            
        } catch (error) {     
            msgError(error.response.data.msg)           
        }      
    }



  return (
    <div className="flex items-center justify-center bg-red-950 h-screen" style={{ backgroundImage: "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/fondoLogin.jpg')",backgroundSize: 'cover', backgroundPosition: 'center' }}>
    <div className="items-center  md:mt-0  ">
        {/* Lado izquierdo con la imagen */}
        <div className="md:w-3/12 mx-5 md:mx-auto">
          <img className="object-cover w-full" src="../../../public/logo.png" />
        </div>
        
        <ToastContainer />
        {/* Lado derecho con el formulario */}
        <div className="md:w-1/2 p-4 px-12 mx-auto flex items-center justify-center">
          <div className="md:w-8/12 w-full">
            <h2
              className="md:text-4xl md:block hidden text-center font-semibold mb-4 text-red-200"
              style={{ fontFamily: "Rubik, sans-serif", fontWeight: 600, fontSize:30 }}
            >
              Recuperar Contraseña
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
              
                <input
                  type="text"
                  id="username"
                 
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-red-500"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  
                />
              </div>
            
              <button
                type="submit"
                className="w-full bg-red-900 text-white font-semibold rounded-lg py-2 hover:bg-red-600 transition duration-300"
              >
                Recuperar Contraseña
              </button>

           
              <Link
          className="block text-end my-2 text-red-200 text-sm hover:text-red-600 duration-200"
          to="/"
        >
          Iniciar Sesión
        </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OlvidePassword