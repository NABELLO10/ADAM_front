import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import TextField from "@mui/material/TextField";


const CatNotificacion = () => {
  const { auth } = useAuth();
  const [id_empresa, setEmpresa] = useState(auth.id_empresa);

  const [nombre, setNombre] = useState("");
  const [empresasListado, setEmpresasListado] = useState([]);

  //BUSQUEDA EN GRILLA
  const [busqueda, setBusqueda] = useState("");
  //LISTAR
  const [tipos, setTipos] = useState([]);

  //PARA EDICION 
  const [tipoEdit, setTipoEdit] = useState({});

  //----- MODAL ---------
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

 //----- MODAL ---------
  useEffect(() => {   
    obtenerEmpresas()   
    obtenerTipos();
  }, [id_empresa]);


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
     
        const {data} = await clienteAxios('/crud/obtener-empresas', config)           
        setEmpresasListado(data)

    } catch (error) {
        console.log(error)
    }
}   
 
  const obtenerTipos = async () => {
    try {
      const token = localStorage.getItem("token_adam");

      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios(
        `/crud/cat-not/${id_empresa}`,
        config
      );
      setTipos(data);

    } catch (error) {
      console.log(error);
    }
  };

  const limpiarFormulario = () => {
    setNombre(""); 
    setTipoEdit({}); 
    obtenerTipos()
  };

  const setEdicion = (tipo) => {
    setTipoEdit(tipo);  
    setNombre(tipo.nom_tipo)  
  };

   const registrar = async () => {
    if ([nombre].includes("")) {
      msgError("Ingrese Nombre");
      return;
    }

    try {
      const token = localStorage.getItem("token_adam");

      if (!token) {
        msgError("Token no valido");
        return;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      if (tipoEdit.id) {
        const { data } = await clienteAxios.put(
          `/crud/cat-not/${tipoEdit.id}`,
          {
            nom_tipo: nombre,
            id_empresa         
          },
          config
        );

        msgOk(data.msg);
      } else {
        const { data } = await clienteAxios.post(
          "/crud/cat-not",
          {
            nom_tipo: nombre,
            id_empresa,            
          },
          config
        );

        msgOk(data.msg);
      }
      limpiarFormulario();
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registrar();
  };

  return (
    <>
      <h2 className="font-black text-cyan-900 text-2xl mx-4 ">
        Categoria{" "}
        <span className="font-black text-cyan-500 mb-10 text-center">
          Notificacion
        </span>
      </h2>

      <div className="grid-cols-2 lg:flex mt-4">
        <div className="shadow-lg  mx-6 lg:mx-auto lg:w-5/12 px-8  py-5 rounded-xl bg-white">
          <form onSubmit={handleSubmit}>
            {auth.id == 1 && (
              <div className="mb-3">
                <label
                  htmlFor="empresa"
                  className="peer-placeholder-shown:uppercase absolute left-0 -top-3.5 text-gray-900 text-sm
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all peer-placeholder-shown:top-3"
                ></label>

                <select
                  name="empresa"
                  value={id_empresa}
                  className={`mt-2 w-full p-2 bg-gray-50 border uppercase border-gray-300 rounded-lg text-center text font-bold text-gray-500 `}
                  onChange={(e) => setEmpresa(e.target.value)}
                >
                  <option value={""} disabled hidden>
                    Seleccionar...
                  </option>
                  {empresasListado.map((empresa) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nom_empresa}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="py-3 relative">
              <TextField
                id="cat"
                className="peer pt-3 pb-2 block w-full"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                label="Categoria"
                variant="outlined"
              />
            </div>

      
            <div className="2xl:flex 2xl:gap-2">
              <input
                type="submit"
                value={tipoEdit.id ? "Actualizar" : "Registrar"}
                className="bg-cyan-600 w-full  hover:bg-cyan-900 duration-500 py-3 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer px-10"
              ></input>

              <button
                type="button"
                onClick={limpiarFormulario}
                className={`bg-gray-600  hover:bg-gray-700 duration-500 w-full  py-3 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer px-10 `}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <div className=" rounded-lg lg:mx-auto h-96 md:w-full mx-5 lg:w-6/12 mt-5 lg:mt-0">
          <div className="">
            <input
              name="busqueda"
              id="busqueda"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className=" border border-blue-800 shadow rounded-md p-1  w-full text-blue-500 placeholder-blue-300 mb-2"
              placeholder=" Buscar..."
            />
          </div>
          <div className="overflow-auto  rounded-lg lg:mx-auto h-96 md:w-full mx-5  mt-5 lg:mt-0">
            <table className="overflow-auto  border-collapse border-2 w-full shadow-lg border-gray-300 rounded-lg bg-white text-left text-xs text-gray-500">
              <thead className="bg-gray-300 ">
                <tr>
                  <th scope="col" className="px-6 py-1  font-bold text-gray-900">
                    Categoria
                  </th>

                  <th scope="col" className="px-6 font-bold text-gray-900"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100  border-gray-100">
                {tipos.filter((val) => {
                  if (busqueda == "") {
                    return val;
                  } else if (
                    val.nom_tipo
                      .toLowerCase()
                      .includes(busqueda.toLowerCase())
                  ) {
                    return val;
                  }
                }).map((tipo) => (
                  <tr
                    className="whitespace-nowrap hover:bg-gray-200"
                    key={tipo.id}
                  >
                    <td className="px-6 py-4  text-sm text-gray-500">
                      {tipo.nom_tipo}
                    </td>
                  

                    <td>
                      {auth.id == 2 && <button
                        type="button"
                        onClick={() => setEdicion(tipo)}
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
                      </button>}
                

                     
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </>
  );
};

export default CatNotificacion;
