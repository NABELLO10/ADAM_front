import { useEffect, useState, useMemo } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import {
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  FormControlLabel,
  Tooltip,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  CircularProgress
} from "@mui/material";
import { styled, useTheme } from "@mui/system";
import Descargar from "../../components/datos/Descargar";
import debounce from "lodash/debounce";
import Spinner from '../../components/animaciones/Spinner';

const Camiones = () => {
  const { auth } = useAuth();
  const [transportistas, setTransportistas] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [camiones, setCamiones] = useState([]);
  const theme = useTheme();
  const [loading, setLoading] = useState(true);

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
      setCamiones(data);
      setLoading(false);
    } catch (error) {
      console.error('Error al obtener camiones', error);
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
      obtenerCamiones();
    } catch (error) {
      msgError(error.response?.data?.msg || "Error al actualizar camión");
    }
  }, 400);

  const handleChange = (field, value, camion) => {
    const updatedCamiones = camiones.map((c) =>
      c.id === camion.id ? { ...c, [field]: value } : c
    );
    setCamiones(updatedCamiones);
    handleUpdate({ ...camion, [field]: value });
  };

  const filtered = useMemo(() => camiones.filter((val) => {
    if (busqueda === "") return true;
    return val.nom_patente.toLowerCase().includes(busqueda.toLowerCase());
  }), [camiones, busqueda]);

  const StickyTableCell = styled(TableCell)(({ theme }) => ({
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "#6D0909",
    color: "white",
  }));

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <h2 className="font-black text-red-900 text-2xl mx-4 ">
        Unidades{" "}
        <span className="font-black text-red-500 mb-10 text-center">Ceiba</span>
      </h2>

      <div className="flex flex-col mt-4">
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
            <Descargar data={filtered} nombrePdf={"Camiones"} item={1} />
          </div>

          <div className="text-right mr-4 mb-4 text-sm font-bold text-red-900">
            Total de Camiones: {camiones.length}
          </div>
        </div>

        <TableContainer
          className="bg-white"
          style={{ maxHeight: 580, overflowY: "auto" }}
        >
          <Table className="min-w-full">
            <TableHead>
              <TableRow>
                <StickyTableCell>Patente</StickyTableCell>
                <StickyTableCell>Transportista</StickyTableCell>
                <StickyTableCell>Rev. Técnica</StickyTableCell>
                <StickyTableCell>Permiso Circulación</StickyTableCell>
                <StickyTableCell>Seguro</StickyTableCell>
                <StickyTableCell>Activo</StickyTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((camion) => (
                <TableRow key={camion.id} className="hover:bg-gray-200 text-sm">
                  <TableCell>{camion.nom_patente}</TableCell>
                  <TableCell>
                    <FormControl fullWidth>
                      <InputLabel>Transportista</InputLabel>
                      <Select
                        value={camion.id_transportista || ""}
                        onChange={(e) => handleChange("id_transportista", e.target.value, camion)}
                      >
                        {transportistas.map((t) => (
                          <MenuItem key={t.id} value={t.id}>
                            {t.nombre + " " + t.ape_paterno}
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
    </>
  );
};

export default Camiones;
