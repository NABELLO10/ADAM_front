import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import { validateRUT } from 'validar-rut'

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

const EmpresasSistemas = () => {
    const { auth } = useAuth();
    const [id_empresa] = useState(auth.id_empresa);
    const [rut_empresa, setRutEmpresa] = useState('')    
    const [nom_empresa, setNomEmpresa] = useState('')
    const [nom_razon_social, setRazonSocial] = useState('')
    const [rep_legal, setRepLegal] = useState('')
    const [rut_rep_legal, setRutRepLegal] = useState('')
    const [cod_ciudad, setCiudad] = useState('')
    const [direccion, setDireccion] = useState('')
    const [estado, setEstado] = useState(1)
    const [busqueda, setBusqueda] = useState("");

    const [empresasAdmin, setEmpresasAdmin] = useState([]);
    const [empresaAdmin, setEmpresaAdmin] = useState(auth.id_empresa);

    const [id, setID] = useState(null)

 
    //Lista de empresas registradas
    const [empresas, setEmpresas] = useState([])
    //listar ciudades
    const[ciudades, setCiudades] = useState([])
    //PARA EDICION de una empresa
    const [empresa, setEmpresa] = useState({})
    

    useEffect(()=>{ 
         obtenerEmpresasAdmin()       
         obtenerEmpresas()    
        listarCiudades() 
    },[])

    useEffect(()=>{
      obtenerEmpresas()
    },[empresaAdmin])


    
  const obtenerEmpresasAdmin = async () =>{
    try {
        const token = localStorage.getItem("token_adam")

        if(!token) return
  
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }                        
     
        const {data} = await clienteAxios('/crud/obtener-empresas', config)           
        setEmpresasAdmin(data)
        console.log(data)

    } catch (error) {
        console.log(error)
    }
}   

    const obtenerEmpresas = async () =>{
        try {
            const token = localStorage.getItem("token_adam")    
            if(!token) return
      
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }                      
            const {data} = await clienteAxios(`/crud/obtener-empresas-sistema/${empresaAdmin }` , config)           
            setEmpresas(data)    
        } catch (error) {
            console.log(error)
        }
    }   

    
    const listarCiudades = async () =>{
        try {
            const token = localStorage.getItem("token_adam")

            if(!token) return
      
            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            }                     
            const {data} = await clienteAxios('/general/obtener-ciudades', config)                   
            setCiudades(data)   
        } catch (error) {
            console.log(error)
        }   
    }
    
        
    const limpiarFormulario = () => {
        setRutEmpresa('')
        setNomEmpresa('')
        setRazonSocial('')
        setRepLegal('')
        setRutRepLegal('') 
        setCiudad('')
        setDireccion('')
        setEmpresa({})
        setID(null)
        setEstado(1)
        obtenerEmpresas()
    }

    const setEdicion = (empresa) =>{        
        setEmpresa(empresa)
        setRutEmpresa(empresa.rut_empresa)
        setNomEmpresa(empresa.nom_empresa)
        setRazonSocial(empresa.nom_razon_social)
        setRepLegal(empresa.rep_legal)
        setRutRepLegal(empresa.rut_rep_legal) 
        setCiudad(empresa.cod_ciudad)
        setDireccion(empresa.direccion)  
        setEstado(empresa.est_activo)
        setID(empresa.id)
    }

   
    // const eliminarEmpresa = async (id) =>{   
    //     try {
    //         const token = localStorage.getItem("token_exacta_sf")

    //         if(!token) {
    //             msgError("Token no valido")
    //             return
    //         }   

    //         const config = {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 Authorization: `Bearer ${token}`
    //             }
    //         } 

    //         const {data} = await clienteAxios.delete(`mantencion/empresas/${id}`, config)

    //         msgOk(data.msg);
    //         listarEmpresas()           
    //         toggleModal();
            
    //     } catch (error) {
    //         console.log(error)
    //         msgError("No se puede eliminar porque hay registros relacionados")
    //     }        
    // }

    const registrar = async () =>{
        if([rut_empresa, nom_empresa, cod_ciudad, direccion].includes('')){
            msgError("Ingrese todos los campos")
            return
        } 
     

       try {            
          if(!validateRUT(rut_empresa)){
            msgError("Rut Empresa Incorrecto")
            return
          }
     
            const token = localStorage.getItem("token_adam")
    
            if(!token) {
                msgError("Token no valido")
                return
            }   

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            } 

            if(empresa.id) {
                const {data} = await clienteAxios.put(`/crud/empresas/${id}`, {
                    rut_empresa,
                    nom_empresa,                 
                    cod_ciudad,
                    direccion,
                    est_activo: estado                  
                }, config)
             
                msgOk(data.msg)

            }else{
               
                const {data} = await clienteAxios.post('/crud/empresas', {
                    rut_empresa,
                    nom_empresa, 
                    nom_razon_social, 
                    rep_legal,
                    rut_rep_legal, 
                    cod_ciudad,
                    direccion,
                    est_activo: estado,
                    id_empresa : auth.id_perfil == 1 ? empresaAdmin : auth.id_empresa,
                }, config)
             
                msgOk(data.msg)
            }          
                    
          limpiarFormulario()            
            
         } catch (error) {
           msgError(error.response.data.msg)
        }       
    }


    const formateaRut = (rut) => {
      const actual = rut.replace(/^0+/, "");
      if (actual !== '' && actual.length > 1) {
        const sinPuntos = actual.replace(/\./g, "");
        const actualLimpio = sinPuntos.replace(/-/g, "");
  
        let inicio = actualLimpio.substring(0, actualLimpio.length - 1);
        let rutFormateado = "";
        let j = 1;
  
        for (let i = inicio.length - 1; i >= 0; i--) {
          const letra = inicio.charAt(i);
          rutFormateado = letra + rutFormateado;
          if (j % 3 === 0 && j <= inicio.length - 1) {
            rutFormateado = "." + rutFormateado;
          }
          j++;
        }
  
        const dv = actualLimpio.substring(actualLimpio.length - 1);
        rutFormateado = rutFormateado + "-" + dv;
  
        return rutFormateado;
      } else {
        return rut;
      }
    };
  
    const handleRutChange = (e) => {
      const inputRut = e.target.value;
      const rutFormateado = formateaRut(inputRut);
      setRutEmpresa(rutFormateado);
    };
  
    const handleRutRepLegalChange = (e) => {
      const inputRut = e.target.value;
      const rutFormateado = formateaRut(inputRut);
      setRutRepLegal(rutFormateado);
    };


    const handleSubmit = async (e) => {
        e.preventDefault() 
        await registrar()       
    }
    
  return (
    <>
      <h2 className="font-black text-red-900 text-2xl mx-4 ">
        Registrar{" "}
        <span className="font-black text-red-500 mb-10 text-center">
          Empresas
        </span>
      </h2>

      <div className="mt-4 mx-4 lg:mx-0 lg:flex justify-start">
        <div className="shadow-lg h-full  lg:w-4/12 px-8 py-5 rounded-xl bg-white">
          <form className="" onSubmit={handleSubmit}>
            {auth.id == 2 && (
              <div className="">
                <label
                  htmlFor="empresa"
                  className="peer-placeholder-shown:uppercase absolute left-0 -top-3.5 text-gray-900 text-sm
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all peer-placeholder-shown:top-3"
                ></label>

                <select
                  name="empresa"
                  value={empresaAdmin}
                  className={`mt-2 w-full p-2 bg-gray-50 border uppercase border-gray-300 rounded-lg text-center text font-bold text-gray-500 `}
                  onChange={(e) => setEmpresaAdmin(e.target.value)}
                >
                  {empresasAdmin.map((empresa) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nom_empresa}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="space-y-4 mt-4">
              <div className=" ">
                <TextField
                  id="rut_empresa"
                  className="peer pt-3 pb-2 block w-full"
                  
                  value={rut_empresa}
                  onChange={(e) => handleRutChange(e)}
                  label="Rut Empresa"
                  variant="outlined"
                  inputProps={{ maxLength: 12 }}
                />
              </div>

              <div className="">
                <TextField
                  id="nom_empresa"
                  className="peer pt-3 pb-2 block w-full"
                  value={nom_empresa}
                  onChange={(e) => setNomEmpresa(e.target.value)}
                  label="Nombre Empresa"
                  variant="outlined"
                />
              </div>

              <div className="">
                <select
                  name="ciudad"
                  value={cod_ciudad}
                  className="w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-center text font-bold text-gray-500"
                  onChange={(e) => setCiudad(e.target.value)}
                >
                  <option value={""} disabled hidden>
                    Ciudad...
                  </option>
                  {ciudades.map((ciudad) => (
                    <option key={ciudad.id} value={ciudad.id}>
                      {ciudad.nom_comuna}
                    </option>
                  ))}
                </select>
              </div>


              <div className=" ">
                <TextField
                  id="direccion"
                  className="peer pt-3 pb-2 block w-full"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                  label="Dirección"
                  variant="outlined"
                />
              </div>

             
              <div className="">
                <select
                  name="perfil"
                  value={estado}
                  className=" w-full p-2 bg-gray-50 border border-gray-300 rounded-lg text-center text font-bold text-gray-500"
                  onChange={(e) => setEstado(e.target.value)}
                >
                  <option value={1}>Activo</option>
                  <option value={0}>Inactivo</option>
                </select>
              </div>
            </div>

            <div className="lg:flex gap-5 lg:my-2">
              <div className="lg:flex  gap-2  mx-auto">
                <input
                  type="submit"
                  value={empresa.id ? "Actualizar" : "Registrar"}
                  className="bg-red-800  hover:bg-red-700 duration-500 w-full py-3 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer px-10"
                ></input>

                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className={`bg-gray-600  hover:bg-gray-700 duration-500 w-full  py-3 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer px-10 `}
                >
                  Cancelar
                </button>
              </div>
              
            </div>
          </form>
        </div>

        <div className="overflow-auto lg:w-8/12 rounded-lg  lg:mt-0 mt-6 lg:px-5">
          <div className="lg:w-4/12">
            <input
              name="busqueda"
              id="busqueda"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className=" border border-blue-800 shadow rounded-md p-1  w-full text-blue-500 placeholder-blue-300 mb-2"
              placeholder=" Buscar empresa..."
            />
          </div>
          <table className=" border-collapse border-2 lg:w-full shadow-lg border-gray-300 rounded-lg bg-white text-left text-xs text-gray-500">
            <thead className="bg-gray-300">
              <tr>
                <th scope="col" className="px-6 py-2 font-bold text-gray-900">
                  Rut
                </th>
                <th scope="col" className="px-6 py-2 font-bold text-gray-900">
                  Empresa
                </th>

                <th scope="col" className="px-6 py-2 font-bold text-gray-900">
                  Ciudad
                </th>
                <th scope="col" className="px-6 py-2 font-bold text-gray-900">
                  Dirección
                </th>
                <th scope="col" className="px-6 py-2 font-bold text-gray-900">
                  Estado
                </th>

                <th
                  scope="col"
                  className="px-6 py-4 font-medium text-gray-900"
                ></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100  border-gray-100">
              {empresas
                .filter((val) => {
                  if (busqueda == "") {
                    return val;
                  } else if (
                    val.nom_empresa
                      .toLowerCase()
                      .includes(busqueda.toLowerCase())
                  ) {
                    return val;
                  }
                })
                .map((empresa) => (
                  <tr
                    className="whitespace-nowrap hover:bg-gray-200"
                    key={empresa.id}
                  >
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {empresa.rut_empresa}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {empresa.nom_empresa}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {empresa.nom_ciudad}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {empresa.direccion}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-500">
                      {empresa.est_activo ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-1 text-xs font-semibold text-red-600">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                          Inactivo
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        onClick={() => setEdicion(empresa)}
                        className="py-1 mx-2"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-blue-400 hover:text-blue-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>

                      {/* <button
                        className="py-1 "
                        onClick={() => {
                          setID(empresa.id);
                          toggleModal();
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-6 h-6 text-red-500 hover:text-red-800"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button> */}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        
      </div>

      {/* 
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-0.5 lg:w-2/6 rounded-lg">
            <div className="">
              <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b bg-gray-600 border-gray-200 rounded-t-md">
                <h5
                  className="text-xl font-bold leading-normal text-white"
                  id="exampleModalScrollableLabel"
                >
                  Eliminar Empresa
                </h5>
                <button
                  type="button"
                  className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body relative p-4">
                <p>¿Realmente desea eliminar esta Empresa?</p>
              </div>
              <div className="modal-footer flex flex-shrink-0 flex-wrap items-center justify-end p-4 border-t border-gray-200 rounded-b-md">
                <button
                  className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-500 active:shadow-lg transition duration-150 ease-in-out"
                  onClick={toggleModal}
                >
                  Cerrar
                </button>

                <button
                  type="button"
                  onClick={() => eliminarEmpresa(id)}
                  className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )} */}
    </>
  );
}

export default EmpresasSistemas