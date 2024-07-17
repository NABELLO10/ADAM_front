// Importaciones necesarias
import React, { useState, useMemo, useEffect  } from 'react';
import { Line,  Bar } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { msgError } from "../Alertas"
import clienteAxios from "../../config/axios";
import { format } from "date-fns";
import TextField from "@mui/material/TextField";
import RptOx from '../reports/RptOX';
import RptTemp from '../reports/RptTemp';
import RptAlertas from '../reports/RptAlertas';
import moment from 'moment-timezone';

// Registro de componentes necesarios para Chart.js
ChartJS.register(...registerables);

// Componente de React
const GraficoGral = ({camionSeleccionado, empresaSistema, id_transportista}) => {
  const [selectedPatent, setSelectedPatent] = useState(camionSeleccionado.patente.replace(/-/g, '').toUpperCase());
  const [desde, setDesde] = useState(format(new Date(), "yyyy-MM-dd"));
  const [hasta, setHasta] = useState(format(new Date(), "yyyy-MM-dd"));
  
  const [datosOX, setDatosOx] = useState([]);
  const [log, setLog] = useState([]);

  useEffect(() => {
    DatosOx()    
    obtenerLog()
    setSelectedPatent(camionSeleccionado.patente)    
  },[camionSeleccionado, desde, hasta, selectedPatent])

  
  const DatosOx = async () => {
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
      const { data } = await clienteAxios.get(`/general/datos-ox-fechas/${camionSeleccionado.patente}/${desde}/${hasta}`, config);
      setDatosOx(data);
   
    } catch (error) {
      msgError(error.response.data.msg);
    } 
  };


  const obtenerLog = async () => {
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
       
       const { data } = await clienteAxios.get(`/general/obtenerLog/${selectedPatent.replace(/-/g, '').toUpperCase()}/${desde}/${hasta}/${empresaSistema}/${id_transportista}`, config);  
    
       
       setLog(data);
    
      } catch (error) {
       msgError(error.response.data.msg);
     } 
   };

   const alertsCountByDateAndType = useMemo(() => {
    const counts = {};
  
    // Asumimos que cada elemento en `log` es una alerta y tiene un campo `tipo`.
    log.forEach(item => {
      // Usamos la fecha de registro y el tipo como clave para contar las alertas.
      const key = `${item.fecAlerta}-${item.tipo}`; // Ajusta esto según el formato exacto de tu fecha y tipo.
      if (!counts[key]) {
        counts[key] = { date: item.fecAlerta, type: item.tipo, count: 0 };
      }
      counts[key].count += 1; // Sumamos 1 por cada alerta.
    });

 
    // Convertimos el objeto en un array de objetos para usarlo en los gráficos, separado por tipo.
    return Object.values(counts);
  }, [log]);
  
  // Filtramos por tipo de alerta para cada gráfico
  const alertsForTemperature = alertsCountByDateAndType.filter(alert => alert.type === "Temperatura GPS fuera de límites");
  const alertsForOxygenation = alertsCountByDateAndType.filter(alert => alert.type === "Oxigenación GPS fuera de límites");
  
  // Preparando datos para el gráfico de Temperatura
  const alertBarChartDataTemp = {
    labels: alertsForTemperature.map(data => data.date),
    datasets: [
      {
        label: 'Alertas de Temperatura por día',
        data: alertsForTemperature.map(data => data.count),
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ]
  };
  
  // Preparando datos para el gráfico de Oxigenación
  const alertBarChartDataOX = {
    labels: alertsForOxygenation.map(data => data.date),
    datasets: [
      {
      label: 'Alertas de Oxigenación por día',
      data: alertsForOxygenation.map(data => data.count),
      backgroundColor: 'rgba(54, 162, 235, 0.5)',
      },
    ]
  };
  
  
  

  const filteredData = datosOX.filter((data) => {

    if (selectedPatent.replace(/-/g, '').toUpperCase() && data.patente.replace(/-/g, '').toUpperCase() !== selectedPatent.replace(/-/g, '').toUpperCase()) {
      return false;
    }
    const date = moment.tz(data.fechaGPS, 'America/Santiago').format('DD-MM-YYYY');

    if (desde && date < new Date(desde)) {
      return false;
    }
    if (hasta && date > new Date(hasta)) {
      return false;
    }
    return true;
  });
  



  // Configuración del gráfico de líneas
  const lineChartData = {
    labels: filteredData.map(data => data.fechaGPS),
    datasets: [
      {
        label: 'OX1',
        data: filteredData.map(data => data.ox1),
        fill: false,
        borderColor: 'gray',
        tension: 0.2,    
      },
      {
        label: 'OX2',
        data: filteredData.map(data => data.ox2),
        fill: false,
        borderColor: 'black',
        tension: 0.2    
      },
      {
        label: 'OX3',
        data: filteredData.map(data => data.ox3),
        fill: false,
        borderColor: 'MediumVioletRed',
        tension: 0.2
      },
      {
        label: 'OX4',
        data: filteredData.map(data => data.ox4),
        fill: false,
        borderColor: 'green',
        tension: 0.2
      },
      {
        label: 'OX5',
        data: filteredData.map(data => data.ox5),
        fill: false,
        borderColor: 'DarkBlue',
        tension: 0.5
      },
      {
        label: 'OX6',
        data: filteredData.map(data => data.ox6),
        fill: false,
        borderColor: 'Olive',
        tension: 0.2
      },
      {
        label: 'OX7',
        data: filteredData.map(data => data.ox7),
        fill: false,
        borderColor: 'DarkRed',
        tension: 0.2
      },
      {
        label: 'OX8',
        data: filteredData.map(data => data.ox8),
        fill: false,
        borderColor: 'Darkorange',
        tension: 0.2
      },
      {
        label: 'OX9',
        data: filteredData.map(data => data.ox9),
        fill: false,
        borderColor: 'Indigo',
        tension: 0.2
      },
     
      // Repetir para cada sensor OX necesario...
    ]
  };


  const tempChartData = {
    labels: filteredData.map(data => data.fechaGPS),
    datasets: [
      {
        label: 'Temperatura',
        data: filteredData.map(data => data.temp),
        fill: false,
        borderColor: 'DodgerBlue',
        tension: 0.2
      },
    ]
  };


  const options = {
    scales: {
      x: {
        ticks: {
          // Esto oculta las etiquetas del eje x
          display: false
        }
      },
      // Configuración para los otros ejes si es necesario
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (context) {          
            // Personaliza el título del tooltip
            return 'Fecha GPS: ' + moment.tz(context[0].label, 'America/Santiago').format('DD-MM-YYYY HH:mm:ss') ;
          },               
        }
      }
    }
  };


  const optionsAlertas = {
    scales: {
      x: {
        ticks: {
          // Esto oculta las etiquetas del eje x
          display: false
        }
      },
      // Configuración para los otros ejes si es necesario
    },
    plugins: {
      tooltip: {
        callbacks: {
          title: function (context) {
            // Personaliza el título del tooltip
            return 'Fecha Registro : ' + moment.tz(context[0].label, 'America/Santiago').format('YYYY-MM-DD') ;
          },               
        }
      }
    }
  };
 

  return (
    <div>
      <div className="lg:flex justify-end gap-2 mb-4">
        <div className="lg:w-3/12">
          <TextField
            id="desde"
            label="Desde"
            className="block w-full bg-white"
            type="date"
            variant="outlined"
            value={desde}
            onChange={(e) => setDesde(e.target.value)}
          />
        </div>

        <div className="lg:w-3/12 mt-4 lg:mt-0">
          <TextField
            id="hasta"
            label="Hasta"
            className="block w-full bg-white"
            type="date"
            variant="outlined"
            value={hasta}
            onChange={(e) => setHasta(e.target.value)}
          />
        </div>
      </div>

      <div className="">
        <div className="flex justify-between">
          <h2 className="text-lg mx-2 font-semibold mt-2">
            Oxigenación / {camionSeleccionado.patente}
          </h2>

        <RptOx data={datosOX} tipo={"GPS"} nombrePdf={"Oxigenación"} /> 

        </div>

        <Line data={lineChartData} options={options} />
      </div>
      <div className="mt-4">
        <div className="flex justify-between">
          <h2 className="text-lg mx-2  font-semibold mt-2">
            Alertas OX / {camionSeleccionado.patente}
          </h2>

          <RptAlertas data={log} nombrePdf={"Alertas"} tipo ={"Oxigenación GPS fuera de límites"} /> 
        </div>

        {/*    <Line data={alertBarChartDataTemp} options={optionsAlertas} /> */}
        <Bar data={alertBarChartDataOX} options={optionsAlertas} />
      </div>


      <div className="mt-4">
        <div className="flex justify-between">
          <h2 className="text-lg mx-2  font-semibold mt-2">
            Temp / {camionSeleccionado.patente}
          </h2>

          <RptTemp tipo={"GPS"} data={datosOX} nombrePdf={"Temperatura"} /> 

          
        </div>
        {/* Gráfico de líneas para Temperatura */}
        <Line data={tempChartData} options={options} />
      </div>

      <div className="mt-4">
        <div className="flex justify-between">
          <h2 className="text-lg mx-2  font-semibold mt-2">
            Alertas T° / {camionSeleccionado.patente}
          </h2>

          <RptAlertas data={log} nombrePdf={"Alertas"} tipo ={"Temperatura GPS fuera de límites"} /> 
        </div>

        {/*    <Line data={alertBarChartDataTemp} options={optionsAlertas} /> */}
        <Bar data={alertBarChartDataTemp} options={optionsAlertas} />
      </div>
    </div>
  );
};

export default GraficoGral;
