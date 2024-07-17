import React, { useState, useEffect } from "react";
import { msgError, msgInfo, msgOk } from "../../components/Alertas";
import useAuth from "../../hooks/useAuth";
import clienteAxios from "../../config/axios";
import { format, set } from "date-fns";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';

function Turnos() {
  /*  const [turnos, setTurnos] = useState([
    { id: 1, nombre: 'Turno mañana', estado: 'pendiente' },
    { id: 2, nombre: 'Turno tarde', estado: 'pendiente' },
  ]); */

  const { auth } = useAuth();
  const [turnoActual, setTurnoActual] = useState({});
  /* const [turno, setTurnoSeleccionado] = useState(null);  // Nuevo estado */
  const [geolocation, setGeolocation] = useState({ lat: null, lon: null });
  const [control, setControl] = useState(false)
  const [message, setMessage] = useState("");
  const [obs, setObs] = useState("");
  const [turnos, setTurnos] = useState([]);
  const [turno, setTurno] = useState("");
  const [fec_turno, setFecTurno] = useState(format(new Date(), "yyyy-MM-dd"));

  const [turnoAbierto, setTurnoAbierto] = useState(false);
  const [selectTurno, setSelectTurno] = useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  function fomatearFecha(dato) {
    // Transformar la cadena de fecha en un objeto Date
    const fecha1 = new Date(dato);

    // Extraer el día, mes, año
    const dia = String(fecha1.getDate()).padStart(2, "0");
    const mes = String(fecha1.getMonth() + 1).padStart(2, "0"); // Los meses en JS son 0-indexed, por lo que enero es 0
    const ano = fecha1.getFullYear();

    // Extraer la hora, minuto y segundo
    const hora = String(fecha1.getHours()).padStart(2, "0");
    const minuto = String(fecha1.getMinutes()).padStart(2, "0");
    const segundo = String(fecha1.getSeconds()).padStart(2, "0");

  

    // Construir la cadena de fecha en el formato deseado
    return `${dia}-${mes}-${ano} ${hora}:${minuto}:${segundo}`;
  }
  
  useEffect(() => {
    obtenerTurnosPorGuardia(); 
  }, [turnoAbierto]);



///////////////////////////////////////////////////////////
const handleIniciarTurno = () => {
  setIsLoading(true)

   
  if (turno) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          inciarTurno(position.coords.latitude, position.coords.longitude);
          setTurno(turno);
          setTurnoAbierto(true); // Agregado
          msgOk("Turno iniciado");
        },
        (error) => {
          msgError("Activa el GPS de tu dispositivo");
        }
      );
    } else {
      msgError(error);
    }
  } else {
    msgInfo("Por favor selecciona un turno antes de iniciar.");
    setIsLoading(false)
  }

};
 

  const inciarTurno = async (lat , lon) => {    
       if (turno == "") {
         msgError("Seleccione turno");
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
  
      const { data } = await clienteAxios.put(
        `/procesos/iniciarTurno/${turno}`,
        {
          fec_ingreso: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
          lat_ingreso: lat,
          lon_ingreso: lon,
        },
        config
      );    
   
  };

///////////////////////////////////////////////////////////

const handleCerrarTurno = () => {
  setIsLoading(true)

 
   if (turno) {
    if (navigator.geolocation) {
      setIsLoading(true)   

      navigator.geolocation.getCurrentPosition(
        (position) => {        
          finalizarTurno(position.coords.latitude,position.coords.longitude);
          setTurnoAbierto(false); 
          setTurnoActual({});
          msgOk("Turno terminado con éxito!");

        },
        (error) => {
          msgError("Activa el GPS de tu dispositivo");
        }
      );
      setIsLoading(false)   
    } else {
      msgError(error);
    }    
    
  } else {
    msgInfo("Por favor selecciona un turno antes de iniciar.");
    setIsLoading(false)
  } 

};
  

  const finalizarTurno = async (lat, lon) => {    
    

    if (turnoActual.id == "") {
      msgError("Seleccione turno");
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

     const { data } = await clienteAxios.put(
      `/procesos/terminarTurno/${turno}`,
      {
        fec_salida: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
        lat_salida: lat,
        lon_salida: lon,
        obs_cierre : obs
      },
      config
    ); 
     

  };

///////////////////////////////////////////////////////////

  const obtenerTurnosPorGuardia = async () => {
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
        `/procesos/turno-persona/${auth.id_empresa}/${fec_turno}/${auth.id}`,
        config
      );

      setTurnos(data);

      const turnoAbiertoObj = data.find(
        (data) => data.est_ingreso === 1 && data.est_salida === 0
      );

      if (turnoAbiertoObj) {
        setTurnoAbierto(true);
        setTurnoActual(turnoAbiertoObj);
        setTurno(turnoAbiertoObj.id);
      }else{
        setTurnoAbierto(false);
      }
      setIsLoading(false)

    } catch (error) {
      console.log(error);
    }
  };


  return (
    <div className="flex flex-col items-center justify-center p-4 space-y-8">
      <h2 className="font-black text-blue-900 text-2xl">
        Gestión{" "}
        <span className="font-black text-blue-500 mb-10 text-center">
          Turnos
        </span>
      </h2>

      {message && <div className="p-4 bg-green-200 rounded">{message}</div>}

      {!turnoAbierto ? (
        turnos.filter((r) => r.est_ingreso == 0).length > 0 ? (
          <div className="lg:w-4/12 w-full bg-blue-100 text-white">
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">Turnos</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={turno}
                label="Turnos"
                onChange={(e) => {
                  setTurno(e.target.value);
                }}
              >
                {turnos
                  .filter((r) => r.est_ingreso == 0)
                  .map((tipo) => (
                    <MenuItem key={tipo.id} value={tipo.id}>
                      {" "}
                      {tipo.mae_turno.nom_turno}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

                 <Button
                  disabled={isLoading}
                  className="w-full"
                  onClick={() => {
                    handleIniciarTurno();
                  }}
                  variant="contained"
                  sx={{
                    backgroundColor: '#3B5EC8',
                    marginTop: '10px',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#012180', 
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Iniciar Turno"
                  )}
                </Button>

          
          </div>
        ) : (
          <h2 className="text-red-900 text-center font-bold mr-3 text-xl">
            Sin Turnos Registrados
          </h2>
        )
      ) : (
        <div className="flex bg-white p-5 border lg:w-4/12  w-full shadow-xl border-gray-600 flex-col text-center">
          <h2 className="text-xl text-blue-900 font-bold border-b-4">
            Turno en Ejecución
          </h2>

          {turnos
            .filter((r) => r.id == turno)
            .map((tipo) => (
              <div key={tipo.id}>
                <h4 className="text-lg text-blue-700 font-bold mt-4">
                  {tipo.mae_turno.nom_turno}
                </h4>

                <div className="flex flex-col items-center mt-2">
                  <span className="font-bold">Ingreso</span>
                  <span className="font-semibold text-blue-800">
                    {" "}
                    {fomatearFecha(tipo.fec_ingreso)}
                  </span>
                </div>

                <div className="flex flex-col items-center mt-2">
                  <span className="font-bold">Instalacion</span>
                  <span className="font-semibold text-blue-800">
                    {tipo.mov_instalaciones_cliente.nombre}
                  </span>
                </div>

                <div className="flex flex-col items-center mt-2">             
                  <div className="relative w-full ">
                    <TextField
                      id="outlined-multiline-flexible"
                      label="Observación Cierre"
                      className="bg-white w-full"
                      multiline
                      rows={3}
                      value={obs}
                      onChange={(e) => setObs(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}



          <Button
                  disabled={isLoading}
                  className="w-full"
                  onClick={() => {
                    handleCerrarTurno();
                  }}
                  variant="contained"
                  sx={{
                    backgroundColor: '#FF5733',
                    marginTop: '10px',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: '#A30A0A', // Color para el hover
                    },
                  }}
                >
                  {isLoading ? (
                    <CircularProgress size={22} color="inherit" />
                  ) : (
                    "Cerrar Turno"
                  )}
                </Button>


        </div>
      )}
    </div>
  );
}

export default Turnos;
