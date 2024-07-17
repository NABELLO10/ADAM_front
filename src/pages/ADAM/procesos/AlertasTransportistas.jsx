import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import EditNoteTwoToneIcon from "@mui/icons-material/EditNoteTwoTone";
import DeleteTwoToneIcon from "@mui/icons-material/DeleteTwoTone";
import clienteAxios from "../../../config/axios";
import { msgError, msgOk } from "../../../components/Alertas";
import Select1 from "react-select";
import ContactosTransportista from "../procesos/ContactosTransportistas";

const TransportistasAlertas = () => {
  const [selectedTransportista, setSelectedTransportista] = useState("");
  const [selectedAlertas, setSelectedAlertas] = useState([]);
  const [transportistas, setTransportistas] = useState([]);
  const [alertasTransportistas, setAlertasTransportistas] = useState([]);
  const [TipoAlerta, setTipoAlerta] = useState([]);
  const [relaciones, setRelaciones] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [idDelete, setIdDelete] = useState("");

  const handleTransportistaChange = (event) => {
    setSelectedTransportista(event.target.value);
  };

  useEffect(() => {
    obtenerTransportistas();
    obtenerTipoAlerta();
    obtenerRelaciones();
  }, []);

  const opcionesAlertas = TipoAlerta.map((t) => ({
    value: t.id_tipo,
    label: t.nombre_tipo_alarma,
  }));

  const obtenerTransportistas = async () => {
    const token = localStorage.getItem("token_adam");

    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios(
      `/general/obtenerTransportistas`,
      config
    );
    setTransportistas(data);
  };

  const obtenerRelaciones = async () => {
    const token = localStorage.getItem("token_adam");

    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios(
      `/general/obtenerAlarmasTransportistas`,
      config
    );

    setAlertasTransportistas(data);
    setRelaciones(data);
  };

  const obtenerTipoAlerta = async () => {
    try {
      const token = localStorage.getItem("token_adam");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios("/adam/tipoAlertas", config);
      const activas = data.filter((r) => r.est_activo === 1);

      setTipoAlerta(activas);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await registrar();

    const nuevaRelacion = {
      transportistaId: selectedTransportista,
      alertas: selectedAlertas,
    };

    const nuevaRelaciones = relaciones.map((relacion) =>
      relacion.transportistaId === selectedTransportista
        ? { ...relacion, alertas: selectedAlertas }
        : relacion
    );

    setRelaciones(nuevaRelaciones);

    clearForm();
  };

  const handleOpenDeleteDialog = (relacion) => {
    setIdDelete(relacion.transportista.id);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const { data } = await clienteAxios.delete(
      `/general/eliminarTrasnportistaAlerta/${idDelete}`,
      config
    );

    msgOk(data.msg);
    clearForm();
    handleCloseDeleteDialog();
  };

  const handleEdit = (relacion) => {
    setSelectedTransportista(relacion.transportista.id);
    cargarAlertasTransportistas(relacion.transportista.id);
  };

  const clearForm = () => {
    setSelectedTransportista("");
    setSelectedAlertas([]);
    obtenerRelaciones();
  };

  const cargarAlertasTransportistas = async (id) => {
    const token = localStorage.getItem("token_adam");
    if (!token) return;

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const { data } = await clienteAxios.get(
      `/general/obtenerAlarmasTransportista/${id}`,
      config
    );

    const alarmasAsociadas = data.flatMap((transportista) =>
      transportista.alarmas.map((alarma) => ({
        value: alarma.id_tipo_alarma,
        label: alarma.nombre_tipo_alarma,
      }))
    );

    console.log(alarmasAsociadas)

    setSelectedAlertas(alarmasAsociadas);
  };

  

  const registrar = async () => {
    if (!selectedTransportista || selectedAlertas.length === 0) {
      msgError("Ingrese todos los campos");
      return;
    }
  
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
  
      const alertasData = selectedAlertas.map((alerta) => ({
        value: alerta.value,  // Este debe ser el id_tipo_alarma
        label: alerta.label,
      }));

      console.log(alertasData)
  
      const { data } = await clienteAxios.post(
        "/general/registrarTransportistaAlerta",
        {
          id_transportista: selectedTransportista,
          alertas: alertasData,
        },
        config
      );
  
      msgOk(data.msg);
    } catch (error) {
      msgError(error.response.data.msg);
    }
  };
  
  const handleSelectChange = (selectedOptions) => {
    setSelectedAlertas(selectedOptions || []);
  };

  return (
    <div className="flex gap-2">
      <div className="w-8/12 p-5 bg-gray-50 rounded-lg shadow-md mt-3">
        <h2 className="text-xl font-bold text-red-900 mb-4">
          Configuración de Alertas para Transportistas
        </h2>

        <div className="lg:flex lg:gap-4 mt-4 justify-between">
          <div className="lg:w-5/12 w-full  border-r-4 p-4">
            {" "}
            <div className="flex-1">
              <FormControl fullWidth>
                <InputLabel id="transportista-label">Transportista</InputLabel>
                <Select
                  labelId="transportista-label"
                  id="transportista"
                  value={selectedTransportista}
                  label="Transportista"
                  onChange={handleTransportistaChange}
                >
                  <MenuItem value="0">
                    <em>Todos</em>
                  </MenuItem>
                  {transportistas.map((transportista) => (
                    <MenuItem key={transportista.id} value={transportista.id}>
                      {transportista.nombre +
                        " " +
                        transportista.ape_paterno +
                        " " +
                        transportista.ape_materno}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            <div className="flex-1 mt-4 mb-4 ">
              <span className="px-2 font-semibold  ">Alertas</span>
              <Select1
                isMulti
                labelId="alertas-label"
                name="tra"
                options={opcionesAlertas}
                className="basic-multi-select"
                classNamePrefix="select"
                onChange={handleSelectChange}
                value={selectedAlertas}
              />
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="py-2 px-4 bg-red-700 text-white font-bold rounded hover:bg-red-800"
                onClick={handleSubmit}
              >
                Guardar
              </button>
              <button
                className="py-2 px-4 bg-gray-500 text-white font-bold rounded hover:bg-gray-700"
                onClick={clearForm}
              >
                Cancelar
              </button>
            </div>
          </div>

          <div className="lg:w-7/12 w-full">
            <div className="mt-0">
              {alertasTransportistas.length > 0 &&
                alertasTransportistas.map((relacion, index) => (
                  <div
                    key={index}
                    className="p-3 mt-2 bg-gray-200 rounded shadow-sm border border-gray-300 flex justify-between items-center"
                  >
                    <div>
                      <span className="font-semibold text-blue-950">
                        {relacion.transportista.nombre}
                      </span>
                      <span className="text-blue-900 text-sm">
                        {relacion.alarmas.map((alerta, idx) => (
                          <li key={idx}>{alerta.nombre_tipo_alarma}</li>
                        ))}
                      </span>
                    </div>

                    <div>
                      <button
                        className="bg-blue-600 text-white p-1 rounded hover:bg-blue-800 mx-1"
                        onClick={() => handleEdit(relacion)}
                      >
                        <EditNoteTwoToneIcon />
                      </button>
                      <button
                        className="bg-red-500 text-white p-1 rounded hover:bg-red-700"
                        onClick={() => handleOpenDeleteDialog(relacion)}
                      >
                        <DeleteTwoToneIcon />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
          <DialogTitle>{"Confirmar Eliminación"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              ¿Estás seguro de que deseas eliminar esta relación? Esta acción no
              se puede deshacer.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDeleteDialog} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleDelete} color="primary" autoFocus>
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </div>

      <div className="w-4/12 p-5 bg-gray-50 rounded-lg shadow-md mt-3">
        <ContactosTransportista />
      </div>
    </div>
  );
};

export default TransportistasAlertas;
