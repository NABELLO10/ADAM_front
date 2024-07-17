import React, { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import { msgError} from "../../components/Alertas";
import Home from "../Home";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import useAuth from "../../hooks/useAuth";
import useAdicionales from "../../hooks/useAdicionales";
import PhonelinkRingTwoToneIcon from '@mui/icons-material/PhonelinkRingTwoTone';
import ModeOfTravelTwoToneIcon from '@mui/icons-material/ModeOfTravelTwoTone';

const TableroTablet = () => {
  const { auth } = useAuth();
  const { empresaSistema, setEmpresaSistema, id_transportista, setTransportista } = useAdicionales();

  const [id_empresa, setEmpresa] = useState(auth.id_empresa);
  const [empresasGlobales, setEmpresasGlobales] = useState([]);

  const [empresasSistema, setEmpresasSistema] = useState([]);
 
  const [transportistas, setTransportistas] = useState([]);
  const [camionesSistema, setCamionesSistema] = useState([]);
  const [oxs, setOX] = useState([]);
  const [isLoading2, setIsLoading2] = useState(false);
  const [verFormulario, setVerFormulario] = useState(true);

  useEffect(() => {
    obtenerEmpresasGlobal();
    obtenerEmpresasSistema();
    obtenerDatosTablet();
  }, []);

  // Ejecutar la función cada 10 s
   useEffect(() => {
    const interval = setInterval(() => {
      obtenerDatosTablet();
    }, 60000);

    return () => clearInterval(interval);
  }, []);
 
  useEffect(() => {
    obtenerEmpresasSistema();
  }, [id_empresa]);

  useEffect(() => {
    if (empresaSistema > 0) {
      obtenerTransportistas();
    }
  }, [empresaSistema, id_empresa]);


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


  const obtenerEmpresasSistema = async () => {
    const token = localStorage.getItem("token_adam");

    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios(
      `/crud/obtener-empresas-sistema/${id_empresa}`,
      config
    );
    setEmpresasSistema(data);
  };


  useEffect(() => {
    if (empresaSistema > 0 && id_transportista > 0) {
      obtenerUnidadesSistema();
    }
  }, [id_transportista, empresaSistema]);


  const obtenerUnidadesSistema = async () => {
    const token = localStorage.getItem("token_adam");

    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios(
      `/crud/obtener-camiones/${empresaSistema}/${id_empresa}`,
      config
    );

    if (id_transportista > 0) {
      const camionesTransportistas = data.filter(
        (r) => r.id_transportista == id_transportista
      );
   
      setCamionesSistema(camionesTransportistas);
    } else {
    
      setCamionesSistema(data);
    }
  };


  const obtenerDatosTablet = async () => {
    setIsLoading2(true);
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
      const { data } = await clienteAxios.get(`/general/datos-tablet`, config);

      setIsLoading2(false); 
      setOX(data);
    
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };

  const limpiarFormulario = () => {
    setEmpresaSistema("");
    setTransportista("");
    obtenerDatosTablet();
  };

  return (
    <>
      <div className="lg:flex items-center gap-2 mb-2">
        <div className=" lg:w-2/12 flex gap-2">
          <PhonelinkRingTwoToneIcon />
          <h2 className="font-black  text-cyan-900 lg:text-lg ">
            Tablero <span className="font-black text-cyan-500">TABLET</span>
          </h2>
        </div>

        <div className="flex w-full justify-end gap-2 lg:mt-0 mt-2">
          {auth.id == 1 && (
            <div className="lg:w-10/12">
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

          <div className="lg:w-4/12 w-6/12">
            <FormControl fullWidth sx={{ m: 0, minWidth: 120 }} size="small">
              <InputLabel id="demo-simple-select-label">Empresa</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={empresaSistema}
                label="Empresa"
                size="small"
                onChange={(e) => {
                  setEmpresaSistema(e.target.value);
                  setTransportista("");
                }}
              >
                {empresasSistema.map((tipo) => (
                  <MenuItem key={tipo.id} value={tipo.id}>
                    {tipo.nom_empresa}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className="lg:w-4/12 w-6/12">
            <FormControl fullWidth sx={{ m: 0, minWidth: 120 }} size="small">
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
                    {tipo.nombre +
                      " " +
                      tipo.ape_paterno +
                      " " +
                      tipo.ape_materno}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          <div className=" bg-cyan-900 text-white rounded-sm hover:bg-cyan-600 text-sm lg:flex  mb-3 text-center lg:mb-0  items-center px-3">
            <button
              onClick={() => setVerFormulario(!verFormulario)}
              className=""
            >
              {verFormulario ? "Ocultar" : "Mostrar"} Unidades
            </button>
          </div>
        </div>
      </div>
      {id_transportista ? (
        <Home
          ventana={"Tablet"}
          verFormulario={verFormulario}
          empresaSistema={empresaSistema}
          id_transportista={id_transportista}
          camiones={oxs.filter((camionSistema) =>
            camionesSistema.some(
              (dataItem) =>
                dataItem.nom_patente.replace(/[\-\.]/g, "") ===
                camionSistema.PATENTE.replace(/[\-\.]/g, "")
            )
          )}
        />
      ) : (
        <span className="flex mt-20 text-cyan-900 font-bold text-2xl justify-center">
          Seleccione Transportista
        </span>
      )}
    </>
  );
};

export default TableroTablet;
