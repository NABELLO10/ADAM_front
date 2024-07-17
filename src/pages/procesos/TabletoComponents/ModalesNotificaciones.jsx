import React from 'react'
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import HistoricoGps from '../HistoricoGps';
import HistoricoAlertas from '../HistoricoAlertas';

const ModalesNotificaciones = ({open,handleClose, ventana,info,notActiva, notTemp, openAlerta, handleCloseAlerta, id_transportista }) => {

  return (
    <div>
      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className=" rounded-lg">
            <HistoricoGps
            id_transportista={id_transportista}
              patente={info.PATENTE ? info.PATENTE : info.patente}
              notActiva={notActiva}
              notTemp={notTemp}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-500 active:shadow-lg transition duration-150 ease-in-out"
            onClick={handleClose}
          >
            Cerrar
          </button>
        </DialogActions>
      </Dialog>

      <Dialog
        fullWidth={true}
        maxWidth={"lg"}
        open={openAlerta}
        onClose={handleCloseAlerta}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <div className=" rounded-lg">
            <div className="">
              <HistoricoAlertas id_transportista={id_transportista} ventana={ventana} patente={info.PATENTE ? info.PATENTE : info.patente} />
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <button
            className="inline-block px-6 py-2.5 bg-gray-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-700 hover:shadow-lg focus:bg-gray-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-500 active:shadow-lg transition duration-150 ease-in-out"
            onClick={handleCloseAlerta}
          >
            Cerrar
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default ModalesNotificaciones