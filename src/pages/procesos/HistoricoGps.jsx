import React, { useState, useEffect } from "react";
import clienteAxios from "../../config/axios";
import { msgError } from "../../components/Alertas";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import TableContainer from "@mui/material/TableContainer";
import moment from 'moment';
import {
  Table,
  TableCell,
  TableHead,
  TableRow,
  TableBody,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { styled } from "@mui/system";


const HistoricoGps = ({patente, notActiva, notTemp}) => {   

    const [oxs, setOX] = useState([]);
    const [isLoading2, setIsLoading2] = useState(false);
    const theme = useTheme();
    
    useEffect(() => {
        DatosOxPy()
    },[])


  const DatosOxPy = async () => {
    setIsLoading2(true);
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
      const { data } = await clienteAxios.get(`/general/datos-ox/${patente}`, config);

      setIsLoading2(false);
      setOX(data);
   
    } catch (error) {
      msgError(error.response.data.msg);
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
          style={{ maxHeight: 680, overflowY: "auto" }}
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
                  E1
                </StickyTableCell>
                <StickyTableCell
                  style={{
                    fontWeight: theme.typography.fontWeightBold,
                  }}
                >
                  E2
                </StickyTableCell>
                <StickyTableCell
                  style={{
                    fontWeight: theme.typography.fontWeightBold,
                  }}
                >
                  E3
                </StickyTableCell>
                <StickyTableCell
                  style={{
                    fontWeight: theme.typography.fontWeightBold,
                  }}
                >
                  E4
                </StickyTableCell>
                <StickyTableCell
                  style={{
                    fontWeight: theme.typography.fontWeightBold,
                  }}
                >
                  E5
                </StickyTableCell>
                <StickyTableCell
                  style={{
                    fontWeight: theme.typography.fontWeightBold,
                  }}
                >
                  E6
                </StickyTableCell>
                <StickyTableCell
                  style={{
                    fontWeight: theme.typography.fontWeightBold,
                  }}
                >
                  E7
                </StickyTableCell>
                <StickyTableCell
                  style={{
                    fontWeight: theme.typography.fontWeightBold,
                  }}
                >
                  E8
                </StickyTableCell>

                <StickyTableCell
                  style={{
                    fontWeight: theme.typography.fontWeightBold,
                  }}
                >
                  E9
                </StickyTableCell>

                <StickyTableCell
                  style={{
                    fontWeight: theme.typography.fontWeightBold,
                  }}
                >
                  T°
                </StickyTableCell>
               
              </TableRow>
            </TableHead>

            <TableBody>
              {oxs.map((t) => (
                <TableRow
                  key={t.id}
                  className="hover:bg-blue-100  ease-in-out"
                >
                  <TableCell
                    style={{ borderBottom: "1px solid #FFFFFF" }}
                  >
                    <div className="flex flex-col">
                      <span className="font-bold">{t.patente}</span>
                      <span className="text-xs">
                        {"Fecha GPS: " + moment(t.fechaGPS).format('DD-MM-YYYY HH:mm:ss')}
                      </span>
                      <span className="text-xs">                      
                        {"Fecha Registro: " + moment(t.fechaRegistro).format('DD-MM-YYYY HH:mm:ss')}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell
                    style={{ borderBottom: "1px solid #FFFFFF" }}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`${
                          t.ox1 >= parseInt(notActiva.val_min) &&
                          t.ox1 <= parseInt(notActiva.val_max)
                            ? "text-blue-600"
                            : "text-red-600 font-bold"
                        }`}
                      >
                        {t.ox1}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell
                    style={{ borderBottom: "1px solid #FFFFFF" }}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`${
                          t.ox2 >= parseInt(notActiva.val_min) &&
                          t.ox2 <= parseInt(notActiva.val_max)
                            ? "text-blue-600"
                            : "text-red-600 font-bold"
                        }`}
                      >
                        {t.ox2}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell
                    style={{ borderBottom: "1px solid #FFFFFF" }}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`${
                          t.ox3 >= parseInt(notActiva.val_min) &&
                          t.ox3 <= parseInt(notActiva.val_max)
                            ? "text-blue-600"
                            : "text-red-600 font-bold"
                        }`}
                      >
                        {t.ox3}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell
                    style={{ borderBottom: "1px solid #FFFFFF" }}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`${
                          t.ox4 >= parseInt(notActiva.val_min) &&
                          t.ox4 <= parseInt(notActiva.val_max)
                            ? "text-blue-600"
                            : "text-red-600 font-bold"
                        }`}
                      >
                        {t.ox4}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell
                    style={{ borderBottom: "1px solid #FFFFFF" }}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`${
                          t.ox5 >= parseInt(notActiva.val_min) &&
                          t.ox5 <= parseInt(notActiva.val_max)
                            ? "text-blue-600"
                            : "text-red-600 font-bold"
                        }`}
                      >
                        {t.ox5}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell
                    style={{ borderBottom: "1px solid #FFFFFF" }}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`${
                          t.ox6 >= parseInt(notActiva.val_min) &&
                          t.ox6 <= parseInt(notActiva.val_max)
                            ? "text-blue-600"
                            : "text-red-600 font-bold"
                        }`}
                      >
                        {t.ox6}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell
                    style={{ borderBottom: "1px solid #FFFFFF" }}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`${
                          t.ox7 >= parseInt(notActiva.val_min) &&
                          t.ox7 <= parseInt(notActiva.val_max)
                            ? "text-blue-600"
                            : "text-red-600 font-bold"
                        }`}
                      >
                        {t.ox7}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell
                    style={{ borderBottom: "1px solid #FFFFFF" }}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`${
                          t.ox8 >= parseInt(notActiva.val_min) &&
                          t.ox8 <= parseInt(notActiva.val_max)
                            ? "text-blue-600"
                            : "text-red-600 font-bold"
                        }`}
                      >
                        {t.ox8}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell
                    style={{ borderBottom: "1px solid #FFFFFF" }}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`${
                          t.ox9 >= parseInt(notActiva.val_min) &&
                          t.ox9 <= parseInt(notActiva.val_max)
                            ? "text-blue-600"
                            : "text-red-600 font-bold"
                        }`}
                      >
                        {t.ox9}
                      </span>
                    </div>
                  </TableCell>
                
                  <TableCell
                    style={{ borderBottom: "1px solid #FFFFFF" }}
                  >
                    <div className="flex flex-col">
                      <span
                        className={`${
                          t.temp >= parseInt(notTemp.val_min) &&
                          t.temp <= parseInt(notTemp.val_max)
                            ? "text-blue-600"
                            : "text-red-600 font-bold"
                        }`}
                      >
                        {t.temp}
                      </span>
                    </div>
                  </TableCell>              

            
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        
      ) : (
        <h1 className=" text-center mt-5 text-cyan-700 font-bold">
          Sin registros
        </h1>
      )}
    </div>
  </div>
  )
}

export default HistoricoGps