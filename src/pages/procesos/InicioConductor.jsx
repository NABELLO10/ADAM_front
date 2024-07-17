import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { validateRut } from "@fdograph/rut-utilities";
import Box from '@mui/material/Box';
import TableroConductor from './TableroConductor';
import formatearRut from "../../components/datos/formateaRut";
import clienteAxios from '../../config/axios';

const InicioConductor = () => {
  const [patente, setPatente] = useState("");
  const [rut, setRut] = useState("");

  const [showInicio, setShowInicio] = useState(true);

  useEffect(()=> {
    setPatente("")
  },[])

  useEffect(()=> {
    if(showInicio){
      setPatente("")
    }  
  },[showInicio])



  const handleIniciarClick = () => {
    /* 
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => { */
    if (patente && rut) {
      if (!validateRut(rut)) {
        alert("RUT Invalido");
        return;
      }
      iniciarConductor(1);
      setShowInicio(false);
    } else {
      alert("Por favor, complete todos los campos.");
    }
    /* },
        (error) => {
          alert("Activa el GPS de tu dispositivo");
        }
      );
    } else {
      alert("Geolocalización no soportada por este navegador.");
    }  */
  };


  

  const handleCerrarClick = () => {
    iniciarConductor(0)
    setShowInicio(true);
    setPatente("")
  };
  
  const iniciarConductor = async (est_activo) => {
     try {    
      await clienteAxios.post('/general/inicioConductor', {
        patente,
        rut, 
        est_activo        
    })
  
    } catch (error) {
        alert(error.response.data.msg);
    }  
  };

  
  return (
    <>
      {showInicio && (
        <div className="lg:w-3/12  mx-auto mt-20 ">
          <Box>
            <div className="text-center mb-2 text-xl font-bold ">
              Panel <span className="text-red-700">Alertas</span>
            </div>
            <div className="bg-white p-5 space-y-3">
              <TextField
                label="RUT"
                fullWidth
                style={{ marginBottom: 8 }}
                value={rut}
                onChange={(e) => setRut(formatearRut(e.target.value))}
                inputProps={{
                  maxLength: 10,
                }}
              />

              <TextField
                label="Patente"
                fullWidth
                style={{ marginBottom: 8 }}
                value={patente}
                onChange={(e) =>
                  setPatente(e.target.value.replace(/-/g, "").toUpperCase())
                }
                inputProps={{
                  maxLength: 6,
                }}
              />

              <Button
                variant="contained"
                color="primary"
                fullWidth={true}
                onClick={handleIniciarClick}
              >
                Iniciar
              </Button>
            </div>
          </Box>
        </div>
      )}
      {!showInicio && (
        <Box>
          <div className="justify-center">
            <div>
              {" "}
              <button
                onClick={handleCerrarClick}
                className="bg-gray-800 w-full text-white text-xl hover:bg-gray-500 p-2"
              >
                Cerrar Sesión
              </button>
            </div>
            <div>
              <TableroConductor patente={patente} rut={rut} setShowInicio={setShowInicio} />
            </div>
          </div>
        </Box>
      )}
    </>
  );
};

export default InicioConductor;
