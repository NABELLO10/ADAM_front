import React, { useState, useEffect } from "react";

import clienteAxios from "../config/axios";
import clipboardCopy from "clipboard-copy";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";
import Tooltip from "@mui/material/Tooltip";
import { msgError, msgInfo, msgOk, msgWarning } from "../components/Alertas";
import { format } from 'date-fns'
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Mapa from "../components/Mapa";

const WialonToken = () => {
  const [tokenExiste, setTokenExiste] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [tokenBD, setTokenBD] = useState("");
  const [unidades, setUnidades] = useState([]);
  const [tControl, setTcontrol] = useState([]);
  const [inicioToken, setInicioToken] = useState("");
  const [oxs, setOX] = useState([]);
  const [token1, setToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const [isLoading3, setIsLoading3] = useState(false);


  const obtenerTokenWialon = async () =>{
    try {
        const token = localStorage.getItem("token_adam")

        if(!token) return
  
        const config = {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            }
        }                        
     
        const {data} = await clienteAxios('/general/token-wialon', config)        
        
        return(data)     

    } catch (error) {
        console.log(error)
    }
}   

useEffect(()=> {
asignarToken()
},[])



const asignarToken = async () => {
  const tokenWialon = await obtenerTokenWialon();
  setTokenBD(tokenWialon.token);
  setInicioToken(tokenWialon.fec_add);
}


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
          usuario : u,
          token: t,
        },
        config
      );

      asignarToken()
      
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };

  const ListarUnidadesPY = async () => {
    setIsLoading(true);
  
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
      
      const { data } = await clienteAxios.get(
        `/general/listarUnidadesPY`,
        config
      );
  
      setIsLoading(false);

      setUnidades(data)
      console.log(data)

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
      const { data } = await clienteAxios.get(`/general/datosOx`, config); 
     
      setIsLoading2(false);
      setOX(data)
      

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
     
      setTcontrol(data)
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
    url += "&duration=" + 0; // duration, 604800 = one week in seconds
    url += "&flags=" + 0x1; // options, 0x1 = add username in response

    url += "&redirect_uri=" + dns + "/post_token.html"; // if login succeed - redirect to this page

    // listen message with token from login page window
    window.addEventListener("message", tokenRecieved);

    // finally, open login page in new window
    window.open(url, "_blank", "width=760, height=500, top=300, left=500");
  }

  // Help function
  function tokenRecieved(e) {
    // get message from login window
    var msg = e.data;
    if (typeof msg == "string" && msg.indexOf("access_token=") >= 0) {
      // get token
      var token = msg.replace("access_token=", "");
      setToken(token);
      setTokenBD(token)
      // now we can use token, e.g show it on page
     // document.getElementById("token").innerHTML = token;
      //document.getElementById("login").setAttribute("disabled", "");
      //  document.getElementById("logout").removeAttribute("disabled");

      // or login to wialon using our token
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
     
      // remove "message" event listener
      window.removeEventListener("message", tokenRecieved);
    }
  }

  const positions = [
    { lat: 40.7128, lon: -74.0060, info: "Información para la posición 1" },
    { lat: 40.7138, lon: -74.0070, info: "Información para la posición 2" },
    // ... otras posiciones
  ];

  return (
    <>
      <div className="lg:flex lg:justify-between mb-5">
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
        </div>
      </div>

      <div className=" lg:flex lg:justify-between gap-10">
        <div className="w-4/12">
          <button
            id="login"
            className="bg-cyan-900 lg:mb-5 hover:bg-cyan-700 transition cursor-pointer w-full   p-1 text-white "
            value="Listar Unidades"
            onClick={ListarUnidadesPY}
          >
            Listar Unidades
          </button>
        </div>

        <div className="w-4/12">
          <button
            id="login"
            className="bg-cyan-900 lg:mb-5 hover:bg-cyan-700 transition cursor-pointer w-full   p-1 text-white "
            value="Oxigenacion"
            onClick={DatosOxPy}
          >
            Oxigenación
          </button>
        </div>
        <div className="w-4/12">
          <button
            id="login"
            className="bg-cyan-900 lg:mb-5 hover:bg-cyan-700 transition cursor-pointer w-full   p-1 text-white "
            value="Listar Unidades"
            onClick={Tcontrol}
          >
            Control token
          </button>
        </div>
      </div>

      <div className=" lg:flex lg:justify-between gap-10">
        <div className="w-4/12 mb-10">
          <div className="bg-gray-800 text-white shadow-xl rounded-lg p-6 w-full mx-auto max-w-md">
            {isLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <div>
                {unidades[0] !== "error" && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      {unidades.length} Unidades
                    </h2>

                    <ul className="space-y-3">
                      {unidades.map((r, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between p-1 bg-gray-100 "
                        >
                          <span className="text-lg font-medium text-gray-600">
                            {r.nm + " / " + r.id}
                          </span>
                        </li>
                      ))}
                    </ul> 


                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="w-4/12">
          <div className="bg-gray-800 text-white shadow rounded-lg p-6 w-full mx-auto  max-w-md">
            {isLoading2 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <div>
                {oxs.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Sensores</h2>
                    <ul className="mb-3">
                      {oxs.map((r, index) => (
                        <div key={index}>
                          <li className="">
                            <strong>Patente: {r.Patente}</strong>{" "}
                          </li>
                          <li className="">
                            <strong>Velocidad: {r.Velocidad}</strong> km/h
                          </li>
                          <li className="">
                            <strong>Latitud: {r.Latitud}</strong>{" "}
                          </li>
                          <li className="">
                            <strong>Longitud: {r.Longitud}</strong>{" "}
                          </li>
                          <li className="">
                            <strong>Curso: {r.Curso}</strong>{" "}
                          </li>
                          <li className="">
                            <strong>Altitud: {r.Altitud}</strong>{" "}
                          </li>
                          <li className="">
                            <strong>Oxigenación: {r.Oxigenacion}</strong>{" "}
                          </li>
                        </div>
                      ))}
                    </ul>

                    <div>
                      <Mapa posiciones={oxs} />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <div className="w-4/12">
          <div className="bg-gray-800 text-white shadow rounded-lg p-6 w-full mx-auto  max-w-md">
            {isLoading3 ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100vh",
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <div>
                {tControl.length > 0 && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">
                      Control Token
                    </h2>
                    <ul className=" space-y-3 mb-8">
                      {tControl.map((r, index) => (
                        <div key={index}>
                          <hr className=""></hr>
                          <li className="">
                            <strong>Patente: {r.Patente}</strong>{" "}
                          </li>
                          <li className="">
                            <strong>Velocidad: {r.Velocidad}</strong> km/h
                          </li>
                          <li className="">
                            <strong>Latitud: {r.Latitud}</strong>{" "}
                          </li>
                          <li className="">
                            <strong>Longitud: {r.Longitud}</strong>{" "}
                          </li>
                          <li className="">
                            <strong>Curso: {r.Curso}</strong>{" "}
                          </li>
                          <li className="">
                            <strong>Altitud: {r.Altitud}</strong>{" "}
                          </li>
                        </div>
                      ))}
                    </ul>

                    <Mapa posiciones={tControl} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default WialonToken;
