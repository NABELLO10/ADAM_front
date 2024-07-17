import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import Tooltip from "@mui/material/Tooltip";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Descargar from "../../components/datos/Descargar";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import TablePagination from "@mui/material/TablePagination";

const CorreosNotificaciones = () => {
  const { auth } = useAuth();
  const [id_empresa, setEmpresa] = useState(auth.id_empresa);
  const [empresasGlobales, setEmpresasGlobales] = useState([]);

  const [empresaSistema, setEmpresaSistema] = useState("");
  const [empresasSistema, setEmpresasSistema] = useState([]);

  const [id_notificacion, setNotificacion] = useState("");
  const [transportistas, setTransportistas] = useState([]);
  const [info, setInfo] = useState({});
  const [id_transportista, setTransportista] = useState("");
  const [tipos, setTipos] = useState([]);
  const [est_activo, setEstado] = useState(1);
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  
  const [busqueda, setBusqueda] = useState("");
  const [id, setID] = useState(null);

  //Lista de notificaciones registrados
  const [notificaciones, setNotificaciones] = useState([]);

  // PAGINACION TABLA ////////////////////////////////////////////////////////////////
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredNotificaciones = notificaciones.filter((val) => {
    if (busqueda === "") return true;

    return (
      val.asunto.toLowerCase().includes(busqueda.toLowerCase()) ||
      val.mae_transportista.nombre
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      val.mae_transportista.ape_paterno
        .toLowerCase()
        .includes(busqueda.toLowerCase()) ||
      val.mensaje.toLowerCase().includes(busqueda.toLowerCase()) ||
      val.mae_tipo_notificacion.nom_tipo
        .toLowerCase()
        .includes(busqueda.toLowerCase())
    );
  });

  const paginatedNotificaciones = filteredNotificaciones.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  /////////////////////////////////////////////////////////////////////////////////////

  //PARA EDICION de un edit
  const [edit, setEdit] = useState({});

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    obtenerEmpresasGlobal();
   }, []);

  useEffect(() => {
    if(empresaSistema > 0 && id_transportista > 0){
      obtenerNotificaciones();   
    }
    
   }, [empresaSistema, id_transportista]);

  useEffect(() => { 
    obtenerEmpresasSistema()
  }, [id_empresa]);


 useEffect(() => {   
  if(empresaSistema > 0){
    obtenerTransportistas()  
    
  }    
}, [empresaSistema, id_empresa]);


useEffect(() => {
  if(id_transportista > 0){
    obtenerTiposNot();
  } 
 }, [empresaSistema, id_transportista, id_empresa]);

  function invertirFecha(fecha) {
    return fecha.split("-").reverse().join("-");
  }

  //CORREOS  ////////////////////////////////////////
  const [correos, setCorreos] = useState([]);
  const [nuevoCorreo, setNuevoCorreo] = useState("");

  const handleAddTask = () => {
    if (nuevoCorreo.trim() !== "") {
      setCorreos([...correos, nuevoCorreo]);
      setNuevoCorreo("");
    }
  };

  const handleDeleteTask = (indexToDelete) => {
    setCorreos(correos.filter((_, index) => index !== indexToDelete));
  };
  /////////////////////////////////////////////////////

  const obtenerEmpresasGlobal = async () => {
    const token = localStorage.getItem("token_adam");

    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios("/crud/obtener-empresas", config);
    setEmpresasGlobales(data);
  };


  const obtenerEmpresasSistema = async () =>{
    const token = localStorage.getItem("token_adam")

    if(!token) return

    const config = {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
        }
    }                        
 
    const {data} = await clienteAxios(`/crud/obtener-empresas-sistema/${id_empresa}`, config)           
    setEmpresasSistema(data)
}   

  const obtenerTiposNot = async () => {
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
        `/crud/obtener-tipo-notificacion/${empresaSistema}/${id_transportista}/${id_empresa}`,
        config
      );
   
      setTipos(data);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerTransportistas = async () => {
    const token = localStorage.getItem("token_adam");

    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios(
      `/crud/obtener-transportistas/${empresaSistema}/${id_empresa}`,
      config
    );
    setTransportistas(data);

};

  const obtenerNotificaciones = async () => {
    const token = localStorage.getItem("token_adam");

    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios(
      `/crud/obtener-notificacion/${id_empresa}/${id_transportista}/${empresaSistema}`,
      config
    );      

    setNotificaciones(data);
  };

  const limpiarFormulario = () => {
    setAsunto("");
    setEdit({});
    setID(null);
    setEstado(1);
    setAsunto("");
    setMensaje("");
    setNotificacion("");
    setCorreos([]);
    handleClose();
    obtenerNotificaciones()
   
  };

  const setEdicion = (edit) => {
    setEdit(edit);
    setAsunto(edit.asunto);
    setTransportista(edit.id_transportista);
    setNotificacion(edit.id_notificacion);
    setMensaje(edit.mensaje);
    setEstado(edit.est_activo);
    setAsunto(edit.asunto);
    setID(edit.id);
    setCorreos(JSON.parse(edit.correos));
  };

  const eliminarNotificacion = async (id) => {
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
        `crud/notificacion/${id}`,
        config
      );

      msgOk(data.msg);
      limpiarFormulario();
    } catch (error) {
      console.log(error);
    }
  };

  const registrar = async () => {
    if ([id_notificacion, id_transportista, asunto].includes("")) {
      msgError("Ingrese tipo notificación, transportista y asunto");
      return;
    }

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

    if (edit.id) {
      const { data } = await clienteAxios.put(
        `/crud/notificacion/${edit.id}`,
        {
          id_notificacion,
          id_transportista,
          correos: JSON.stringify(correos),
          asunto,
          mensaje,
          est_activo,
          id_empresa_sistema : empresaSistema
        },
        config
      );
      msgOk(data.msg);
    } else {
      const { data } = await clienteAxios.post(
        "/crud/notificacion",
        {
          id_notificacion,
          id_transportista,
          correos: JSON.stringify(correos),
          asunto,
          mensaje,
          est_activo,
          id_empresa,
          id_empresa_sistema : empresaSistema
        },
        config
      );
      msgOk(data.msg);
    }

    limpiarFormulario();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registrar();
  };

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      <h2 className="font-black text-cyan-900 text-2xl mx-1 ">
        Registrar{" "}
        <span className="font-black text-cyan-500 mb-10 text-center">
          Notificaciones
        </span>
      </h2>

      <div className="grid-cols-2 lg:flex mt-2 lg:gap-4">
        <div className="shadow-lg  mx-6 lg:mx-auto lg:w-4/12 px-3 py-3 rounded bg-white">
          <form className="space-y-4" onSubmit={handleSubmit}>
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
                  {empresasGlobales.map((empresa) => (
                    <option key={empresa.id} value={empresa.id}>
                      {empresa.nom_empresa}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="lg:flex gap-3 space-y-4 lg:space-y-0">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Empresa</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={empresaSistema}
                  label="Empresa"
                  onChange={(e) => setEmpresaSistema(e.target.value)}
                >
                  {empresasSistema.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nom_empresa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="lg:flex gap-3 space-y-4 lg:space-y-0">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Transportista
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={id_transportista}
                  label="Transportista"
                  onChange={(e) => setTransportista(e.target.value)}
                >
                  {transportistas.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nombre + " " + tipo.ape_paterno}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            <div className="lg:flex gap-3 space-y-4 lg:space-y-0">
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  Tipo Notificación
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={id_notificacion}
                  label="Tipo Notificación"
                  onChange={(e) => setNotificacion(e.target.value)}
                >
                  {tipos.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.cat_notificacione.nom_tipo}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                id="est_activo"
                control={<Checkbox checked={est_activo === 1} />}
                onChange={(e) => setEstado(e.target.checked ? 1 : 0)}
                label="Activo"
              />
            </div>

            {/* <div className="lg:flex lg:gap-3 lg:space-y-0">
              <TextField
                id="asunto"
                className="peer pt-3 pb-2 w-full"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                label="Asunto"
                variant="outlined"
              />
            </div>

            <div className="lg:flex lg:gap-3 lg:space-y-0">
              <TextField
                id="mensaje"
                className="peer pt-3 pb-2 block w-full"
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                label="Mensaje"
                variant="outlined"
                multiline
                rows={4}
              />
            </div>
 */}
            <div className="lg:space-y-0">
              <div className=" ">
                <TextField
                  fullWidth
                  label="Nuevo Correo..."
                  variant="outlined"
                  value={nuevoCorreo}
                  type="email"
                  onChange={(e) => setNuevoCorreo(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                />

                <button
                  onClick={handleAddTask}
                  type="button"
                  className="bg-cyan-800 w-full  hover:bg-cyan-950 duration-500  text-white uppercase font-bold  hover:cursor-pointer px-10"
                >
                  Agregar correo
                </button>

                <ul className="mt-6 border overflow-auto h-48 text-sm border-cyan-900">
                  {correos.length > 0 ? (
                    correos.map((correo, idx) => (
                      <li
                        key={idx}
                        className="p-1 bg-gray-100 border border-gray-300 rounded flex justify-between items-center"
                      >
                        <span>{correo}</span>
                        <button
                          type="button"
                          className="ml-2 bg-red-500 text-white hover:bg-red-800 rounded px-1 py-1"
                          onClick={() => handleDeleteTask(idx)}
                        >
                          <DeleteTwoToneIcon />
                        </button>
                      </li>
                    ))
                  ) : (
                    <h2 className="text-center mt-4 text-red-800 font-semibold">
                      Sin correos
                    </h2>
                  )}
                </ul>
              </div>
            </div>

            <div className="lg:flex lg:gap-2">
              <input
                type="submit"
                value={edit.id ? "Actualizar" : "Registrar"}
                className="bg-cyan-600 w-full  hover:bg-cyan-900 duration-500 py-3 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer "
              ></input>

              <button
                type="button"
                onClick={limpiarFormulario}
                className={`bg-gray-600  hover:bg-gray-700 duration-500 w-full  py-3 rounded-md text-white uppercase font-bold mt-2 hover:cursor-pointer `}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>

        <div className=" rounded-lg lg:mx-auto max-h-36 md:w-full mx-5 lg:w-8/12 mt-5 lg:mt-0">
          <div className="lg:flex gap-4 ">
            <input
              name="busqueda"
              id="busqueda"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full lg:w-7/12 border shadow px-1 text-sky-500"
              placeholder=" Buscar notificación..."
            />
            <Descargar data={notificaciones} nombrePdf={"notificaciones"} />
          </div>

          <div className="overflow-auto rounded h-96  md:w-full mt-2">
            {paginatedNotificaciones.length > 0 ? (
              <>
                {" "}
                <table
                  id="table"
                  className=" border-collapse border-2 lg:w-full shadow-lg border-gray-300 rounded-lg bg-white text-left text-xs text-gray-500"
                >
                  <thead className="bg-gray-300 ">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-2 font-bold text-gray-900"
                      >
                        Notificacion
                      </th>

                      <th scope="col" className="px-6 font-bold text-gray-900">
                        Empresa / Transportista
                      </th>
                      <th scope="col" className="px-6 font-bold text-gray-900">
                        Correos
                      </th>
                      <th
                        scope="col"
                        className="px-6 font-medium text-gray-900"
                      ></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100  border-gray-100">
                    {paginatedNotificaciones.map((r) => (
                      <tr
                        className="whitespace-nowrap hover:bg-gray-200"
                        key={r.id}
                      >
                        <td className="px-6   py-1 text-sm text-gray-500">
                          <p className="font-bold">
                            {r.mae_tipo_notificacion.cat_notificacione.nom_tipo}
                          </p>

                          {r.est_activo ? (
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
                        <td className="px-6 text-sm text-gray-500">
                          <p className="text-cyan-600 font-bold">
                            {r.mae_empresas_sistema.nom_empresa}
                          </p>{" "}
                          <p>
                            {r.mae_transportista.nombre +
                              " " +
                              r.mae_transportista.ape_paterno}
                          </p>
                        </td>

                        <td className="px-6 text-xs font-bold text-gray-500">
                          {r.correos && (
                            <div className="grid grid-cols-2">
                              {JSON.parse(r.correos).map((correo, idx) => (
                                <p key={idx}>{correo}</p>
                              ))}
                            </div>
                          )}
                        </td>

                        <td>
                          <button
                            type="button"
                            onClick={() => setEdicion(r)}
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
                              setID(edit.id);
                              setInfo(r);
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
                <div className="bg-gray-300"></div>
              </>
            ) : (
              <div className="h1 text-center mt-20 font-bold text-blue-900">
                NO HAY DATOS
              </div>
            )}
          </div>
          <TablePagination
            component="div"
            count={notificaciones.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            labelRowsPerPage="Registros por página:"
            className="bg-gray-300 w-full"
            labelDisplayedRows={({ from, to, count }) =>
              `${from}-${to} de ${count}`
            }
          />
        </div>
      </div>

      <Dialog
        fullWidth={true}
        maxWidth={"sm"}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className="p-0.5 rounded-lg">
            <div className="">
              <div className="modal-body relative p-4">
                <p>¿Realmente desea esta notificacion?</p>
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
            onClick={() => eliminarNotificacion(info.id)}
            className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
          >
            Eliminar
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default CorreosNotificaciones;
