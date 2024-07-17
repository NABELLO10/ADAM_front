import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Select from 'react-select';

const Usuarios = () => {
  const { auth } = useAuth();  

  const [perfiles, setPerfiles] = useState([]);
  const [empresasListado, setEmpresasListado] = useState([]);
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [id_empresa, setEmpresa] = useState(auth.id_empresa);
  const [perfil, setPerfil] = useState("");
  const [estado, setEstado] = useState(1);
  const [busqueda, setBusqueda] = useState("");
  const [id, setID] = useState(null);
  const [transportistasSeleccionados, setTransportistasSeleccionados] = useState([]);


  //Lista de usuarios registrados
  const [usuarios, setUsuarios] = useState([]);

  //PARA EDICION de un usuario
  const [usuario, setUsuario] = useState({});
  const [transportistas, setTransportistas] = useState([]);

  const opcionesTransportistas = transportistas.map(t => ({
    value: t.id, // Asume que cada transportista tiene un id
    label: t.nombre + " " + t.ape_paterno + " " + t.ape_materno // Asume que cada transportista tiene un nombre
  }));


  useEffect(() => {
    obtenerPerfiles();
    listarUsuarios();
    obtenerTransportistas(); // Asegúrate de llamar a esta función también
  }, [id_empresa]);



  const obtenerTransportistas = async () => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await clienteAxios.get(`/adam/transportista`, config);
      setTransportistas(data);
    } catch (error) {
      console.error('Error obteniendo transportistas:', error);
    }
  };

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    obtenerPerfiles();
    listarUsuarios();
  }, [id_empresa]);


  const obtenerPerfiles = async () => {
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

  const listarUsuarios = async () => {
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
        `/adam/usuarios`,
        config
      );
      setUsuarios(data);
    } catch (error) {
      console.log(error);
    }
  };

  const limpiarFormulario = () => {
    setNombre("");
    setEmail("");
    setPerfil("");
    setUsuario({});
    setID(null);
    setTransportistasSeleccionados([])
  };

  const setEdicion = (usuario) => {
    setUsuario(usuario);
    setNombre(usuario.nom_usuario);
    setEmail(usuario.email);
    setPerfil(usuario.id_perfil);
    setNombre(usuario.nom_usuario);
    setEstado(usuario.est_activo);
    setID(usuario.id);

     // Carga los transportistas asociados
    cargarTransportistasUsuario(usuario.id);
  };

  const cargarTransportistasUsuario = async (usuarioId) => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;
  
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const { data } = await clienteAxios.get(`/general/usuarios_transportistas/${usuarioId}`, config);
      // Asumiendo que la API devuelve un array de transportistas con estructura { id, nombre }
      const transportistasAsociados = data.map(t => ({
        value: t.id,
        label: t.mae_transportista.nombre + " " + t.mae_transportista.ape_paterno + " " + t.mae_transportista.ape_materno
      }));
      setTransportistasSeleccionados(transportistasAsociados);
    } catch (error) {
      console.error('Error cargando transportistas del usuario:', error);
    }
  };

  const eliminarUsuario = async (id) => {
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
        `/adam/usuarios/${id}`,
        config
      );

      msgOk(data.msg);
      listarUsuarios();
      limpiarFormulario();
      handleClose();
    } catch (error) {
      console.log(error);
    }
  };

  const registrar = async () => {
    if ([nombre, email, id_empresa, perfil].includes("")) {
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
   
      if (usuario.id) {
        const { data } = await clienteAxios.put(
          `/adam/usuarios/${usuario.id}`,
          {
            nombre: nombre,         
            email,
            id_perfil: perfil,
            est_activo: estado,
            transportistasSeleccionados
          },
          config
        );

        msgOk(data.msg);
      } else {
        const { data } = await clienteAxios.post(
          "/adam/usuarios",
          {
            nombre,
            email,       
            id_perfil: perfil,
            est_activo: estado,
            transportistasSeleccionados
          },
          config
        );



        msgOk(data.msg);
      }

      listarUsuarios();
      limpiarFormulario();
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    await registrar();
  };

  const handleSelectChange = (selectedOptions) => {
    setTransportistasSeleccionados(selectedOptions || []);
  };

  return (
    <>
      <h2 className="font-black text-red-900 text-2xl mx-4 ">
        Registrar{" "}
        <span className="font-black text-red-500 mb-10 text-center">
          Usuarios
        </span>
      </h2>

      <div className="grid-cols-2 lg:flex mt-4">
        <div className="shadow-lg  mx-6 lg:mx-auto lg:w-5/12 px-8 py-5 rounded-xl bg-white">
          <form onSubmit={handleSubmit}>
            {auth.id == 2 && (
              <div className="">
                <label
                  htmlFor="empresa"
                  className="peer-placeholder-shown:uppercase absolute left-0 -top-3.5 text-gray-900 text-sm
                                peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all peer-placeholder-shown:top-3"
                ></label>

                <select
                  name="empresa"
                  value={id_empresa}
                  className={`mt-2 w-full p-2 bg-gray-50 border uppercase border-gray-300 rounded-lg text-center text font-bold text-gray-500 `}
                  onChange={(e) => setEmpresa(+e.target.value)}
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
                id="nombre"
                className="peer pt-3 pb-2 block w-full"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                label="Nombre"
                variant="outlined"
              />
            </div>

            <div className="py-2 relative">
              <TextField
                id="email"
                className="peer pt-3 pb-2 block w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                variant="outlined"
              />
            </div>

            <div className="my-8 relative">
              <label
                htmlFor="perfil"
                className="peer-placeholder-shown:uppercase absolute left-0 -top-3.5 text-gray-900 text-sm
                            peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 transition-all peer-placeholder-shown:top-3"
              >
                PERFIL
              </label>

              <select
                name="perfil"
                value={perfil}
                className="mt-2 w-full p-2  bg-gray-50 border border-gray-300 rounded-lg text-center text font-bold text-gray-500"
                onChange={(e) => setPerfil(+e.target.value)}
              >
                <option value={""} disabled hidden>
                  Seleccionar...
                </option>
                {perfiles.map((p) => (
                  <option key={p.nom_perfil} value={p.id}>
                    {p.nom_perfil}
                  </option>
                ))}
              </select>
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

            <div className="mb-5">
              <label className="block mb-2  ">
                TRANSPORTISTAS A VISUALIZAR
              </label>
              <Select
                isMulti
                name="transportistas"
                options={opcionesTransportistas}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleSelectChange} // Añade esta línea
                value={transportistasSeleccionados} // Controla el valor actual desde el estado
              />

            </div>

            <div className="2xl:flex 2xl:gap-2">
              <input
                type="submit"
                value={usuario.id ? "Actualizar" : "Registrar"}
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

        <div className=" rounded-lg lg:mx-auto max-h-36 md:w-full mx-5 lg:w-6/12 mt-5 lg:mt-0">
          <div className="">
            <input
              name="busqueda"
              id="busqueda"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className=" border border-blue-800 shadow rounded-md p-1  w-full text-blue-500 placeholder-blue-300 mb-2"
              placeholder=" Buscar usuario..."
            />
          </div>
          <div className="overflow-auto  rounded-lg lg:mx-auto h-96 md:w-full mx-5  mt-5 lg:mt-0">
            <table className=" border-collapse border-2 lg:w-full shadow-lg border-gray-300 rounded-lg bg-white text-left text-xs text-gray-500">
              <thead className="bg-gray-300">
                <tr>
                  <th scope="col" className="px-6 py-4 font-bold text-gray-900">
                    Usuario
                  </th>

                  <th scope="col" className="px-6 py-4 font-bold text-gray-900">
                    Perfil
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-bold text-gray-900"
                  ></th>
                  <th
                    scope="col"
                    className="px-6 py-4 font-medium text-gray-900"
                  ></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100  border-gray-100">
                {usuarios
                  .filter((val) => {
                    if (busqueda == "") {
                      return val;
                    } else if (
                      val.nom_usuario
                        .toLowerCase()
                        .includes(busqueda.toLowerCase())
                    ) {
                      return val;
                    }
                  })
                  .map((usuario) => (
                    <tr
                      className="whitespace-nowrap hover:bg-gray-200"
                      key={usuario.id}
                    >
                      <td className="px-6 font-bold py-4 text-sm text-gray-500">
                        <p>{usuario.nom_usuario}</p>
                        <p>{usuario.email}</p>
                      </td>
                      <td className="px-6 py-4  text-sm text-gray-500">
                        {usuario.ADAM_perfile.nom_perfil}
                      </td>

                      <td className="px-6 py-4  text-sm text-gray-500">
                        {" "}
                        {usuario.est_activo ? (
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
                          onClick={() => setEdicion(usuario)}
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
                            setID(usuario.id);
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
                <p>¿Realmente desea eliminar este Usuario?</p>
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
            onClick={() => eliminarUsuario(id)}
            className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
          >
            Eliminar
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Usuarios;
