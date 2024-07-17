import React, { useState, useEffect } from 'react';
import ModalesNotificaciones from './ModalesNotificaciones';
import NorthTwoToneIcon from '@mui/icons-material/NorthTwoTone';
import SouthTwoToneIcon from '@mui/icons-material/SouthTwoTone';
import NotificationsActiveTwoToneIcon from '@mui/icons-material/NotificationsActiveTwoTone';
import AccessAlarmsTwoToneIcon from '@mui/icons-material/AccessAlarmsTwoTone';
import UpdateTwoToneIcon from '@mui/icons-material/UpdateTwoTone';
import HistoryTwoToneIcon from '@mui/icons-material/HistoryTwoTone';

import Tooltip from "@mui/material/Tooltip";


const ListadoUnidades = ({open,handleClose, info, setInfo, openAlerta, handleCloseAlerta, camiones, onCamionClick, id_transportista, notActiva, notTemp}) => {
 
  const [busqueda, setBusqueda] = useState("");
  const [orden, setOrden] = useState(true);
  const [ordenTime, setOrdenTime] = useState(true);
  const [alertaOX, setAlertaOX] = useState(true);
  const [alertaTemp, setAlertaTemp] = useState(true);
  const [camionesOrdenados, setCamionesOrdenados] = useState([]);

  const [tipoOrdenamiento, setTipoOrdenamiento] = useState(null);


function esMenorA20Minutos(fechaStr) {
  const fecha = new Date(fechaStr);
  const ahora = new Date();
  const diferencia = ahora - fecha;
  return diferencia >= 20 * 60 * 1000; 
}


function formatearFecha(fechaStr) {
  var fecha = new Date(fechaStr);
  var dia = ('0' + fecha.getDate()).slice(-2);
  var mes = ('0' + (fecha.getMonth() + 1)).slice(-2);
  var año = fecha.getFullYear();
  var horas = ('0' + fecha.getHours()).slice(-2);
  var minutos = ('0' + fecha.getMinutes()).slice(-2);
  var segundos = ('0' + fecha.getSeconds()).slice(-2);
  return dia + '-' + mes + '-' + año + ' ' + horas + ':' + minutos + ':' + segundos;
}

function esFechaValida(valor) {
  const fecha = new Date(valor);
  return !isNaN(fecha.getTime());
}

const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 1024); // 1024px es el breakpoint 'lg' por defecto en Tailwind



function parseAndFormatDate(input) {
  if (input === null || input.trim() === '') {
    return null; // Si la entrada es null o una cadena vacía, devolver null
  }

  // Diccionario para convertir los nombres de los meses a números
  const monthNames = {
    Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
    Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12'
  };

  let parts, year, month, day, hour, minute;

  if (input.includes('/')) { // Formato "DD-MMM-YY / HH:MM"
    parts = input.split(/[-/ :]/);
    year = `20${parts[2]}`; // Asumir que el año está en formato de dos dígitos y agregar '20' al inicio
    month = monthNames[parts[1]]; // Convertir el nombre del mes a su número correspondiente
    day = parts[0].length === 1 ? `0${parts[0]}` : parts[0]; // Asegurar que el día tenga dos dígitos
    [hour, minute] = parts[3].split(':');
  } else { // Formato "YYYY-MM-DD HH:MM"
    parts = input.split(/[- :]/);
    [year, month, day] = parts;
    hour = parts[3];
    minute = parts[4];
  }

  // Asegurar que la hora y minuto tengan dos dígitos
  hour = hour.length === 1 ? `0${hour}` : hour;
  minute = minute.length === 1 ? `0${minute}` : minute;

  // Concatenar la fecha en el formato deseado
  return `${year}-${month}-${day} ${hour}:${minute}:00`;
}

useEffect(() => {
  setInfo({})
},[id_transportista])

useEffect(() => {
  const handleResize = () => {
    setIsLargeScreen(window.innerWidth >= 1024);
  };

  window.addEventListener('resize', handleResize);

  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);


const ordenarPorPatente = (a, b) => a.patente.localeCompare(b.patente);
const ordenarPorFechaGPS = (a, b) => new Date(a.fechaGPS) - new Date(b.fechaGPS);

useEffect(() => {
  let resultadoOrdenado = [...camiones]
    .filter(val => busqueda === "" || val.patente.toLowerCase().includes(busqueda.toLowerCase()))
/*     .filter(val => alertaOX ? true : val.est_alerta_ox)
    .filter(val => alertaTemp ? true : val.est_alerta_temp); */

  // Aplicar el ordenamiento basado en tipoOrdenamiento
  if (tipoOrdenamiento === 'patente') {
    resultadoOrdenado.sort(ordenarPorPatente);
  } else if (tipoOrdenamiento === 'fecha') {
    resultadoOrdenado.sort(ordenarPorFechaGPS);
  }

  setCamionesOrdenados(resultadoOrdenado);
}, [tipoOrdenamiento, camiones, busqueda, alertaOX, alertaTemp]);


  return (
    <>
      <div className="flex justify-start w-full  gap-2  items-center">
      
        <input
          name="busqueda"
          id="busqueda"
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className=" p-2 border border-gray-400 shadow "
          placeholder=" Buscar unidad..."
        />



       {/*  <Tooltip
          title={`${alertaOX ? "TODOS LOS REGISTROS" : "REGISTROS CON ALERTAS OX"}`}
        >
          <button
            onClick={() => setAlertaOX(!alertaOX)}
            className={`${
              !alertaOX
                ? "bg-red-900 hover:bg-red-800 "
                : "bg-blue-900 hover:bg-blue-800 "
            } p-2 rounded text-white `}
          >
                  OX
          </button>
        </Tooltip>
     
        <Tooltip
          title={`${alertaTemp ? "TODOS LOS REGISTROS" : "REGISTROS CON ALERTAS TEMP"}`}
        >
          <button
            onClick={() => setAlertaTemp(!alertaTemp)}
            className={`px-3 ${
              !alertaTemp
                ? "bg-red-900 hover:bg-red-800 "
                : "bg-blue-900 hover:bg-blue-800 "
            } p-2 rounded text-white `}
          >
      T°
          </button>
        </Tooltip> */}

        <Tooltip title={`${orden ? "A-Z" : "Z-A"}`}>
          <button
            onClick={() => setTipoOrdenamiento(tipoOrdenamiento === 'patente' ? null : 'patente')}
            className="bg-gray-900 p-2 rounded text-white hover:bg-gray-500"
          >
            {orden ? 'A-Z' : 'Z-A'}
          </button>
        </Tooltip>
       
        <Tooltip title={`${ordenTime ? "Mayor Tiempo" : "Menor Tiempo"}`}>
          <button
            onClick={() =>setTipoOrdenamiento(tipoOrdenamiento === 'fecha' ? null : 'fecha')}
            className="bg-cyan-900 p-2 rounded text-white hover:bg-cyan-600"
          >
            {ordenTime ? <UpdateTwoToneIcon/> : <HistoryTwoToneIcon/>}
          </button>
        </Tooltip>
      </div>

      {camionesOrdenados.length > 0 ? <div>  <div className='text-cyan-700 font-bold text-md mt-2 text-end'>{camionesOrdenados.length} Unidades</div>

<div className='border-gray-400 opacity-80 shadow-lg p-1 border-4 bg-gray-400 rounded-md '>
  <div
    className={`container mx-auto space-y-1 mt-1 custom-scrollbar`}
    style={{
      maxHeight: isLargeScreen ? 960 : "23vh",
      overflowY: "auto",
    }}
  >
     
     {camionesOrdenados.filter(r => r.est_ox == 1 || r.est_temp == 2).map((item, index) => (
        <div
          onClick={() => {
            onCamionClick(item);
            setInfo(item); // Esto establece el estado `info` al `item` clickeado
          }}
          key={index}
          className={`${
            info.patente === item.patente ? "bg-gray-300" : "bg-white" // Si `info.patente` es igual a `item.patente`, se aplica la clase de color de fondo azul, de lo contrario, blanco
          } shadow-md border border-gray-300 rounded p-2  hover:bg-gray-100 mb-2 cursor-pointer`}
        >
          <div className="lg:flex  lg:justify-between  justify-center">
            <span className="text-md font-bold text-black">
              {item.patente}
            </span>
            <span
              className={`${
                esMenorA20Minutos(item.fechaGPS)
                  ? "text-red-500"
                  : "text-green-600"
              } font-semibold`}
            >
              {"  GPS: "}
               {esFechaValida(item.fechaGPS)
                ? formatearFecha(item.fechaGPS)
                : item.fechaGPS}                     
            </span>
            <span
              className={" text-gray-500 font font-semibold "}
            >
           {" Estanque: "}
                {item.fecha}
            </span>
          </div>

          <div className="">
            <div
              className={`flex flex-wrap gap-1 ${
                item.est_ox == 1 ? "block" : "hidden"
              }`}
            >
              <span className="text-sm font-bold text-gray-500">E1:</span>{" "}
              <span
                className={`${
                  (notActiva &&
                    parseInt(item.ox1) > parseInt(notActiva.val_max)) ||
                  parseInt(item.ox1) < parseInt(notActiva.val_min)
                    ? "text-red-400 text-md animate-bounce font-bold "
                    : "text-gray-500 text-sm"
                }`}
              >
                {item.ox1}
              </span>
              <span className="text-sm font-bold text-gray-500">
                E2:{" "}
              </span>{" "}
              <span
                className={`${
                  (notActiva &&
                    parseInt(item.ox2) > parseInt(notActiva.val_max)) ||
                  parseInt(item.ox2) < parseInt(notActiva.val_min)
                    ? "text-red-400 text-md animate-bounce font-bold"
                    : "text-gray-500 text-sm"
                } `}
              >
                {item.ox2}
              </span>
              <span className="text-sm font-bold text-gray-500">
                E3:{" "}
              </span>{" "}
              <span
                className={`${
                  (notActiva &&
                    parseInt(item.ox3) > parseInt(notActiva.val_max)) ||
                  parseInt(item.ox3) < parseInt(notActiva.val_min)
                    ? "text-red-400 text-md animate-bounce font-bold"
                    : "text-gray-500 text-sm"
                }`}
              >
                {item.ox3}
              </span>
              <span className="text-sm font-bold text-gray-500">
                E4:{" "}
              </span>{" "}
              <span
                className={`${
                  (notActiva &&
                    parseInt(item.ox4) > parseInt(notActiva.val_max)) ||
                  parseInt(item.ox4) < parseInt(notActiva.val_min)
                    ? "text-red-400 text-md animate-bounce font-bold"
                    : "text-gray-500 text-sm"
                }`}
              >
                {item.ox4}
              </span>
              <span className="text-sm font-bold text-gray-500">
                E5:{" "}
              </span>{" "}
              <span
                className={`${
                  (notActiva &&
                    parseInt(item.ox5) > parseInt(notActiva.val_max)) ||
                  parseInt(item.ox5) < parseInt(notActiva.val_min)
                    ? "text-red-400 text-md animate-bounce font-bold"
                    : "text-gray-500 text-sm"
                } `}
              >
                {item.ox5}
              </span>
              <span className="text-sm font-bold text-gray-500">
                E6:{" "}
              </span>{" "}
              <span
                className={`${
                  (notActiva &&
                    parseInt(item.ox6) > parseInt(notActiva.val_max)) ||
                  parseInt(item.ox6) < parseInt(notActiva.val_min)
                    ? "text-red-400 text-md animate-bounce font-bold"
                    : "text-gray-500 text-sm"
                } `}
              >
                {item.ox6}
              </span>
              <span className="text-sm font-bold text-gray-500">
                E7:{" "}
              </span>{" "}
              <span
                className={`${
                  (notActiva &&
                    parseInt(item.ox7) > parseInt(notActiva.val_max)) ||
                  parseInt(item.ox7) < parseInt(notActiva.val_min)
                    ? "text-red-400 text-md animate-bounce font-bold"
                    : "text-gray-500 text-sm"
                } `}
              >
                {item.ox7}
              </span>
              <span className="text-sm font-bold text-gray-500">
                E8:{" "}
              </span>{" "}
              <span
                className={`${
                  (notActiva &&
                    parseInt(item.ox8) > parseInt(notActiva.val_max)) ||
                  parseInt(item.ox8) < parseInt(notActiva.val_min)
                    ? "text-red-400 text-md animate-bounce font-bold"
                    : "text-gray-500 text-sm"
                }`}
              >
                {item.ox8}
              </span>
              <span className="text-sm font-bold text-gray-500">
                E9:{" "}
              </span>{" "}
              <span
                className={`${
                  (notActiva &&
                    parseInt(item.ox9) > parseInt(notActiva.val_max)) ||
                  parseInt(item.ox9) < parseInt(notActiva.val_min)
                    ? "text-red-400 text-md animate-bounce font-bold"
                    : "text-gray-500 text-sm"
                } `}
              >
                {item.ox9}
              </span>
              <span className="text-sm font-bold text-gray-500">
                E10:{" "}
              </span>{" "}
              <span
                className={`${
                  (notActiva &&
                    parseInt(item.ox10) > parseInt(notActiva.val_max)) ||
                  parseInt(item.ox10) < parseInt(notActiva.val_min)
                    ? "text-red-400 text-md animate-bounce font-bold"
                    : "text-gray-500 text-sm"
                } `}
              >
                {item.ox10}
              </span>
              <span className="text-sm font-bold text-gray-500">
                {" "}
                T°:{" "}
              </span>{" "}
              <span
                className={`${
                  (notTemp &&
                    parseInt(item.temp) > parseInt(notTemp.val_max)) ||
                  parseInt(item.temp) < parseInt(notTemp.val_min)
                    ? "text-red-400 text-md animate-bounce font-bold"
                    : "text-gray-500 text-sm"
                } `}
              >
                {item.temp}
              </span>
            </div>
          </div>
        </div>
      ))}

    <ModalesNotificaciones
      open={open}
      handleClose={handleClose}
      info={info}
      notActiva={notActiva}
      notTemp={notTemp}
      openAlerta={openAlerta}
      handleCloseAlerta={handleCloseAlerta}
    />
  </div>
</div></div> : <div>
<span className='text-cyan-900 font-bold text-center mx-auto justify-center flex mt-44'>Sin Unidades Registradas</span>
</div>  }


    


    </>
  );
};

export default ListadoUnidades;
