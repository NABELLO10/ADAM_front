// src/components/DownloadButton.js
import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Tooltip from '@mui/material/Tooltip';
import PictureAsPdfSharpIcon from '@mui/icons-material/PictureAsPdfSharp';

const DownloadButton = ({ data, nombrePdf, item }) => {

  const handleDownloadPDF = () => {
    const pdf = new jsPDF();
    pdf.autoTable({ html: '#table' });
    pdf.save(nombrePdf + '.pdf');
  };

  const handleDownloadExcel = () => {
    // Mapea el array de data para obtener solo los campos que deseas
    let filteredData = ([])

    if(item == 1){
          filteredData = data.map(item => ({
        patente: item.nom_patente,  
        id_ceiba: item.device_id,    
        revision : item.fec_rev_tecnica,
        permiso : item.fec_per_circulacion,
        seguro : item.fec_seguro        
    }));

    }
 

    // Luego procede con el código original
    const ws = XLSX.utils.json_to_sheet(filteredData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, nombrePdf + ".xlsx");
};

  return (
    <div className="flex gap-1">
      <Tooltip title="Descargar Excel">
      <button
        className="bg-green-900 hover:bg-green-700 transition-all rounded-md duration-200 px-6 text-xs "
        onClick={handleDownloadExcel}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="icon icon-tabler icon-tabler-file-spreadsheet"
          width="32"
          height="32"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#7bc62d"
          fill="none"
   
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
          <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
          <path d="M8 11h8v7h-8z" />
          <path d="M8 15h8" />
          <path d="M11 11v7" />
        </svg>
      </button>
      </Tooltip>
  {/*     <Tooltip title="Descargar PDF">
      <button
        className="bg-red-900 text-white hover:bg-red-700 rounded-md transition-all duration-200 px-6 text-xs"
        onClick={handleDownloadPDF}
      >
        <PictureAsPdfSharpIcon />
      </button>
      </Tooltip> */}
    </div>
  );
};

export default DownloadButton;
