import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import { validateRUT } from 'validar-rut'

import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import formateaRut from '../../components/datos/formateaRut'
import Descargar from "../../components/datos/Descargar"
import TablePagination from '@mui/material/TablePagination';


const Conductores = () => {
  const { auth } = useAuth();  
  const [id_empresa, setEmpresa] = useState(auth.id_empresa);
  const [empresasListado, setEmpresasListado] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  

  const [empresaSistema, setEmpresaSistema] = useState("");
  const [nomEmpresaSistema, setNomEmpresaSistema] = useState("");
  const [estado, setEstado] = useState(1);
  const [nombre, setNombre] = useState("");
  const [rut, setRut] = useState("");
  const [ape_paterno, setApePaterno] = useState("");
  const [ape_materno, setApeMaterno] = useState("");
  const [fono, setFono] = useState("");
  const [email, setEmail] = useState(""); 
  
  const [busqueda, setBusqueda] = useState("");
  const [id, setID] = useState(null);

  //Lista de Conductores registrados
  const [conductores, setConductores] = useState([]);


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
     obtenerEmpresasListado()
     obtenerEmpresas()   
  }, []);

  useEffect(() => {      
     obtenerEmpresas()   
  }, [id_empresa]);


  useEffect(() => {   
    if(empresaSistema > 0){
      obtenerConductores()  
    }    
  }, [empresaSistema, id_empresa]);

// PAGINACION TABLA  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
  };
///////////////////////////////////////

  const obtenerEmpresasListado = async () =>{   
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
}   

  const obtenerEmpresas = async () =>{
        const token = localStorage.getItem("token_adam")

        if(!token) return
  
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }                        
     
        const {data} = await clienteAxios(`/crud/obtener-empresas-sistema/${id_empresa}`, config)           
        setEmpresas(data)
}   


  const obtenerConductores = async () => {
      const token = localStorage.getItem("token_adam");

      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios(
        `/crud/obtener-conductores/${empresaSistema}/${id_empresa}`,
        config
      );
      setConductores(data);
  };

  const limpiarFormulario = () => {
    setNombre("");
    setEmail("");
    setNombre("")
    setApePaterno("")
    setApeMaterno("")
    setFono("")
    setEdit({});
    setID(null);
    setEmpresaSistema("")
    setEstado(1)
    setRut("")
    handleClose()
  };

  const setEdicion = (edit) => {
    setEdit(edit);
    setNombre(edit.nombre);
    setEmail(edit.email);
    setEmpresaSistema(edit.id_empresa);
    setRut(edit.rut);
    setApeMaterno(edit.ape_materno);
    setApePaterno(edit.ape_paterno);
    setFono(edit.fono)
    setEstado(edit.est_activo)
    setID(edit.id);
  };

  const eliminarTransportista = async (id) => {
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
        `crud/conductor/${id}`,
        config
      );

      msgOk(data.msg);
      obtenerConductores();
      limpiarFormulario();
 
    } catch (error) {
      console.log(error);
    }
  };

  const registrar = async () => {
    if ([empresaSistema, rut, nombre, ape_paterno].includes("")) {
      msgError("Ingrese Rut, Nombre y Apellido Paterno");
      return;
    }

    if(!validateRUT(rut)){
      msgError("Rut Incorrecto")
      return
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

      if (edit.id) {
        const { data } = await clienteAxios.put(
          `/crud/conductor/${edit.id}`,
          {
            rut, 
            nombre, 
            ape_paterno, 
            ape_materno, 
            fono, 
            email, 
            est_activo : estado, 
            id_empresa
          },
          config
        );

        msgOk(data.msg);
      } else {
        const { data } = await clienteAxios.post(
          "/crud/conductor",
          {
            rut, 
            nombre, 
            ape_paterno, 
            ape_materno, 
            fono, 
            email, 
            est_activo : estado, 
            id_empresa : empresaSistema,
            id_empresa_global : id_empresa
          },
          config
        );

        msgOk(data.msg);
      }

      obtenerConductores();
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
        Registrar{" "}
        <span className="font-black text-cyan-500 mb-10 text-center">
          Conductores
        </span>
      </h2>

      <div className="grid-cols-2 lg:flex lg:gap-4 mt-4">
        <div className="shadow-lg  mx-6 lg:mx-auto lg:w-4/12 px-8 py-5 rounded-xl bg-white">
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
                  {empresasListado.map((empresa) => (
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
                  {empresas.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nom_empresa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControlLabel
                id="est_activo"
                control={<Checkbox checked={estado === 1} />}
                onChange={(e) => setEstado(e.target.checked ? 1 : 0)}
                label="Activo"
              />
            </div>

            <div className="lg:flex gap-3 space-y-4 lg:space-y-0">
              <TextField
                id="rut"
                className="peer pt-3 pb-2 block w-full"
                value={rut}
                onChange={(e) => setRut(formateaRut(e.target.value))}
                label="RUT"
                variant="outlined"
                inputProps={{ maxLength: 10 }}
              />

              <TextField
                id="nombre"
                className="peer pt-3 pb-2 block w-full"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                label="Nombres"
                variant="outlined"
              />
            </div>

            <div className="lg:flex gap-3 space-y-4 lg:space-y-0">
              <TextField
                id="ape_paterno"
                className="peer pt-3 pb-2 block w-full"
                value={ape_paterno}
                onChange={(e) => setApePaterno(e.target.value)}
                label="Apelido Paterno"
                variant="outlined"
              />
              <TextField
                id="ape_materno"
                className="peer pt-3 pb-2 block w-full"
                value={ape_materno}
                onChange={(e) => setApeMaterno(e.target.value)}
                label="Apellido Materno"
                variant="outlined"
              />
            </div>

            <div className="lg:flex gap-3 space-y-4 lg:space-y-0">
              <TextField
                id="email"
                className="peer pt-3 pb-2 block w-full"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                label="Email"
                variant="outlined"
              />

              <TextField
                id="email"
                className="peer pt-3 pb-2 block w-full"
                value={fono}
                onChange={(e) => setFono(e.target.value)}
                label="Fono"
                variant="outlined"
              />
            </div>

            <div className="2xl:flex 2xl:gap-2">
              <input
                type="submit"
                value={edit.id ? "Actualizar" : "Registrar"}
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

        <div className=" rounded-lg lg:mx-auto max-h-36 md:w-full mx-5 lg:w-8/12 mt-5 lg:mt-0">
          <div className="lg:flex gap-4 ">
            <input
              name="busqueda"
              id="busqueda"
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full lg:w-7/12 border shadow px-1 text-sky-500"
              placeholder=" Buscar Conductor..."
            />

            <Descargar data={conductores} nombrePdf={"Conductores"} />
          </div>

          <div className="overflow-auto  rounded-lg  h-96 md:w-full mt-2">
            {conductores.length > 0 ? (

              <>
               <table
                id="table"
                className=" border-collapse border-2 lg:w-full shadow-lg border-gray-300 rounded-lg  bg-white text-left text-xs text-gray-500"
              >
                <thead className="bg-gray-300">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-2 font-bold text-gray-900"
                    >
                      Conductor
                    </th>

                    <th scope="col" className="px-6 font-bold text-gray-900">
                      Datos de Contacto
                    </th>
                    <th
                      scope="col"
                      className="px-6 font-bold text-gray-900"
                    ></th>
                    <th
                      scope="col"
                      className="px-6 font-medium text-gray-900"
                    ></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100  border-gray-100">
                  {conductores
                    .filter((val) => {
                      if (busqueda == "") {
                        return val;
                      } else if (
                        val.nombre
                          .toLowerCase()
                          .includes(busqueda.toLowerCase()) +
                        val.ape_paterno
                          .toLowerCase()
                          .includes(busqueda.toLowerCase()) +
                        val.rut.toLowerCase().includes(busqueda.toLowerCase()) +
                        val.ape_materno
                          .toLowerCase()
                          .includes(busqueda.toLowerCase())
                      ) {
                        return val;
                      }
                    })
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((r) => (
                      <tr
                        className="whitespace-nowrap hover:bg-gray-200"
                        key={r.id}
                      >
                        <td className="px-6  font-bold py-3 text-sm text-gray-500">
                          <p>
                            {r.nombre +
                              " " +
                              r.ape_paterno +
                              " " +
                              r.ape_materno}
                          </p>
                          <p>{r.rut}</p>
                        </td>
                        <td className="px-6   text-sm text-gray-500">
                          <p>{r.fono}</p>
                          <p>{r.email}</p>
                        </td>

                        <td className="px-6  text-sm text-gray-500">
                          {" "}
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
                              setEdicion(r);
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

              <div className="bg-gray-300 shadow">
                <TablePagination
                  component="div"
                  count={conductores.length}
                  page={page}
                  onPageChange={handleChangePage}
                  rowsPerPage={rowsPerPage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  labelRowsPerPage="Registros por página:"
                  labelDisplayedRows={({ from, to, count }) =>
                    `${from}-${to} de ${count}`
                  }
                />
                </div>
              
              </>
             
            ) : (
              <div className="h1 text-center mt-20 font-bold text-cyan-800">
                {" "}
                {empresaSistema == ""
                  ? "SELECCIONE EMPRESA"
                  : "NO HAY DATOS"}{" "}
              </div>
            )}
          </div>
         
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
                <p>
                  ¿Realmente desea eliminar al transportista:{" "}
                  {edit.nombre + " " + edit.ape_paterno}?
                </p>
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
            onClick={() => eliminarTransportista(id)}
            className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
          >
            Eliminar
          </button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Conductores;
