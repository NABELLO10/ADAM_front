import { useEffect, useState, useMemo } from "react";
import { msgError, msgOk } from "../../../components/Alertas";
import clienteAxios from "../../../config/axios";
import useAuth from "../../../hooks/useAuth";
import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  CircularProgress,
  Box,
  Typography
} from "@mui/material";
import Descargar from "../../../components/datos/Descargar";
import debounce from "lodash/debounce";
import Spinner from '../../../components/animaciones/Spinner';

const UnidadesHowen = () => {
  const { auth } = useAuth();
  const [transportistas, setTransportistas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [unidadesHowen, setUnidadesHowen] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetching data on load
  useEffect(() => {
    obtenerCamiones();
    obtenerTransportistas();
  }, []);

  const obtenerTransportistas = async () => {
    try {
      const token = localStorage.getItem("token_adam");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.get(`/adam/transportista`, config);
      setTransportistas(data);
    } catch (error) {
      console.error('Error al obtener transportistas', error);
    }
  };

  const obtenerCamiones = async () => {
    try {
      const token = localStorage.getItem("token_adam");
      if (!token) return;
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await clienteAxios.get(`/adam/unidadesAdam`, config);
      setUnidadesHowen(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener UnidadesHowen', error);
    }
  };

  const handleUpdate = debounce(async (camion) => {
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

      const { data } = await clienteAxios.put(
        `/adam/editarUnidadAdam/${camion.id}`,
        camion,
        config
      );
      msgOk(data.msg);
      obtenerCamiones(); // Refrescar la lista después de actualizar
    } catch (error) {
      msgError(error.response?.data?.msg || "Error al actualizar camión");
    }
  }, 400);

  const handleChange = (field, value, camion) => {
    const updatedCamiones = unidadesHowen.map((c) =>
      c.id === camion.id ? { ...c, [field]: value } : c
    );
    setUnidadesHowen(updatedCamiones);
    handleUpdate({ ...camion, [field]: value });
  };

  // Memoization for filtering
  const filtered = useMemo(() => unidadesHowen.filter((val) => {
    if (busqueda === "") return true;
    return val.nom_patente.toLowerCase().includes(busqueda.toLowerCase());
  }), [unidadesHowen, busqueda]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Box>     

        <div className="flex flex-col">
          <div className="flex justify-between items-end gap-4 mb-2">
            <div className="flex gap-2 w-full lg:w-3/12 border shadow px-1 text-sky-500">
              <input
                name="busqueda"
                id="busqueda"
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                className="w-full lg:w-12/12 border shadow px-1 text-sky-500"
                placeholder="Buscar Camión..."
              />
              <Descargar data={filtered} nombrePdf={"UnidadesHowen"} item={1} />
            </div>

            <div className="text-right mr-4 mb-4 text-sm font-bold text-red-900">
              Total de Unidades: {unidadesHowen.length}
            </div>
          </div>

          {/* Tabla mejorada */}
          <TableContainer className="bg-white" style={{ maxHeight: 500, overflowY: 'auto' }}>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell>Patente</TableCell>
                  <TableCell>Device ID</TableCell>
                  <TableCell>Transportista</TableCell>
                  <TableCell>Rev. Técnica</TableCell>
                  <TableCell>Permiso Circulación</TableCell>
                  <TableCell>Seguro</TableCell>
                  <TableCell>Activo</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((camion) => (
                  <TableRow key={camion.id} className="hover:bg-gray-200 text-sm">
                    <TableCell>{camion.nom_patente}</TableCell>
                    <TableCell>{camion.device_id}</TableCell>
                    <TableCell>
                      <FormControl fullWidth>
                        <InputLabel>Transportista</InputLabel>
                        <Select
                          value={camion.id_transportista || ""}
                          label="Transportista"
                          onChange={(e) => handleChange("id_transportista", e.target.value, camion)}
                        >
                          {transportistas.map((t) => (
                            <MenuItem key={t.id} value={t.id}>
                              {t.nombre + " " + t.ape_paterno + " " + t.ape_materno}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={camion.fec_rev_tecnica || ""}
                        onChange={(e) => handleChange("fec_rev_tecnica", e.target.value, camion)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={camion.fec_per_circulacion || ""}
                        onChange={(e) => handleChange("fec_per_circulacion", e.target.value, camion)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        value={camion.fec_seguro || ""}
                        onChange={(e) => handleChange("fec_seguro", e.target.value, camion)}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked={camion.est_activo === 1}
                        onChange={(e) => handleChange("est_activo", camion.est_activo ? 0 : 1, camion)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </>
  );
};

export default UnidadesHowen;
