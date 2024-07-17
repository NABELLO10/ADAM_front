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
const GraficoTablet = ({camionSeleccionado, empresaSistema, id_transportista}) => {

  const [desde, setDesde] = useState(format(new Date(), "yyyy-MM-dd"));
  const [hasta, setHasta] = useState(format(new Date(), "yyyy-MM-dd"));
  
  const [datosOX, setDatosOx] = useState([]);
  const [log, setLog] = useState([]);

  useEffect(() => {
    DatosOx()    
    obtenerLog()
  },[camionSeleccionado, desde, hasta])

  
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
      const { data } = await clienteAxios.get(`/general/datos-tablet-fechas/${camionSeleccionado.PATENTE}/${desde}/${hasta}`, config);

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
       
       const { data } = await clienteAxios.get(`/general/obtenerLogTablet/${camionSeleccionado.PATENTE.replace(/-/g, '').toUpperCase()}/${desde}/${hasta}`, config);  
    
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
  const alertsForTemperature = alertsCountByDateAndType.filter(alert => alert.type === "Temperatura TABLET fuera de límites");
  const alertsForOxygenation = alertsCountByDateAndType.filter(alert => alert.type === "Oxigenación TABLET fuera de límites");
  
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
    if (camionSeleccionado.PATENTE && data.PATENTE !== camionSeleccionado.PATENTE) {
      return false;
    }
    const date = moment.tz(data.DATE, 'America/Santiago').format('YYYY--MM-DD');

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
    labels: filteredData.map(data => data.DATE),
    datasets: [
      {
        label: 'OX1',
        data: filteredData.map(data => data.O1),
        fill: false,
        borderColor: 'gray',
        tension: 0.2,    
      },
      {
        label: 'OX2',
        data: filteredData.map(data => data.O2),
        fill: false,
        borderColor: 'black',
        tension: 0.2    
      },
      {
        label: 'OX3',
        data: filteredData.map(data => data.O3),
        fill: false,
        borderColor: 'MediumVioletRed',
        tension: 0.2
      },
      {
        label: 'OX4',
        data: filteredData.map(data => data.O4),
        fill: false,
        borderColor: 'green',
        tension: 0.2
      },
      {
        label: 'OX5',
        data: filteredData.map(data => data.O5),
        fill: false,
        borderColor: 'DarkBlue',
        tension: 0.5
      },
      {
        label: 'OX6',
        data: filteredData.map(data => data.O6),
        fill: false,
        borderColor: 'Olive',
        tension: 0.2
      },
      {
        label: 'OX7',
        data: filteredData.map(data => data.O7),
        fill: false,
        borderColor: 'DarkRed',
        tension: 0.2
      },
      {
        label: 'OX8',
        data: filteredData.map(data => data.O8),
        fill: false,
        borderColor: 'Darkorange',
        tension: 0.2
      },
      {
        label: 'OX9',
        data: filteredData.map(data => data.O9),
        fill: false,
        borderColor: 'Indigo',
        tension: 0.2
      },
      {
        label: 'OX10',
        data: filteredData.map(data => data.O10),
        fill: false,
        borderColor: 'DarkYellow',
        tension: 0.2
      },
     
      // Repetir para cada sensor OX necesario...
    ]
  };


  const tempChartData = {
    labels: filteredData.map(data => data.DATE),
    datasets: [
      {
        label: 'Temperatura',
        data: filteredData.map(data => data.TEMP),
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
          <h2 className="text-lg mx-2  font-semibold mt-2">
            Oxigenación / {camionSeleccionado.PATENTE}
          </h2>

        <RptOx tipo={"Tablet"}  data={datosOX} nombrePdf={"Oxigenación"} /> 

        </div>

        <Line data={lineChartData} options={options} />
      </div>
      <div className="mt-4">
        <div className="flex justify-between">
          <h2 className="text-lg mx-2  font-semibold mt-2">
            Alertas OX / {camionSeleccionado.PATENTE}
          </h2>

          <RptAlertas data={log} nombrePdf={"Alertas"}  tipo ={"Oxigenación TABLET fuera de límites"} /> 
        </div>

        {/*    <Line data={alertBarChartDataTemp} options={optionsAlertas} /> */}
        <Bar data={alertBarChartDataOX} options={optionsAlertas} />
      </div>


       <div className="mt-4">
        <div className="flex justify-between">
          <h2 className="text-lg mx-2  font-semibold mt-2">
            Temp / {camionSeleccionado.PATENTE}
          </h2>
          <RptTemp data={datosOX} tipo={"Tablet"} nombrePdf={"Temperatura"} />           
        </div>
   
        <Line data={tempChartData} options={options} />
      </div>

    {/*   <div className="mt-4">
        <div className="flex justify-between">
          <h2 className="text-lg font-semibold mt-2">
            Alertas T° / {camionSeleccionado.PATENTE}
          </h2>

          <RptAlertas data={log} nombrePdf={"Alertas"} tipo ={"Temperatura GPS fuera de límites"} /> 
        </div>       
        <Bar data={alertBarChartDataTemp} options={optionsAlertas} />
      </div>  */}
    </div>
  );
};

export default GraficoTablet;
