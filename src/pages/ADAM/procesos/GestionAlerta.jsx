import React, { useState, useEffect } from "react";
import { msgError, msgInfo, msgOk, msgWarning } from "../../../components/Alertas";
import clienteAxios from "../../../config/axios";
import useAuth from "../../../hooks/useAuth";
import { TextField, Chip, Autocomplete } from "@mui/material";
import { Bar } from "react-chartjs-2";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import EmailIcon from "@mui/icons-material/Email";


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import * as XLSX from "xlsx";

import Pagination from "@mui/material/Pagination";
import "tailwindcss/tailwind.css";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet.heat";
import FileDownloadTwoToneIcon from "@mui/icons-material/FileDownloadTwoTone";
import ThumbUpAltTwoToneIcon from "@mui/icons-material/ThumbUpAltTwoTone";
import ThumbDownTwoToneIcon from "@mui/icons-material/ThumbDownTwoTone";

const itemsPerPage = 10;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const GestionAlerta = () => {
  const { auth } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [contactos, setContactos] = useState([]);
  const [detalleGestion, setDetalleGestion] = useState("");
  const [estadoGestion, setEstadoGEstion] = useState("");
  const [gestionada, setGestionada] = useState(false);
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [estados, setEstados] = useState([]);
  const [tiposAlarma, setTiposAlarmas] = useState([]);
  const [gestiones, setGestiones] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedUrl, setSelectedUrl] = useState({});
  const [infoUnidad, setInfoUnidad] = useState({});
  const [transportistasUsuarios, setTransportistasUsuarios] = useState([]);
  const [ver, setVer] = useState(false);
  const [selectedTransportista, setSelectedTransportista] = useState();
  const [lastAlertDate, setLastAlertDate] = useState(null);
  const [loadVideo, setLoadVideo] = useState(false);
  
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(today.getDate());
  const [startDateFilter, setStartDateFilter] = useState(
    startDate.toISOString().split("T")[0]
  );
  const [endDateFilter, setEndDateFilter] = useState(
    today.toISOString().split("T")[0]
  );

  const openModal = (url) => {
    setVer(false);
    setSelectedUrl(url);
    obtenerInfoUnidad(url.serie);
    setModalIsOpen(true);
    limpiarFormulario();
    setEstadoGEstion("");
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setGestionada(false);
    setSelectedUrl("");
    obtenerAlarmasCeiba();
  };

  const openViewModal = async (url) => {
    setVer(true);
    setSelectedUrl(url);
    await obtenerDetalleGestion(url.id_ceiba); // Espera la obtención de los datos
    setModalIsOpen(true);
  };

  const cargarTransportistasUsuario = async (usuarioId) => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await clienteAxios.get(`/general/usuarios_transportistas/${usuarioId}`, config);
      // Asumiendo que la API devuelve un array de transportistas con estructura { id, nombre }
      const transportistasAsociados = data.map(t => ({
        value: t.id_transportista,
        label: t.mae_transportista.nombre + " " + t.mae_transportista.ape_paterno + " " + t.mae_transportista.ape_materno
      }));
      setTransportistasUsuarios([...transportistasAsociados]);
    } catch (error) {
      console.error('Error cargando transportistas del usuario:', error);
    }
  };

  const obtenerInfoUnidad = async (id) => {
    if (!id) return;

    const token = localStorage.getItem("token_adam");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios.get(`/general/infoUnidad/${id}`, config);

    if (data.id_transportista != null) {
      cargarContactos(data.id_transportista);
    } else {
      setContactos([]);
    }

    setInfoUnidad(data);
  };

  const cargarContactos = async (id) => {
    if (!id) return;

    const token = localStorage.getItem("token_adam");
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios.get(`/adam/contacto/${id}`, config);
    console.log(data);
    setContactos(data);
  };

  const obtenerEstados = async () => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await clienteAxios("/adam/estadoAlarma", config);
      setEstados(data);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerTiposAlarma = async () => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await clienteAxios("/adam/tipoAlertas", config);
      setTiposAlarmas(data);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerAlarmasCeiba = async () => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;
  
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
  
    try {
      const { data } = await clienteAxios.get(
        `/adam/alarmasCeiba/${startDateFilter}/${endDateFilter}`,
        config
      );
/*   
      if (data.length > 0) {
        const latestAlert = data.reduce((max, alert) =>
          new Date(alert.inicio) > new Date(max.inicio) ? alert : max,
          data[0]
        );
  
        if (!lastAlertDate || new Date(latestAlert.inicio) > new Date(lastAlertDate)) {        
          showNotification('Se ha detectado una nueva alerta : ' + latestAlert.id_ceiba);
          setLastAlertDate(latestAlert.inicio);
        }
      } */
 
      setAlerts(data);
      filterAlerts(data, statusFilter, searchTerm, selectedTransportista);
    } catch (error) {
      console.log(error);
    }
  };

  
  const showNotification = (message) => {
    if (Notification.permission === 'granted') {
      new Notification('Nueva Alerta', { body: message });
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification('Nueva Alerta', { body: message });
        }
      });
    }
  };

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    obtenerAlarmasCeiba();
  
    const intervalId = setInterval(() => {
      obtenerAlarmasCeiba();
    }, 60000); // 60000 ms = 1 minuto
  
    return () => clearInterval(intervalId); // Limpia el intervalo al desmontar el componente
  }, [startDateFilter, endDateFilter, statusFilter, searchTerm, selectedTransportista]);



  

  const obtenerDetalleGestion = async (id) => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const { data } = await clienteAxios.get(
        `/adam/obtenerDetalleGestion/${id}`,
        config
      );

      setGestiones(data);
   
    } catch (error) {
      console.log(error);
    }
  };

  const gestionarAlerta = async (
    id_estado,
  ) => {
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

      const { data } = await clienteAxios.post(
        `/adam/gestionAlerta/${selectedUrl.id}`, // Incorporando el parámetro en la URL
        {
          id_estado          
        },
        config
      );

      setEstadoGEstion(id_estado)
      setGestionada(true);
      obtenerAlarmasCeiba()
      msgOk(data.msg);

    } catch (error) {
      msgError(error.response.data.msg);
    }
  };


  const limpiarFormulario = () => {
    setDetalleGestion("");
  };


  const filterAlerts = (alerts, status, term, transportista) => {

    console.log(alerts)

    let filtered = alerts;

    if (status !== "Todas") {
      filtered = filtered.filter((alert) => alert.estado == status.id);
    }

    if (term) {
      filtered = filtered.filter(
        (alert) =>
          alert.unidad.toLowerCase().includes(term.toLowerCase()) ||
          alert.nom_tipo_alarma.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    if (transportista && transportista.value) {
      filtered = filtered.filter((alert) => alert.id_transportista == transportista.value);
    }

    setFilteredAlerts(filtered);
  };


  useEffect(() => {
    obtenerEstados();
    obtenerTiposAlarma();
    cargarTransportistasUsuario(auth.id);
  }, []);

  
  const handleFilter = (status) => {
    setStatusFilter(status);
    filterAlerts(alerts, status, searchTerm, selectedTransportista);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterAlerts(alerts, statusFilter, value, selectedTransportista);
    setCurrentPage(1);
  };

  const handleStartDateChange = (e) => {
    setStartDateFilter(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDateFilter(e.target.value);
  };

  const handleTransportistaChange = (event, value) => {
    setSelectedTransportista(value);


    filterAlerts(alerts, statusFilter, searchTerm, value);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredAlerts.length / itemsPerPage);
  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Datos para el gráfico de barras
  const barChartData = {
    labels: tiposAlarma.map((tipo) => tipo.nombre_tipo_alarma),
    datasets: [
      {
        label: "Cantidad de Alertas",
        data: tiposAlarma.map(
          (tipo) =>
            filteredAlerts.filter((alert) => alert.tipo_alarma === tipo.id_tipo)
              .length
        ),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Datos para el gráfico de ranking de unidades
  const unitRankingData = filteredAlerts.reduce((acc, alert) => {
    const unitName = alert.unidad;
    if (!acc[unitName]) {
      acc[unitName] = 0;
    }
    acc[unitName]++;
    return acc;
  }, {});

  const sortedUnits = Object.keys(unitRankingData)
    .sort((a, b) => unitRankingData[b] - unitRankingData[a])
    .slice(0, 10);
  const rankingChartData = {
    labels: sortedUnits,
    datasets: [
      {
        label: "Cantidad de Alertas",
        data: sortedUnits.map((unit) => unitRankingData[unit]),
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  const handleSendWhatsApp = async (contacto) => {
try {
    const token = localStorage.getItem("token_adam");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      await clienteAxios.post(
        `/adam/detalleGestion/${selectedUrl.id}`, // Incorporando el parámetro en la URL
        {
          id_estado : estadoGestion,
          usr_gestion: auth.nom_usuario,
          detalle: detalleGestion,
          nom_contacto : contacto.nom_contacto,
          fono_contacto : contacto.fono,
          mail_contacto : contacto.mail,
          id_alarma_ceiba: selectedUrl.id_ceiba,
          tipo_notificacion : "WhatsApp"
        },
        config
      );

      msgOk(data.msg);

    } catch (error) {
      console.log(error);
    }

    // Formatear la fecha a un formato legible
    const fechaFormateada = new Date(selectedUrl.inicio).toLocaleString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // Construir el mensaje
    const mensaje = `*Alerta ADAM*\n\n*Tipo de Alerta:* ${selectedUrl.nom_tipo_alarma}\n*Unidad:* ${selectedUrl.unidad}\n*Fecha y Hora:* ${fechaFormateada}\n*ID de Alerta:* ${selectedUrl.id_ceiba}\n\n*Detalle:* ${detalleGestion}\n\nVer Evidencia: ${selectedUrl.url_evidencia}`;
    const phone = contacto.fono.replace(/[^\d]/g, ""); // Formatear el número de teléfono

    // Copiar mensaje al portapapeles
    navigator.clipboard.writeText(mensaje).then(() => {
      // Acortar la URL usando tinyurl.com
      fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(selectedUrl.url_evidencia)}`)
        .then((response) => response.text())
        .then((shortUrl) => {
          const mensajeConShortUrl = mensaje.replace(selectedUrl.url_evidencia, shortUrl);
          const url = `https://wa.me/${phone}?text=${encodeURIComponent(mensajeConShortUrl)}`;
          window.open(url, "_blank");
        })
        .catch((err) => {
          console.error('Error al acortar la URL:', err);
        });
    }).catch((err) => {
      console.error('Error al copiar al portapapeles:', err);
    });
  };

  const handleSendEmail = async (contacto) => {
    try {

      const token = localStorage.getItem("token_adam");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.post(
        `/general/enviarCorreoAlerta/`, // Incorporando el parámetro en la URL
        {
          contacto,
          alerta: selectedUrl,
          detalle: detalleGestion,
        },
        config
      );

      await clienteAxios.post(
        `/adam/detalleGestion/${selectedUrl.id}`, // Incorporando el parámetro en la URL
        {
          id_estado : estadoGestion,
          usr_gestion: auth.nom_usuario,
          detalle: detalleGestion,
          nom_contacto : contacto.nom_contacto,
          fono_contacto : contacto.fono,
          mail_contacto : contacto.mail,
          id_alarma_ceiba: selectedUrl.id_ceiba,
          tipo_notificacion : "Mail"
        },
        config
      );

      msgOk(data.msg);

    } catch (error) {
      console.log(error);
    }
  };

  const handleExportToExcel = () => {
    // Crear un array que contenga sólo la información necesaria para el Excel
    const dataForExcel = filteredAlerts.map((alert) => ({
      Alarma: alert.nom_tipo_alarma,
      Unidad: alert.unidad,
      "Fecha Alerta": alert.inicio,
      Estado:
        estados.find((status) => status.id == alert.estado)?.nombre_estado ||
        alert.estado,
    }));

    // Convertir los datos a una hoja de trabajo de Excel
    const ws = XLSX.utils.json_to_sheet(dataForExcel);

    // Crear un nuevo libro de trabajo y añadir la hoja de trabajo
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alertas");

    // Escribir el archivo y ofrecerlo para descargar
    XLSX.writeFile(wb, "Reporte_de_Alertas.xlsx");
  };

  return (
    <div className="mx-auto relative">
      
      <div className="flex justify-around items-center mb-1">
        {estados.map((status) => (
          <div
            key={status.id}
            className={`flex-1 p-4 m-2 text-center cursor-pointer rounded-lg shadow-xl ${
              statusFilter.id == status.id ? "bg-blue-200" : "bg-white"
            } hover:opacity-75`}
            onClick={() => handleFilter(status)}
          >
            <h2 className="text-xl">{status.nom_kpi}</h2>
            <h3 className="text-3xl font-bold">
              {alerts.filter((alert) => alert.estado == status.id).length}
            </h3>
          </div>
        ))}
        <div
          className={`flex-1 p-4 m-2 text-center shadow-xl cursor-pointer rounded-lg ${
            statusFilter === "Todas"
              ? "bg-gray-800 text-white"
              : "bg-gray-400 text-black"
          } hover:opacity-75`}
          onClick={() => handleFilter("Todas")}
        >
          <h2 className="text-xl">Todas</h2>
          <h3 className="text-3xl font-bold">{alerts.length}</h3>
        </div>
      </div>
      <div className="flex mb-2 space-x-4">
        <div className="w-5/12 bg-white">
          <Autocomplete
            options={transportistasUsuarios}
            getOptionLabel={(option) => option.label}
            value={selectedTransportista}
            className="bg-white"
            onChange={handleTransportistaChange}
            renderInput={(params) => (
              <TextField {...params} label="Filtrar por Transportista" variant="outlined" />
            )}
          />
        </div>      
        <input
          type="text"
          placeholder="Buscar unidad..."
          className="p-2 border rounded"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="flex space-x-4">
          <input
            type="date"
            className="p-2 border rounded"
            value={startDateFilter}
            onChange={handleStartDateChange}
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={endDateFilter}
            onChange={handleEndDateChange}
          />
        </div>
        <div>
          <button
            className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 mt-1 px-2 rounded"
            onClick={handleExportToExcel}
          >
            <FileDownloadTwoToneIcon />
          </button>
        </div>
      </div>
      
      <div className="mb-0 bg-red">
        <div className="w-12/12 overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg shadow-xl text-sm">
            <thead className="bg-red-700 text-white">
              <tr>
                <th className="py-2 px-4">Alarma</th>
                <th className="py-2 px-4">Unidad</th>
                <th className="py-2 px-4">Transportista</th>
                <th className="py-2 px-4">Fecha Alerta</th>
                <th className="py-2 px-4">Estado</th>
                <th className="py-2 px-4"></th>
              </tr>
            </thead>
            <tbody className="text-center">
              {paginatedAlerts.map((alert) => (
                <tr key={alert.id} className="hover:bg-gray-200">
                  <td className="py-2 px-4 font-bold">
                    <span>
                      {alert.id_ceiba + " | " + alert.nom_tipo_alarma}
                    </span>
                  </td>
                  <td className="py-2 px-4">{alert.unidad}</td>
                  <td className="py-2 px-4">{alert.transportista_nombre}</td>
                  <td className="py-2 px-4">{alert.inicio}</td>
                  <td className="py-2 px-4 font-semibold">
                    <span>
                      {estados.find((status) => status.id == alert.estado)
                        ?.nom_kpi || alert.estado}
                    </span>
                  </td>

              

                  <td className="space-x-2 text-center">
                    {alert.estado == 8 && (
                      <button
                        className="bg-red-950 hover:bg-red-900 text-white font-semibold py-2 px-4 rounded"
                        onClick={() => {
                          openModal(alert);
                        }}
                      >
                        Gestionar
                      </button>
                    )}
                    {(alert.estado == 9 || alert.estado == 10) && (
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                        onClick={() => {
                          openViewModal(alert);
                        }}
                      >
                        Ver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center mt-4">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              variant="outlined"
              shape="rounded"
            />
          </div>
        </div>
      </div>

      <Dialog
        fullWidth={true}
        maxWidth={"xl"}
       /*  PaperProps={{
          style: {
            height: "10vh", // Ajusta la altura según tus necesidades
          },
        }} */
        open={modalIsOpen}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
         <iframe
            src={selectedUrl.url_evidencia}
            title="Evidencia"
            width="100%"
            height="100%"
          ></iframe>  
     
        </DialogContent>
        <DialogActions>
          {!ver ? (
            <div className="bg-gray-300 w-full">
              <div className="justify-center flex p-3">
                <div className="gap-10 flex mb-2 items-center">
                  <span className="text-red-900 font font-semibold">
                    ID:{" "}
                    <span className="text-red-500">{selectedUrl.id_ceiba}</span>{" "}
                  </span>

                  <span className="text-red-900 font font-semibold">
                    Alerta:{" "}
                    <span className="text-red-500">
                      {selectedUrl.nom_tipo_alarma}
                    </span>{" "}
                  </span>
                  <span className="text-red-900 font font-semibold">
                    Unidad:{" "}
                    <span className="text-red-500">{selectedUrl.unidad}</span>{" "}
                  </span>
                  <span className="text-red-900 font font-semibold">
                    Fecha:{" "}
                    <span className="text-red-500">{selectedUrl.inicio}</span>{" "}
                  </span>
                  <span className="text-red-900 font">
                    <textarea
                      onChange={(e) => setDetalleGestion(e.target.value)}
                      className="w-80 flex items-center rounded-lg  text-md px-2  text-gray-500 bg-white"
                      placeholder="Detalle gestión..."
                    ></textarea>
                  </span>
                  <span className="text-red-900 font font-semibold">
                    {!gestionada && (
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => gestionarAlerta(9)}
                          className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                        >
                          <ThumbUpAltTwoToneIcon />
                        </button>
                        <button
                          onClick={() => gestionarAlerta(10)}
                          className="bg-red-800 text-white p-2 rounded hover:bg-red-700"
                        >
                          <ThumbDownTwoToneIcon />
                        </button>
                      </div>
                    )}
                  </span>
                  <a href={selectedUrl.url_evidencia} className="bg-blue-700 text-white p-2 rounded-md hover:bg-blue-600" target="_blank" >Ver Evidencia</a>
     

                </div>
              </div>

              {contactos.length > 0 ? (
                <div>
                  <table className="min-w-full bg-white  rounded-lg shadow-md text-sm">
                    <thead className="bg-red-900 text-white">
                      <tr>
                        <th className="py-1 px-4">Nombre Contacto</th>
                        <th className="py-1 px-4">Fono</th>
                        <th className="py-1 px-4">Email</th>
                        <th className="py-1 px-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactos.map((contacto) => (
                        <tr
                          key={contacto.id}
                          className="hover:bg-gray-300 bg-white text-gray-800 font-semibold"
                        >
                          <td className=" px-4">{contacto.nom_contacto}</td>
                          <td className=" px-4">{contacto.fono}</td>
                          <td className=" px-4">{contacto.mail}</td>

                          <td className=" px-4 p-1 text-center">
                            {gestionada && (
                              <div className="flex gap-2 justify-center">
                                <button
                                  className="bg-green-600 text-white p-2 rounded hover:bg-green-700"
                                  onClick={() => handleSendWhatsApp(contacto)}
                                >
                                  <WhatsAppIcon />
                                </button>
                                <button
                                  className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                                  onClick={() => handleSendEmail(contacto)}
                                >
                                  <EmailIcon />
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <span className="flex justify-center items-end mt-2 text-gray-800 font-bold">
                  Sin Contactos Registrados
                </span>
              )}

              <div>
                <div className="flex justify-end mt-10 p-3 gap-2 items-start">
                  <div className="flex gap-2">
                    <button
                      onClick={closeModal}
                      className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-500 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>


          ) : gestiones.length > 0 ? (
            <div className=" text-xs text-center justify-center w-full mx-2 mb-2">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-100 border border-gray-200 ">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">ID</th>
                      <th className="py-2 px-4 border-b">ID Estado</th>
                      <th className="py-2 px-4 border-b">Usuario Gestión</th>
                      <th className="py-2 px-4 border-b">Detalle</th>
                      <th className="py-2 px-4 border-b">Nombre Contacto</th>
                      <th className="py-2 px-4 border-b">Fono Contacto</th>
                      <th className="py-2 px-4 border-b">Mail Contacto</th>

                      <th className="py-2 px-4 border-b">Tipo Notificación</th>
                      <th className="py-2 px-4 border-b">Fecha Registro</th>
                      
                    </tr>
                  </thead>
                  <tbody>
                    {gestiones.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-200">
                        <td className="py-2 px-4 border-b">
                          {item.id_alarma_ceiba}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {item.id_estado == 9 ? "Gestionada" : "No Gestionada"}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {item.usr_gestion}
                        </td>
                        <td className="py-2 px-4 border-b">{item.detalle}</td>
                        <td className="py-2 px-4 border-b">
                          {item.nom_contacto}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {item.fono_contacto}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {item.mail_contacto}
                        </td>

                        <td className="py-2 px-4 border-b">
                          {item.tipo_notificacion}
                        </td>
                        <td className="py-2 px-4 border-b">
                          {new Date(item.createdAt).toLocaleString()}
                        </td>
                      
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div>
                <div className="flex justify-end mt-2 gap-2 items-start">
                  <div className="flex gap-2">
                    <button
                      onClick={closeModal}
                      className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-500 active:shadow-lg transition duration-150 ease-in-out"
                    >
                      Cerrar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full text-center">
              
          
<a href={selectedUrl.url_evidencia} className="bg-blue-700 text-white p-3 rounded-md hover:bg-blue-600" target="_blank" >Ver Evidencia</a>
     


              <div className="w-full text-center font-semibold my-5">
                <span className=" text-red-700">Sin Gestiones</span>
                
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={closeModal}
                  className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-500 active:shadow-lg transition duration-150 ease-in-out"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </DialogActions>
      </Dialog>

      <div className="container mx-auto px-4 py-4">
        <div className="gap-4">
          <div className="w-12/12 h-56 mb-20">
            <h2 className="text-lg font-bold mb-4">Top 10 alarmas</h2>
            <Bar
              data={rankingChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
          <div className="w-12/12 h-96">
            <h2 className="text-lg font-bold mb-4">Total alarmas por tipo</h2>
            <Bar
              data={barChartData}
              options={{ responsive: true, maintainAspectRatio: false }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GestionAlerta;
