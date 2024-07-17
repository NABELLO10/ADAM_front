// src/components/RptTemp.js
import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Tooltip from '@mui/material/Tooltip';
import moment from 'moment-timezone';
import DownloadTwoToneIcon from '@mui/icons-material/DownloadTwoTone';

const RptTemp = ({ data, nombrePdf, tipo }) => {
  let filteredData = []

  if(tipo == "Tablet"){
    filteredData = data.map(item => ({
      'Patente': item.PATENTE,
      'Fecha del GPS': item.fec_add,
      'Fecha Registro': item.DATE + " " + item.TIME,
      'Temp': item.TEMP,
    }));
  }

  if(tipo == "GPS"){
    filteredData = data.map(item => ({
      'Patente': item.patente,
      'Fecha del GPS': item.fechaGPS,
      'Fecha Registro': moment.tz(item.fechaRegistro, 'America/Santiago').format('YYYY-MM-DD HH:mm:ss'),
      'Temp': item.temp,
    }));
  }
  

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

export default RptTemp;
