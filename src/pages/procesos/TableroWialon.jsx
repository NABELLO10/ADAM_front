import React, { useState, useEffect } from "react";

import clienteAxios from "../../config/axios";
import clipboardCopy from "clipboard-copy";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";
import Tooltip from "@mui/material/Tooltip";
import { msgError, msgInfo, msgOk, msgWarning } from "../../components/Alertas";
import { format } from "date-fns";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  IconButton,
  Input,
  Icon,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";
import MapaTableroWialon from "../../components/MapaTableroWialon";
import Mapa from "../../components/Mapa";
import TravelExploreTwoToneIcon from "@mui/icons-material/TravelExploreTwoTone";
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import useAuth from "../../hooks/useAuth";


const TableroWialon = () => {
  const { auth } = useAuth();
  const [id_empresa, setEmpresa] = useState(auth.id_empresa);
  const [empresasGlobales, setEmpresasGlobales] = useState([]);
  const [empresaSistema, setEmpresaSistema] = useState("");
  const [empresasSistema, setEmpresasSistema] = useState([]);
  const [id_transportista, setTransportista] = useState("");
  const [transportistas, setTransportistas] = useState([]);

  const [tokenExiste, setTokenExiste] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [tokenBD, setTokenBD] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [notActivas, setNotActivas] = useState([]);
  const [notActiva, setNotActiva] = useState({});
  const [tControl, setTcontrol] = useState([]);
  const [inicioToken, setInicioToken] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [info, setInfo] = useState("");
  const [oxs, setOX] = useState([]);
  const [token1, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);
  const [verMapa, setVerMapa] = useState(false);
  const [verMapa2, setVerMapa2] = useState(false);
  const [tipoMapa, setTipoMapa] = useState("");
  const theme = useTheme();

  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  
  useEffect(() => {
    obtenerEmpresasGlobal();
    asignarToken();
    obtenerEmpresasSistema();
    DatosOxPy()
  }, []);

  useEffect(() => {
    obtenerEmpresasSistema();
  }, [id_empresa]);

  useEffect(() => {
    if (empresaSistema > 0) {
      obtenerTransportistas();
    }
  }, [empresaSistema, id_empresa]);

  const obtenerTokenWialon = async () => {
    try {
      const token = localStorage.getItem("token_adam");

      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios("/general/token-wialon", config);

      return data;
    } catch (error) {
      console.log(error);
    }
  };

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

  const asignarToken = async () => {
    const tokenWialon = await obtenerTokenWialon();
    setTokenBD(tokenWialon.token);
    setInicioToken(tokenWialon.fec_add);
  };

  const copyToClipboard = () => {
    const tokenElement = document.getElementById("token");
    if (tokenElement) {
      // actualizarToken();

      const tokenText = tokenElement.innerText;
      clipboardCopy(tokenText)
        .then(() => {
          msgInfo("Token copiado al portapapeles");
        })
        .catch((error) => {
          console.error("Error al copiar al portapapeles:", error);
        });
    }
  };

  
  const obtenerValoresOX = async (sensor) => {
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
        `/crud/not-activas/${id_empresa}/${sensor}`,
        config
      );              

      setNotActiva(data.find(na => na.id_cat_not === sensor));     

    } catch (error) {
      console.log(error);
    }
  };


  const actualizarToken = async (u, t) => {
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

      const { data } = await clienteAxios.put(
        `/general/token-wialon`,
        {
          usuario: u,
          token: t,
        },
        config
      );

      asignarToken();
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };

  const DatosOxPy = async () => {
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
      const { data } = await clienteAxios.get(`/general/datos-ox`, config);

      setIsLoading2(false);
      setOX(data);

      obtenerValoresOX(1) // Oxigenacion, envir otro id para otro sensor

    } catch (error) {
      msgError(error.response.data.msg);
    }
  };


  const Tcontrol = async () => {
    setIsLoading3(true);
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
      const { data } = await clienteAxios.get(`/general/tControl`, config);

      setTcontrol(data);
      setIsLoading3(false);
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };

  // Wialon site dns
  var dns = "https://hosting.wialon.com";

  // Main function
  function getToken() {
    // construct login page URL
    var url = dns + "/login.html"; // your site DNS + "/login.html"
    url += "?client_id=" + "App"; // your application name
    url += "&access_type=" + 0x100; // access level, 0x100 = "Online tracking only"
    url += "&activation_time=" + 0; // activation time, 0 = immediately; you can pass any UNIX time value
    url += "&duration=" + 604800; // duration, 604800 = one week in seconds
    url += "&flags=" + 0x1; // options, 0x1 = add username in response

    url += "&redirect_uri=" + dns + "/post_token.html"; // if login succeed - redirect to this page

    // listen message with token from login page window
    window.addEventListener("message", tokenRecieved);

    // finally, open login page in new window
    window.open(url, "_blank", "width=760, height=500, top=300, left=500");
  }

  // Help function
  function tokenRecieved(e) {
    var msg = e.data;
    if (typeof msg == "string" && msg.indexOf("access_token=") >= 0) {
      var token = msg.replace("access_token=", "");
      setToken(token);
      setTokenBD(token);

      wialon.core.Session.getInstance().initSession(
        "https://hst-api.wialon.com"
      );

      wialon.core.Session.getInstance().loginToken(token, "", function (code) {
        if (code) return;
        var user = wialon.core.Session.getInstance().getCurrUser().getName();
        setUsuario(user);
        // asignarToken()
        actualizarToken(user, token);
      });

      setTokenExiste(true);
    }
  }

  const StickyTableCell = styled(TableCell)(({ theme }) => ({
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "#1b3242",
    color: "white", // para asegurarte de que el fondo no sea transparente
  }));

  const limpiarFormulario = () =>{
    setEmpresaSistema("")
    setTransportista("")
  }

  return (
    <>
      <div className="lg:flex  gap-2 mb-1">
        <div className=" lg:w-2/12">
        <h2 className="font-black  text-cyan-900 text-2xl ">
          Historico{" "}
          <span className="font-black text-cyan-500 mb-10 text-center">
            GPS
          </span>
        </h2>
        </div>
      
        {/* 
        <div className="flex items-center font-semibold text-sm gap-4">
          <button
            id="login"
            className="bg-cyan-600 hover:bg-cyan-800 transition cursor-pointer rounded  p-1 text-white font-bold  "
            value="Nuevo Token"
            onClick={getToken}
          >
            Nuevo Token
          </button>
          Token Actual: {tokenBD ? tokenBD : token1} / {inicioToken}
        </div> */}

     <div className="flex w-full justify-end gap-2">
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

          <div className="w-2/12">
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

          <div className="w-2/12">
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

          <div className="w-1/12">
            <button
              id="todos"
              className="bg-cyan-600 hover:bg-cyan-800 transition cursor-pointer rounded  p-4 text-white font-bold  "
              value="todos"
              onClick={limpiarFormulario}
            >
              Todos
            </button>
          </div>
        </div>

        <div className=" lg:flex lg:justify-between gap-10">
     {/*    <div className="lg:w-7/12">
          <button
            id="login"
            className={`bg-cyan-900 lg:mb-5 hover:bg-cyan-700 transition cursor-pointer w-full p-1 text-white 
            ${isLoading2 ? "opacity-50 cursor-not-allowed" : ""}`}
            value="Oxigenacion"
            onClick={DatosOxPy}
            disabled={isLoading2}
          >
            Oxigenación
          </button>
        </div> */}
        {/*  <div className="w-5/12">
          <button
            id="login"
            className={`bg-cyan-900 lg:mb-5 hover:bg-cyan-700 transition cursor-pointer w-full p-1 text-white 
            ${isLoading3 ? "opacity-50 cursor-not-allowed" : ""}`}
            value="Listar Unidades"
            onClick={Tcontrol}
            disabled={isLoading3}
          >
            Control token
          </button>
        </div> */}
      </div>

      </div>

      

      <div className="">
        <div className="w-12/12">
          <div className=" text-white  rounded-lg  w-full mx-auto ">
            {isLoading2 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : oxs.length > 0 ? (
              <TableContainer
                className="bg-white"
                style={{ maxHeight: 680, overflowY: "auto" }}
              >
                <Table className="min-w-full">
                  <TableHead>
                    <TableRow>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        Patente
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        E1
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        E2
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        E3
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        E4
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        E5
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        E6
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        E7
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        E8
                      </StickyTableCell>

                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        E9
                      </StickyTableCell>

                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        T°
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        Mapa
                      </StickyTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {oxs.map((t) => (
                      <TableRow
                        key={t.id}
                        className="hover:bg-blue-100  ease-in-out"
                      >
                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold">{t.patente}</span>
                            <span className="text-xs">
                              {"GPS: " + t.fechaGPS}
                            </span>
                            <span className="text-xs">
                              {"Fecha: " + t.fecha + " " + t.time}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`${
                                t.ox1 >= parseInt(notActiva.val_min) &&
                                t.ox1 <= parseInt(notActiva.val_max)
                                  ? "text-blue-600"
                                  : "text-red-600 font-bold"
                              }`}
                            >
                              {t.ox1}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`${
                                t.ox2 >= parseInt(notActiva.val_min) &&
                                t.ox2 <= parseInt(notActiva.val_max)
                                  ? "text-blue-600"
                                  : "text-red-600 font-bold"
                              }`}
                            >
                              {t.ox2}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`${
                                t.ox3 >= parseInt(notActiva.val_min) &&
                                t.ox3 <= parseInt(notActiva.val_max)
                                  ? "text-blue-600"
                                  : "text-red-600 font-bold"
                              }`}
                            >
                              {t.ox3}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`${
                                t.ox4 >= parseInt(notActiva.val_min) &&
                                t.ox4 <= parseInt(notActiva.val_max)
                                  ? "text-blue-600"
                                  : "text-red-600 font-bold"
                              }`}
                            >
                              {t.ox4}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`${
                                t.ox5 >= parseInt(notActiva.val_min) &&
                                t.ox5 <= parseInt(notActiva.val_max)
                                  ? "text-blue-600"
                                  : "text-red-600 font-bold"
                              }`}
                            >
                              {t.ox5}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`${
                                t.ox6 >= parseInt(notActiva.val_min) &&
                                t.ox6 <= parseInt(notActiva.val_max)
                                  ? "text-blue-600"
                                  : "text-red-600 font-bold"
                              }`}
                            >
                              {t.ox6}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`${
                                t.ox7 >= parseInt(notActiva.val_min) &&
                                t.ox7 <= parseInt(notActiva.val_max)
                                  ? "text-blue-600"
                                  : "text-red-600 font-bold"
                              }`}
                            >
                              {t.ox7}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`${
                                t.ox8 >= parseInt(notActiva.val_min) &&
                                t.ox8 <= parseInt(notActiva.val_max)
                                  ? "text-blue-600"
                                  : "text-red-600 font-bold"
                              }`}
                            >
                              {t.ox8}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span
                              className={`${
                                t.ox9 >= parseInt(notActiva.val_min) &&
                                t.ox9 <= parseInt(notActiva.val_max)
                                  ? "text-blue-600"
                                  : "text-red-600 font-bold"
                              }`}
                            >
                              {t.ox9}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span className="">{t.temp}</span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <Tooltip title="Ver / Ocultar">
                            <IconButton
                              onClick={() => {
                                setLat(t.latitud);
                                setLon(t.longitud);
                                setInfo(t.fechaGPS);
                                handleClickOpen();
                              }}
                            >
                              <TravelExploreTwoToneIcon className="text-green-700" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <h1 className=" text-center mt-5 text-cyan-700 font-bold">
                Sin registros
              </h1>
            )}
          </div>
        </div>
        {/* 
        <div className="w-5/12">
          <div className=" text-white  rounded-lg  w-full mx-auto ">
            {isLoading3 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <CircularProgress />
              </Box>
            ) : tControl.length > 0 ? (
              <TableContainer
                className="bg-white"
                style={{ maxHeight: 680, overflowY: "auto" }}
              >
                <Table className="min-w-full">
                  <TableHead>
                    <TableRow>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        Patente
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        Velocidad
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        Altitud
                      </StickyTableCell>
                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        Oxigenación
                      </StickyTableCell>

                      <StickyTableCell
                        style={{
                          fontWeight: theme.typography.fontWeightBold,
                        }}
                      >
                        Mapa
                      </StickyTableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {tControl.map((t) => (
                      <TableRow
                        key={t.Patente}
                        className="hover:bg-blue-100  ease-in-out"
                      >
                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          {t.Patente}
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span>{t.Velocidad}</span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold">{t.Altitud}</span>
                          </div>
                        </TableCell>
                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <span className="font-bold">{t.Oxigenacion}</span>
                          </div>
                        </TableCell>

                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <Tooltip title="Ver / Ocultar">
                            <IconButton
                              onClick={() => {
                                setLat(t.Latitud);
                                setLon(t.Longitud);
                                setInfo(t.FechaGPS);
                                handleClickOpen();
                              }}
                            >
                              <TravelExploreTwoToneIcon className="text-green-700" />
                            </IconButton>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <h1 className=" text-center mt-5 text-cyan-700 font-bold">
                Sin registros
              </h1>
            )}
          </div>
        </div> */}
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
          <div className=" rounded-lg">
            <div className="">
              <div className="modal-body relative ">
                <MapaTableroWialon lat={lat} lon={lon} info={info} />
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
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TableroWialon;
