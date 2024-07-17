import React, { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import { msgError } from "../../components/Alertas";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import moment from "moment";
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";

const HistoricoAlertas = ({ patente, ventana, id_transportista }) => {
  const [oxs, setOX] = useState([]);

  const [isLoading2, setIsLoading2] = useState(false);

  const theme = useTheme();

  useEffect(() => {
    HistorialAlertas();
  }, []);

  const HistorialAlertas = async () => {
    setIsLoading2(true);
    /*   try { */
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

        let resultado;

        if (ventana == "Tablet") {
          const patenteClean = patente.replace(/[-.]/g, "");
          resultado = await clienteAxios.get(
            `/general/alertas/${patenteClean}`,
            config
          );
          setOX(resultado.data);
        } else {
          resultado = await clienteAxios.get(
            `/general/alertas/${patente}`,
            config
          );

          setOX(resultado.data);
        }
        
       // console.log(resultado.data.filter(r => r.id_transportista == id_transportista ));

        setIsLoading2(false);
/*       } catch (error) {
        msgError(error.response.resultado.msg);
      }   */
  };

  const parseDetalle = (detalleString) => {
    try {
      return JSON.parse(detalleString);
    } catch (error) {
      console.error("Error parseando JSON:", error);
      return {}; // Devuelve un objeto vacío si hay un error de parseo
    }
  };

  const StickyTableCell = styled(TableCell)(({ theme }) => ({
    position: "sticky",
    top: 0,
    zIndex: 1,
    backgroundColor: "#1b3242",
    color: "white", // para asegurarte de que el fondo no sea transparente
  }));

  return (
    <div className="w-12/12">
      <div className=" text-white  rounded-lg  w-full mx-auto ">
        {isLoading2 ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <CircularProgress />
          </Box>
        ) : oxs.length > 0 ? (
          <TableContainer
            className="bg-white"
            style={{ maxHeight: 600, overflowY: "auto" }}
          >
            <Table className="min-w-full">
              <TableHead>
                <TableRow>
                  <StickyTableCell
                    style={{
                      fontWeight: theme.typography.fontWeightBold,
                    }}
                  >
                    Patente
                  </StickyTableCell>
                  <StickyTableCell
                    style={{
                      fontWeight: theme.typography.fontWeightBold,
                    }}
                  >
                    Tipo Alerta
                  </StickyTableCell>
                  <StickyTableCell
                    style={{
                      fontWeight: theme.typography.fontWeightBold,
                    }}
                  >
                    Detalle
                  </StickyTableCell>
                  <StickyTableCell
                    style={{
                      fontWeight: theme.typography.fontWeightBold,
                    }}
                  >
                    Fecha Registro
                  </StickyTableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {oxs.map((t) => {
                  let detalleObj = "";
                  if (ventana != "Tablet") {
                    detalleObj = parseDetalle(t.detalle);
                  }

                  return (
                    <TableRow
                      key={t.id}
                      className="hover:bg-blue-100  ease-in-out"
                    >
                      <TableCell style={{ borderBottom: "1px solid #FFFFFF" }}>
                        <div className="flex flex-col">
                          <span className="font-bold">{t.patente}</span>
                        </div>
                      </TableCell>

                      <TableCell style={{ borderBottom: "1px solid #FFFFFF" }}>
                        <div className="flex flex-col">
                          <span className="">{t.tipo}</span>
                        </div>
                      </TableCell>

                      {ventana == "Tablet" ? (
                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <div className="">{t.detalle}</div>
                          </div>
                        </TableCell>
                      ) : (
                        <TableCell
                          style={{ borderBottom: "1px solid #FFFFFF" }}
                        >
                          <div className="flex flex-col">
                            <div className="space-x-1 flex">
                              <p>
                                {detalleObj.ox1 > 0
                                  ? "E1: " + detalleObj.ox1
                                  : ""}
                              </p>
                              <p>
                                {detalleObj.ox2 > 0
                                  ? "E2: " + detalleObj.ox2
                                  : ""}
                              </p>
                              <p>
                                {detalleObj.ox3 > 0
                                  ? "E3: " + detalleObj.ox3
                                  : ""}
                              </p>
                              <p>
                                {detalleObj.ox4 > 0
                                  ? "E4: " + detalleObj.ox4
                                  : ""}
                              </p>
                              <p>
                                {detalleObj.ox5 > 0
                                  ? "E5: " + detalleObj.ox5
                                  : ""}
                              </p>
                              <p>
                                {detalleObj.ox6 > 0
                                  ? "E6: " + detalleObj.ox6
                                  : ""}
                              </p>
                              <p>
                                {detalleObj.ox7 > 0
                                  ? "E7: " + detalleObj.ox7
                                  : ""}
                              </p>
                              <p>
                                {detalleObj.ox8 > 0
                                  ? "E8: " + detalleObj.ox8
                                  : ""}
                              </p>
                              <p>
                                {detalleObj.ox9 > 0
                                  ? "E9: " + detalleObj.ox9
                                  : ""}
                              </p>
                              <p>
                                {" "}
                                {detalleObj.ox10 > 0
                                  ? "E10: " + detalleObj.ox10
                                  : ""}
                              </p>
                              <p>
                                {" "}
                                {detalleObj.temp > 0
                                  ? "T°: " + detalleObj.temp
                                  : ""}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                      )}

                      <TableCell  key={t.id} style={{ borderBottom: "1px solid #FFFFFF" }}>
                        <div className="flex flex-col">
                          <div className="">
                            <TableCell
                              style={{ borderBottom: "1px solid #FFFFFF" }}
                            >
                              <div className="flex flex-col">
                                <div className="">
                                  {moment(t.fec_add).format(
                                    "DD-MM-YYYY HH:mm:ss"
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <h1 className=" text-center mt-5 text-cyan-700 font-semibold">
            Sin registros
          </h1>
        )}
      </div>
    </div>
  );
};

export default HistoricoAlertas;
