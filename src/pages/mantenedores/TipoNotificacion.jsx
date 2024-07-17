import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from '@mui/material/MenuItem';


const TipoNotificacion = () => {
  const { auth } = useAuth();
  const [id_empresa, setEmpresa] = useState(auth.id_empresa);
  const [empresasGlobales, setEmpresasGlobales] = useState([]);

  const [empresaSistema, setEmpresaSistema] = useState("");
  const [empresasSistema, setEmpresasSistema] = useState([]);

  
  const [nombre, setNombre] = useState("");
  const [val_min, setValMin] = useState("");
  const [val_max, setValMax] = useState("");
  const [obs, setObs] = useState("");
  const [est_activo, setEstado] = useState(1);
  const [transportistas, setTransportistas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoria, setCategoria] = useState("");  
  const [transportista, setTransportista] = useState("");
  const [info, setInfo] = useState({});

  //BUSQUEDA EN GRILLA
  const [busqueda, setBusqueda] = useState("");
  //LISTAR
  const [tiposNotificaciones, setTiposNotificacion] = useState([]);
  //PARA EDICION
  const [id, setID] = useState(null);
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
    obtenerEmpresasGlobal();
    obtenerCatNot()
   }, []);

  useEffect(() => { 
    obtenerEmpresasSistema()
  }, [id_empresa]);


 useEffect(() => {   
  if(empresaSistema > 0){
    obtenerTransportistas()  
  }    
}, [empresaSistema, id_empresa]);


useEffect(() => {
  if(transportista > 0){
    obtenerTiposNotificaciones();
  } 
 }, [empresaSistema, transportista, id_empresa]);


  const obtenerEmpresasGlobal = async () => {
    try {
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
    } catch (error) {
      console.log(error);
    }
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

const obtenerCatNot = async () => {
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
    setCategorias(data);

  } catch (error) {
    console.log(error);
  }
};

  const obtenerTiposNotificaciones = async () => {
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
        `/crud/obtener-tipo-notificacion/${empresaSistema}/${transportista}/${id_empresa}`,
        config
      );     


      setTiposNotificacion(data);
    } catch (error) {
      console.log(error);
    }
  };



  const limpiarFormulario = () => {
    setCategoria("");
    setValMin("");
    setValMax("");
    setObs("");
    setTipoEdit({});
    obtenerTiposNotificaciones()
    handleClose(); 
  };

  const setEdicion = (tipo) => {
    setTipoEdit(tipo);
    setEstado(tipo.est_activo);
    setCategoria(tipo.id_cat_not);
    setValMin(tipo.val_min);
    setValMax(tipo.val_max);
    setObs(tipo.obs);
  };

  const registrar = async () => {
    if ([categoria, val_min, val_max].includes("")) {
      msgError("Ingrese categoria y valores");
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
          `/crud/tipo-notificacion/${tipoEdit.id}`,
          {
            id_cat_not: categoria,
            est_activo,
            val_min, val_max, obs,          
            id_empresa_sistema : empresaSistema, 
            id_transportista : transportista
          },
          config
        );

        msgOk(data.msg);
      } else {
        const { data } = await clienteAxios.post(
          "/crud/tipo-notificacion",
          {
            id_cat_not: categoria,
            est_activo,
            val_min, val_max, obs,
            id_empresa,
            id_empresa_sistema : empresaSistema, 
            id_transportista : transportista
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

  const eliminarTipo = async (id) => {
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
        `crud/tipo-notificacion/${id}`,
        config
      );

      msgOk(data.msg);
      limpiarFormulario();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registrar();
  };

  return (
    <>
      <h2 className="font-black text-cyan-900 text-2xl mx-4 ">
        Ajustes{" "}
        <span className="font-black text-cyan-500 mb-10 text-center">
          Sensores
        </span>
      </h2>

      <div className="grid-cols-2 lg:flex mt-4">
        <div className="shadow-lg   mx-6 lg:mx-auto lg:w-5/12 px-8  py-5 rounded-xl bg-white">
          <form className="space-y-3" onSubmit={handleSubmit}>
            {auth.id == 2 && (
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
                  value={transportista}
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

            <div className="md:flex gap-2 relative">
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                Categoria
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={categoria}
                  label="Categoria"
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  {categorias.map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {tipo.nom_tipo}
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

            <div className="md:flex gap-2 relative">
              <TextField
                id="valor"
                className="peer pt-3 pb-2 w-full"
                value={val_min}
                onChange={(e) => setValMin(e.target.value)}
                label="Valor min"
                variant="outlined"
              />

              <TextField
                id="valor"
                className="peer pt-3 pb-2 w-full"
                value={val_max}
                onChange={(e) => setValMax(e.target.value)}
                label="Valor max"
                variant="outlined"
              />
            </div>

            <div className="md:flex gap-2 relative">
              <TextField
                id="obs"
                className="peer pt-3 pb-2 block w-full"
                value={obs}
                onChange={(e) => setObs(e.target.value)}
                label="Observación"
                variant="outlined"
                multiline
                rows={3}
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
                  <th
                    scope="col"
                    className="px-6 py-1  font-bold text-gray-900"
                  >
                    Tipo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-1  font-bold text-gray-900"
                  >
                    Valor Min
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-1  font-bold text-gray-900"
                  >
                    Valor Max
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-1  font-bold text-gray-900"
                  >
                    Obs
                  </th>

                  <th scope="col" className="px-6 font-bold text-gray-900"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100  border-gray-100">
                {tiposNotificaciones
                  .filter((val) => {
                    if (busqueda == "") {
                      return val;
                    } else if (
                      val.nom_tipo
                        .toLowerCase()
                        .includes(busqueda.toLowerCase())
                    ) {
                      return val;
                    }
                  })
                  .map((tipo) => (
                    <tr
                      className="whitespace-nowrap hover:bg-gray-200"
                      key={tipo.id}
                    >
                      <td className="px-3 py-2   text-sm text-gray-500">
                        <div>{tipo.cat_notificacione.nom_tipo}</div>
                        <div>
                          {tipo.est_activo ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-green-50   text-xs font-semibold text-green-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-green-600"></span>
                              Activo
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-50 text-xs font-semibold text-red-600">
                              <span className="h-1.5 w-1.5 rounded-full bg-red-600"></span>
                              Inactivo
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4  text-sm text-gray-500">
                        {tipo.val_min}
                      </td>
                      <td className="px-6 py-4  text-sm text-gray-500">
                        {tipo.val_max}
                      </td>
                      <td className="px-6 py-4  text-sm text-gray-500">
                        {tipo.obs}
                      </td>

                      <td>
                        <button
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
                        </button>

                        <button
                          className="py-1 "
                          onClick={() => {
                            setID(tipo.id);                    
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
                  <p>¿Realmente desea el Tipo: {info.nom_tipo}?</p>
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
              onClick={() => eliminarTipo(id)}
              className="inline-block px-6 py-2.5 bg-red-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-red-700 hover:shadow-lg focus:bg-red-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-red-800 active:shadow-lg transition duration-150 ease-in-out ml-1"
            >
              Eliminar
            </button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default TipoNotificacion;
