import { useEffect, useState } from "react";
import { msgError, msgOk } from "../../components/Alertas";
import clienteAxios from "../../config/axios";
import useAuth from "../../hooks/useAuth";
import SaveTwoToneIcon from "@mui/icons-material/SaveTwoTone";
import {
  TextField,
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
  TableContainer,
  Paper,
  Button,
  Checkbox,
  FormControlLabel,
  Tooltip,
  styled,
  useTheme,
} from "@mui/material";

const TipoAlerta = () => {
  const { auth } = useAuth();
  const [TipoAlerta, setTipoAlerta] = useState([]);
  const theme = useTheme();
  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    obtenerTipoAlerta();
  }, []);

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
      setTipoAlerta(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async (tipo) => {
    try {
      const token = localStorage.getItem("token_adam");
      if (!token) return;

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const { data } = await clienteAxios.put(
        `/general/editarTipoAlarma/${tipo.id}`,
        {
          est_activo: tipo.est_activo,
        },
        config
      );

      msgOk(data.msg);

      obtenerTipoAlerta();
    } catch (error) {
      msgError("Error al actualizar tipo de alarma");
    }
  };

  const handleEditChange = (field, value, tipo) => {
    const updatedTipos = TipoAlerta.map((t) =>
      t.id === tipo.id ? { ...t, [field]: value } : t
    );
    setTipoAlerta(updatedTipos);
  };

  const filtered = TipoAlerta.filter(
    (tipo) =>
      busqueda === "" ||
      tipo.nombre_tipo_alarma.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <div className="lg:text-end mb-0 lg:flex lg:justify-between bg-gray-100">
        <div className="items-center lg:flex ">
          <h2 className="font-black text-red-900 text-2xl mx-4 ">
            Tipos{" "}
            <span className="font-black text-red-500  text-center">
              Alarmas
            </span>
          </h2>
        </div>

        <TextField
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar..."
          variant="standard"
          style={{ marginBottom: "6px", marginTop: "10px" }}
        />
      </div>

      <TableContainer
        component={Paper}
        style={{ maxHeight: 600, overflow: "auto" }}
      >
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              <TableCell
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#6f2522",
                }}
              >
                Nombre Tipo Alarma
              </TableCell>
              <TableCell
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#6f2522",
                }}
              ></TableCell>
              <TableCell
                style={{
                  fontWeight: "bold",
                  color: "white",
                  backgroundColor: "#6f2522",
                }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((tipo) => (
              <TableRow key={tipo.id}>
                <TableCell>{tipo.nombre_tipo_alarma}</TableCell>

                <TableCell>
                  <FormControlLabel
                    control={<Checkbox checked={tipo.est_activo === 1} />}
                    onChange={() =>
                      handleEditChange(
                        "est_activo",
                        tipo.est_activo === 1 ? 0 : 1,
                        tipo
                      )
                    }
                    label="Activo"
                  />
                </TableCell>
                <TableCell>
                  <Tooltip title="Guardar cambios">
                    <button
                      className="text-blue-950"
                      onClick={() => handleUpdate(tipo)}
                    >
                      <SaveTwoToneIcon />
                    </button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TipoAlerta;
