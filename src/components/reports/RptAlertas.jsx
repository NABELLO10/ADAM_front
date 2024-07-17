// src/components/RptAlertas.js
import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Tooltip from '@mui/material/Tooltip';
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';
import moment from 'moment-timezone';

const RptAlertas = ({ data, nombrePdf, tipo }) => {  
  
  
    const filteredData = data.filter(r => r.tipo == tipo).map(item => {
      // Parseamos la cadena JSON para convertirla en un objeto JavaScript
      const detalleObj = JSON.parse(item.detalle);
  
      // Transformamos el objeto en un array de cadenas "clave: valor"
      const detalleArray = Object.entries(detalleObj).map(([key, value]) => `${key}: ${value}`);
  
      // Unimos el array en una única cadena con comas y espacio como separador
      const detalleComoString = detalleArray.join(", ");
  
      return {
        'Patente': item.patente,
        'Fecha Registro': moment.tz(item.fec_add, 'America/Santiago').format('YYYY-MM-DD HH:mm:ss'),
        'Tipo': item.tipo,
        'Detalle': detalleComoString, // Cadena con claves y valores
      };
    });


  
    const handleDownloadExcel = () => {
      const ws = XLSX.utils.json_to_sheet(filteredData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${nombrePdf}.xlsx`);
    };
  
    return (
      <div className="flex justify-end gap-1">
        <Tooltip title="Descargar">
          <button
                 className="bg-green-900 hover:bg-green-700 transition-all rounded-md duration-200 px-3 text-xs text-white"
            onClick={handleDownloadExcel}
          >
            <DownloadTwoToneIcon/>
          </button>
        </Tooltip>
      </div>
    );
  };
  
  export default RptAlertas;
  
  