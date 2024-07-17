import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";

const Perfiles = () => {
  const { auth } = useAuth();

  const [id_empresa, setEmpresa] = useState(auth.id_empresa);

  const [nombre, setNombre] = useState("");
  const [empresasListado, setEmpresasListado] = useState([]);
  const [estado, setEstado] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [id, setID] = useState(null);

  //Lista de Perfiles registrados
  const [Perfiles, setPerfiles] = useState([]);

  //PARA EDICION de un perfilEdit
  const [perfilEdit, setPerfilEdit] = useState({});

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
    listarPerfiles();
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
 
  const listarPerfiles = async () => {
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
        `/adam/perfiles`,
        config
      );
      setPerfiles(data);

    } catch (error) {
      console.log(error);
    }
  };

  const limpiarFormulario = () => {
    setNombre(""); 
    setPerfilEdit({});  
    handleClose()
    listarPerfiles()
  };

  const setEdicion = (perfilEdit) => {
    setPerfilEdit(perfilEdit);
    setNombre(perfilEdit.nom_perfil);   
  };

  const eliminar = async (id) => {
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

      const { data } = await clienteAxios.delete(
        `adam/eliminarPerfil/${id}`,
        config
      );

      msgOk(data.msg);
   
      limpiarFormulario();
      

    } catch (error) {
      console.log(error);
    }
  };


  const registrar = async () => {
    if ([nombre].includes("")) {
      msgError("Ingrese todos los campos");
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

      if (perfilEdit.id) {
        const { data } = await clienteAxios.put(
          `/adam/editarPerfil/${perfilEdit.id}`,
          {
            nom_perfil: nombre,           
            est_activo: estado,
          },
          config
        );

        msgOk(data.msg);
      } else {
        const { data } = await clienteAxios.post(
          "/adam/registrarPerfil",
          {
            nom_perfil: nombre,    
            est_activo: estado,
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
      <h2 className="font-black text-red-900 text-2xl mx-4 ">
        Registrar{" "}
        <span className="font-black text-red-500 mb-10 text-center">
          Perfiles
        </span>
      </h2>

      <div className="grid-cols-2 lg:flex mt-4">
        <div className="shadow-lg  mx-6 lg:mx-auto lg:w-5/12 px-8  py-5 rounded-xl bg-white">
          <form onSubmit={handleSubmit}>
            

            <div className="py-3 relative">
              <TextField
                id="nombre"
                className="peer pt-3 pb-2 block w-full"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                label="Nombre Perfil"
                variant="outlined"
              />
            </div>

            <div className="my-8 relative">
              <label
                htmlFor="perfil"
                className="peer-placeholder-shown:uppercase  absolute left-0 -top-3.5 text-gray-900 text-sm
                        peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all peer-placeholder-shown:top-3"
              >
                ESTADO
              </label>

              <select
                name="perfil"
                value={estado}
                className="mt-2 w-full p-2 bg-gray-50 border  border-gray-300 rounded-lg text-center text font-bold text-gray-500"
                onChange={(e) => setEstado(+e.target.value)}
              >
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </div>

            <div className="2xl:flex 2xl:gap-2">
              <input
                type="submit"
                value={perfilEdit.id ? "Actualizar" : "Registrar"}
                className="bg-red-800 w-full  hover:bg-red-700 duration-500 py-3 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer px-10"
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
              placeholder=" Buscar perfil..."
            />
          </div>
          <div className="overflow-auto  rounded-lg lg:mx-auto h-96 md:w-full mx-5  mt-5 lg:mt-0">
            <table className="overflow-auto  border-collapse border-2 lg:w-full shadow-lg border-gray-300 rounded-lg bg-white text-left text-xs text-gray-500">
              <thead className="bg-gray-300 ">
                <tr>
                  <th scope="col" className="px-6  font-bold text-gray-900">
                    Perfil
                  </th>

                  <th scope="col" className="px-6 py-1 font-bold text-gray-900">
                    Estado
                  </th>
                  <th scope="col" className="px-6 font-bold text-gray-900"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100  border-gray-100">
                {Perfiles.filter((val) => {
                  if (busqueda == "") {
                    return val;
                  } else if (
                    val.nom_perfil
                      .toLowerCase()
                      .includes(busqueda.toLowerCase())
                  ) {
                    return val;
                  }
                }).map((perfilEdit) => (
                  <tr
                    className="whitespace-nowrap hover:bg-gray-200"
                    key={perfilEdit.id}
                  >
                    <td className="px-6 py-4  text-sm text-gray-500">
                      {perfilEdit.nom_perfil}
                    </td>

                    <td className="px-6 py-4  text-sm text-gray-500">
                      {" "}
                      {perfilEdit.est_activo ? (
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
                        onClick={() => setEdicion(perfilEdit)}
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

                      <button
                        className="py-1 "
                        onClick={() => {
                          setID(perfilEdit.id);
                          handleClickOpen();
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
                      </button> 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

       <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="p-0.5 rounded-lg">
            <div className="">
              <div className="modal-body relative p-4">
                <p>¿Realmente desea eliminar este perfil?</p>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-500 active:shadow-lg transition duration-150 ease-in-out"
            onClick={handleClose}
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => eliminar(id)}
            className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
          >
            Eliminar
          </button>
        </DialogActions>
      </Dialog> 
    </>
  );
};

export default Perfiles;
