import React, { useState, useEffect } from "react";
import { TextField, Pagination } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import moment from "moment";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import FileDownloadTwoToneIcon from "@mui/icons-material/FileDownloadTwoTone";

const itemsPerPage = 10;

const GestionUnificada = () => {
  const { auth } = useAuth();
  const [alerts, setAlerts] = useState([]);
  const [filteredAlerts, setFilteredAlerts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todas");
  const [startDateFilter, setStartDateFilter] = useState(moment().format("YYYY-MM-DD"));
  const [endDateFilter, setEndDateFilter] = useState(moment().format("YYYY-MM-DD"));
  const [estados, setEstados] = useState([]);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState({});
  const [isHowen, setIsHowen] = useState(false);
  const [urlEvidencia, setUrlEvidencia] = useState([]);

  const fetchInitialData = async () => {
    await fetchEstados();
    await fetchAlerts();
  };

  const fetchEstados = async () => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };
    const { data } = await clienteAxios("/adam/estadoAlarma", config);
    setEstados(data);
  };

  const fetchAlerts = async () => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;

    const config = { headers: { Authorization: `Bearer ${token}` } };

    const [howenResponse, adamResponse] = await Promise.all([
      clienteAxios.get(`/general/obtenerAlertasHOWEN/${startDateFilter}/${endDateFilter}`, config),
      clienteAxios.get(`/adam/alarmasCeiba/${startDateFilter}/${endDateFilter}`, config),
    ]);

    const howenAlerts = howenResponse.data.map((alert) => ({
      ...alert,
      source: "HOWEN",
    }));
    const adamAlerts = adamResponse.data.map((alert) => ({
      ...alert,
      source: "ADAM",
    }));

    const combinedAlerts = [...howenAlerts, ...adamAlerts].sort(
      (a, b) => new Date(b.inicio || b.reportTime) - new Date(a.inicio || a.reportTime)
    );

    setAlerts(combinedAlerts);
    setFilteredAlerts(combinedAlerts);
  };

  const fetchEvidencia = async (id) => {
    const token = localStorage.getItem("token_adam");
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await clienteAxios.get(
      isHowen
        ? `/general/obtenerEvidenciaUnidadHOWEN/${id}`
        : `/adam/obtenerDetalleGestion/${id}`,
      config
    );
    setUrlEvidencia(response.data || []);
  };

  const handleFilter = (status) => {
    setStatusFilter(status);
    filterAlerts(status, searchTerm);
    setCurrentPage(1);
  };

  const filterAlerts = (status, term) => {
    let filtered = alerts;

    if (status !== "Todas") {
      filtered = filtered.filter((alert) => alert.estado == status.id);
    }

    if (term) {
      filtered = filtered.filter((alert) =>
        [alert.unidad, alert.nom_tipo_alarma, alert.id_ceiba].some((field) =>
          field?.toLowerCase().includes(term.toLowerCase())
        )
      );
    }

    setFilteredAlerts(filtered);
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    filterAlerts(statusFilter, value);
    setCurrentPage(1);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const openModal = (alert) => {
    console.log(alert)

    setSelectedAlert(alert);
    setIsHowen(alert.source === "HOWEN");

    fetchEvidencia(alert.guid || alert.id_ceiba);

    
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleExportToExcel = () => {
    const dataForExcel = filteredAlerts.map((alert) => ({
      Id: alert.id_ceiba,
      Origen: alert.source,
      Alarma: alert.nom_tipo_alarma,
      Unidad: alert.unidad,
      "Fecha Alerta": moment(alert.inicio || alert.reportTime).format("DD-MM-YYYY HH:mm:ss"),
      Estado:
        estados.find((status) => status.id === alert.estado)?.nombre_estado || alert.estado,
    }));

    const ws = XLSX.utils.json_to_sheet(dataForExcel);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Alertas");
    XLSX.writeFile(wb, "Reporte_de_Alertas.xlsx");
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const paginatedAlerts = filteredAlerts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="mx-auto relative">
      <div className="text-center font-bold text-xl pb-3 text-blue-900">Gestión Unificada</div>

      <div className="flex justify-around items-center mb-4">
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
              ? "bg-blue-950 text-white"
              : "bg-gray-400 text-black"
          } hover:opacity-75`}
          onClick={() => handleFilter("Todas")}
        >
          <h2 className="text-xl">Todas</h2>
          <h3 className="text-3xl font-bold">{alerts.length}</h3>
        </div>
      </div>

      <div className="flex mb-2 space-x-4 justify-end">
        <input
          type="text"
          placeholder="Buscar..."
          className="p-2 border rounded w-5/12"
          value={searchTerm}
          onChange={handleSearch}
        />
        <div className="flex space-x-4">
          <input
            type="date"
            className="p-2 border rounded "
            value={startDateFilter}
            onChange={(e) => setStartDateFilter(e.target.value)}
          />
          <input
            type="date"
            className="p-2 border rounded"
            value={endDateFilter}
            onChange={(e) => setEndDateFilter(e.target.value)}
          />
        </div>
        <div>
          <button
            className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 mt-1 px-2 rounded"
            onClick={handleExportToExcel}
          >
            <FileDownloadTwoToneIcon />
          </button>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-xl text-sm">
          <thead className="bg-blue-950 text-white">
            <tr>
              <th className="py-2 px-4">Alarma</th>
              <th className="py-2 px-4">Unidad</th>
              <th className="py-2 px-4">Fecha Alerta</th>
              <th className="py-2 px-4">Estado</th>
              <th className="py-2 px-4">Origen</th>
              <th className="py-2 px-4"></th>
            </tr>
          </thead>
          <tbody className="text-center">
            {paginatedAlerts.map((alert) => (
              <tr
                key={alert.id}
                className={`hover:bg-gray-200 ${
                  alert.source === "HOWEN" ? "bg-blue-100" : "bg-red-100"
                }`}
              >
                <td className="py-2 px-4">{alert.nom_tipo_alarma}</td>
                <td className="py-2 px-4">{alert.unidad}</td>
                <td className="py-2 px-4">
                  {moment(alert.inicio || alert.reportTime).format("DD-MM-YYYY HH:mm:ss")}
                </td>
                <td className="py-2 px-4">
                  {estados.find((status) => status.id === alert.estado)?.nombre_estado ||
                    alert.estado}
                </td>
                <td className="py-2 px-4">{alert.source}</td>
                <td>
                  <button
                    onClick={() => openModal(alert)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
                  >
                    Ver
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination
          count={Math.ceil(filteredAlerts.length / itemsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
          variant="outlined"
          shape="rounded"
          className="mt-4"
        />
      </div>

      <Dialog open={modalIsOpen} onClose={closeModal} fullWidth maxWidth="lg">
        <DialogContent>
          {isHowen ? (
            urlEvidencia.map((evidencia, index) => (
              <div key={index}>
                <p>Unidad: {evidencia.deviceName}</p>
                <p>Fecha: {evidencia.fileStartTime}</p>
                <a href={evidencia.downUrl} target="_blank" rel="noopener noreferrer">
                  Ver Evidencia
                </a>
              </div>
            ))
          ) : (
            urlEvidencia.map((gestion, index) => (
              <div key={index}>
                <p>Detalle: {gestion.detalle}</p>
                <p>Estado: {gestion.id_estado}</p>
              </div>
            ))
          )}
        </DialogContent>
        <DialogActions>
          <button
            onClick={closeModal}
            className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Cerrar
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default GestionUnificada;
