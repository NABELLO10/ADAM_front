import React, { useState, useEffect, useRef } from 'react';
import clienteAxios from "../../config/axios";
import { msgError, msgInfo, msgOk, msgWarning } from "../../components/Alertas";

import KeyboardDoubleArrowDownTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowDownTwoTone';
import KeyboardDoubleArrowUpTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowUpTwoTone';

const LogEntry = ({ log}) => {

  const formatDetails = (detalle) => {
    // Reemplazar las barras invertidas y luego ordenar
    const cleanDetail = detalle.replace(/\\/g, ''); // Eliminar las barras invertidas
    try {
      const detailsObj = JSON.parse(cleanDetail);
      return Object.entries(detailsObj)
        .sort(([key1], [key2]) => key1.localeCompare(key2))
        .map(([key, value]) => `${key.toUpperCase()}: ${value}`)
        .join(', ');
    } catch (error) {
      console.error('Error parsing details:', error);
      return cleanDetail; // Retorna el detalle sin barras invertidas si hay un error en el parseo
    }
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white border border-gray-300 shadow-xl rounded-lg p-2 mb-2" >
      <div className="flex-1 mb-4 md:mb-0 md:mr-4 text-sm">
        <h3 className={`text-lg font-semibold ${log.est_revisado ? 'text-green-500' : 'text-red-600'}`}>
          Patente: {log.patente}
        </h3>
        {log.est_revisado ? (
          <>
           <h6 className="text-xs text-green-500 font-semibold">Revisado</h6>
          
          <p className="text-gray-700"><span className='font-bold text-gray-500'>Tipo: </span> {log.tipo}</p>
          <p className="text-gray-700 "><span className='font-bold text-gray-500'>Detalle: </span> {formatDetails(log.detalle)}</p>
          <p className="text-gray-700"><span className='font-bold text-gray-500'>Fecha de Alerta: </span> {log.fecGPS}</p>  
          </>
                 
        ) : (
          <>
            <p className="text-gray-700"><span className='font-bold text-gray-500'>Tipo: </span> {log.tipo}</p>
            <p className="text-gray-700"><span className='font-bold text-gray-500'>Detalle: </span> {formatDetails(log.detalle)}</p>
            <p className="text-gray-700"><span className='font-bold text-gray-500'>Fecha de Alerta: </span> {log.fecGPS}</p>         
          </>
        )}
      </div>
     
    </div>
  );
};

const LogsList = ({ logs, onMarkAsSeen, actualizar, actualizarTodos }) => {

  const scrollContainerRef = useRef(null);

  const scrollToTop = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    scrollContainerRef.current?.scrollTo({ top: scrollContainerRef.current.scrollHeight, behavior: 'smooth' });
  };

  return (
    <>
      {logs.length > 0 ? (
        <div className="lg:w-6/12 mt-2 mx-5 lg:mx-auto">
          <div className="flex justify-between ">
            <button
              onClick={scrollToTop}
              className="px-4 py-2 bg-blue-900 text-white rounded hover:bg-blue-700"
            >
              <KeyboardDoubleArrowUpTwoToneIcon />
            </button>
            <div className="text-center text-xl items-center flex font-semibold ">
              Pendientes: {logs.filter((log) => log.est_revisado !== 1).length}
            </div>
            <button
              onClick={scrollToBottom}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              <KeyboardDoubleArrowDownTwoToneIcon />
            </button>
          </div>

          <div ref={scrollContainerRef} className="h-96 mt-2 overflow-auto">
            {logs.map((log) => (
              <LogEntry
                key={log.id}
                log={log}
                onMarkAsSeen={onMarkAsSeen}
                actualizar={actualizar}
              />
            ))}
          </div>

          <div>
            <button
              onClick={() => actualizarTodos()}
              className="px-4 w-full mt-5 py-2 bg-green-800 text-white rounded hover:bg-green-700"
            >
              Marcar Todos como Revisados
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center font-bold mt-32 text-xl">
          Sin <span className="text-red-900">Registros</span>
        </div>
      )}
    </>
  );
};

//tablero conductor
const TableroConductor = ({patente, rut, setShowInicio }) => {
  const [logs, setLog] = useState([]) 
   /*  useEffect(() => {      
    const enviarGPS = async (lat, lon) => {
      await clienteAxios.post(`/general/enviarGPS`, {
        patente,
        rut,
        lat,
        lon,
      });
    }; */
 /*    const intervalId = setInterval(() => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              enviarGPS(position.coords.latitude, position.coords.longitude);       
            },
            (error) => {
              alert("Activa el GPS de tu dispositivo");
            }
          );
        } else {
          alert("Geolocalización no soportada por este navegador.");
        }
      }, 300000); // 5 min
  
      // Función para limpiar el intervalo al desmontar el componente
      return () => clearInterval(intervalId);
    }, []);  */

    useEffect(() => {
      const intervalId = setInterval(async () => { 
        try {
          const estado = await obtenerEstado();
         
          if (estado == null) {
            setShowInicio(true)
          } 

        } catch (error) {
          console.error(error);
        }
      }, 60000);     

      return () => {
        clearInterval(intervalId);
      };
    }, []);
    

    const obtenerEstado = async () => {
      try {
        const response = await clienteAxios.get(`/general/obtenerConductorActivo/${patente}/${rut}`);
        return response.data;
      } catch (error) {
        console.error(error);
        return null;
      }
    };


  const actualizar = async (id) => {
    try {   
      const {data} = await clienteAxios.put(`/general/revisarLog/${id}`);
    
      setLog(logs.map(log => log.id === id ? { ...log, est_revisado: 1 } : log));
      msgOk(data.msg);    

   } catch (error) {
      msgError(error.response.data.msg);
    } 
};

const actualizarTodos = async (id) => {
  try {   
    const {data} = await clienteAxios.put(
      `/general/revisarTodos/${patente}`);

    setLog(logs.map(log => ({ ...log, est_revisado: 1 })));
    msgOk(data.msg); 
 } catch (error) {
    msgError(error.response.data.msg);
  } 
};

useEffect(() => {
    const obtenerLog = async () => {
      try {
        const { data } = await clienteAxios.get(
          `/general/obtenerLogConductor2/${patente}`);    
        setLog(data);
      } catch (error) {
        // msgError debe ser una función que maneje los errores de la petición
        console.log(error.response ? error.response.data.msg : "Error al obtener los logs");
      }
    };

    obtenerLog();

    const intervalId = setInterval(obtenerLog, 60000);
    return () => clearInterval(intervalId);

  }, [patente]); // Dependencias del efecto


  useEffect(() => {
    // Reproducir sonido y mostrar notificación para cada nuevo log no revisado
    if (logs.filter((log) => log.est_revisado !== 1).length > 0) {
      const nuevoLog = logs.find((log) => !log.est_revisado);
      if (nuevoLog) {
        /*  const audio = new Audio(NotificationSound);
         audio.play().catch(e => console.log('Error al reproducir el sonido:', e)); */
        if (Notification.permission === "granted") {
          new Notification(`Alerta / ${patente}`, {
            body: ``,
            vibrate: [200, 100, 200],
          });
        }
      }
    } 
  }, [logs]);


  const markAsSeen = (id) => {
    
  };

  return <LogsList logs={logs} onMarkAsSeen={markAsSeen} actualizar ={actualizar} actualizarTodos={actualizarTodos}/>;
};

export default TableroConductor;



