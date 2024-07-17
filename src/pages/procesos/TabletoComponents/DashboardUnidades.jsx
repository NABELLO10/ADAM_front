import React from 'react';
import MapaDeCamiones from '../../home/MapaDeCamiones';
import ModalesNotificaciones from './ModalesNotificaciones';
import moment from 'moment';
import GraficoGral from '../../../components/graficos/graficoGral';

const DashboardUnidades = ({setInfo,  handleClickOpenAlerta, handleClickOpen,empresaSistema, open,handleClose, info,notActiva, notTemp, openAlerta, handleCloseAlerta, camiones,centroMapa, camionSeleccionado, id_transportista, tiposNotificaciones }) => {
 

  return (
    <div className="bg-white shadow-xl border p-3">
      <div className="mb-2 flex justify-between items-center">
       {/*  <button
          onClick={() => {
            handleClickOpen();
            setInfo(camionSeleccionado);
          }}
          className="p-2 bg-blue-700 text-white rounded-md hover:bg-blue-900"
        >
          GPS
        </button> */}
        {camionSeleccionado && (
          <h1 className="lg:text-xl text-md font-semibold">
            UNIDAD: {camionSeleccionado.patente}
          </h1>
        )}
      </div> 

      <div
        className={`${
          camionSeleccionado.est_ox == 1 ? "h-64" : "h-96"
        } bg-white mb-4 rounded-lg shadow-lg border`}
      >
        <MapaDeCamiones
          ventana="Inicio"
          camiones={camiones}
          centroMapa={centroMapa}
          camionSeleccionado={camionSeleccionado}
        />
      </div>

      {camionSeleccionado.est_ox == 1  && (
        <div>
          <div className="w-full gap-4 mb-2 ">
            <div className="bg-white lg:p-4 mt-2  rounded-lg shadow-lg border border-gray-300">
              <GraficoGral
                camionSeleccionado={camionSeleccionado}
                empresaSistema = {empresaSistema}
                id_transportista ={id_transportista}
              />
            </div>
          </div>

          <div className="w-full gap-4 mb-2 ">
            <div className="bg-white lg:p-4  rounded-lg shadow-lg border border-gray-300">
              <h2 className="text-lg font-semibold mb-2 p-2  border-b-2">
                Tipo Notificaciones
              </h2>

              {tiposNotificaciones.map((n) => (
                <div key={n.id} className="flex px-2 gap-12  mb-3">
                  <div className="lg:w-3/12 ">
                    <span className="text-sm font-medium">
                      {" "}
                      {n.cat_notificacione.nom_tipo + ":"}
                    </span>
                  </div>

                  <div className="lg:flex  w-full ">
                    <div className="lg:w-2/12 ">
                      <span className="text-sm font-medium ">
                        Min : {n.val_min}
                      </span>
                    </div>
                    <div className="lg:w-2/12">
                      {" "}
                      <span className="text-sm font-medium ">
                        Max : {n.val_max}
                      </span>
                    </div>

                    <div className="lg:w-5/12 w-full">
                      <span className="text-sm font-medium ">
                        Obs : {n.obs}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {camionSeleccionado.est_ox == 0 && camionSeleccionado.est_temp == 0 && (
        <div className="lg:grid lg:grid-cols-2 gap-4 mb-2">
          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300 mb-2">
            <h2 className="text-lg font-semibold mb-2 border-b-2">GPS</h2>

            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Ultimo registro GPS:</span>
              <span className="text-sm font-medium text-gray-500">
                {moment(camionSeleccionado.fechaGPS).format(
                  "DD-MM-YYYY HH:mm:ss"
                )}
              </span>
            </div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Fecha Registro:</span>
              <span className="text-sm font-medium text-gray-500">
                {moment(camionSeleccionado.fechaRegistro).format(
                  "DD-MM-YYYY HH:mm:ss"
                )}
              </span>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-300">
            <h2 className="text-lg font-semibold mb-2 border-b-2">
              Otros Indicadores
            </h2>
            <div className="flex items-center justify-between mb-1">
              <span className="text-sm font-medium">Velocidad:</span>
              <span className="text-sm font-medium text-gray-500">
                {camionSeleccionado.velocidad > 0 + "Km/H"
                  ? camionSeleccionado.velocidad
                  : "0 km/h"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Altitud:</span>
              <span className="text-sm font-medium text-gray-500">
                {camionSeleccionado.altitud}
              </span>
            </div>
          </div>
        </div>
      )}

      <ModalesNotificaciones
        open={open}
        handleClose={handleClose}
        info={info}
        notActiva={notActiva}
        notTemp={notTemp}
        openAlerta={openAlerta}
        id_transportista={id_transportista}
        handleCloseAlerta={handleCloseAlerta}
      />
    </div>
  );
};

export default DashboardUnidades;
