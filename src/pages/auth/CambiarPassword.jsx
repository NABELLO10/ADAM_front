import { useState } from "react"
import { msgError, msgInfo, msgOk } from '../../components/Alertas';
import clienteAxios from '../../config/axios'
import { ToastContainer } from 'react-toastify';

const CambiarPassword = () => {

  const [password, setPassword] = useState({
    passwordActual : '',
    passwordNuevo1 : '',
    passwordNuevo2 : ''
  })

  const limpiarFormulario = () =>{
    setPassword({   passwordActual : '',
    passwordNuevo1 : '',
    passwordNuevo2 : ''})
    document.getElementById("form1").reset();
    
  }
  
  const handleSubmit = async (e) => {
    e.preventDefault()

    if(Object.values(password).some(campo => campo === '')){  
      msgError("Todos los campos son obligatorios")
      return
    }

    
    if(password.passwordNuevo1 != password.passwordNuevo2){
      msgInfo("Contraseñas NO Coinciden")
      return
    }

    const token = localStorage.getItem('token_adam')            
       
    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`    
        }
    }

    try {
        const url = `/actualizar-password`
        const {data} = await clienteAxios.put(url, password, config)
       
        msgOk(data.msg)     
        limpiarFormulario()

     } catch (error) {         
        msgError(error.response.data.msg)     
    } 
}
  

  return (
    <>       
        <h2 className="font-bold text-3xl text-center text-red-900 mt-10">Cambiar <span className="text-red-500 font-bold">Password</span> </h2>
    
        <div className="flex mt-4 justify-center">
            <div className="w-full lg:w-4/12 bg-white shadow-xl border  rounded-lg p-5 ">

          
                <form id="form1" onSubmit={handleSubmit}>
                    <div className="my-3">
                        <label className="uppercase font-bold text-gray-600">Password Actual</label>
                        <input
                            type="password"
                            className="border bg-gray-50 w-full mt-2 rounded-lg p-2"
                            name="passwordActual"
                            placeholder="Escribe tu password actual"
                            onChange={e => setPassword({
                              ...password,
                              [e.target.name] : e.target.value
                            })}
                           >                          
                        </input>
                    </div>

                    <div className="my-3">
                        <label className="uppercase font-bold text-gray-600">Nueva Passsword</label>
                        <input
                            type="password"
                            className="border bg-gray-50 w-full mt-2 rounded-lg p-2"
                            name="passwordNuevo1"
                            placeholder="Escribe tu nuevo password"
                            onChange={e => setPassword({
                              ...password,
                              [e.target.name] : e.target.value
                            })}
                           >                          
                        </input>
                    </div>

                    <div className="my-3">
                        <label className="uppercase font-bold text-gray-600">Confirmar Nueva Passsword </label>
                        <input
                            type="password"
                            className="border bg-gray-50 w-full mt-2 rounded-lg p-2"
                            name="passwordNuevo2"
                            placeholder="Confirma tu nuevo password"
                            onChange={e => setPassword({
                              ...password,
                              [e.target.name] : e.target.value
                            })}
                           >                          
                        </input>
                    </div>
                                       

                    <input 
                        type="submit"
                            value="Actualizar Password"
                            className="bg-red-800 mb-5 hover:bg-red-700 transition cursor-pointer py-3 rounded-lg w-full text-white font-bold mt-5 ">
                    </input>
          

                </form>
            </div>
        </div>

    </>
  )
}

export default CambiarPassword