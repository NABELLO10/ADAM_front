import React, { useRef, useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapaDeCamiones = ({ camiones, centroMapa, camionSeleccionado,  ventana }) => {
  const mapRef = useRef();
  const markerRefs = useRef(new Map());

  // Este efecto actualiza el centro del mapa cuando cambia centroMapa
  useEffect(() => {
    if (camionSeleccionado.patente && markerRefs.current.has(camionSeleccionado.patente)) {
      markerRefs.current.get(camionSeleccionado.patente).openPopup();
    }
  }, [camionSeleccionado, markerRefs]);

  const myIcon = new L.Icon({
    iconUrl: '/icoMapa.png',
    iconSize: [30, 31],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

  return (
    <>
      {ventana == "Inicio" && (
        <MapContainer
          center={centroMapa || [-37.46973, -72.35366]}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          />

          {camiones.map((camion, index) => (
            <Marker
              key={index}
              position={[camion.latitud, camion.longitud]}
              icon={myIcon}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current.set(camion.patente, ref);
                }
              }}
              // Aquí puedes configurar el ícono y otras opciones del marcador
            >
              <Popup>
                {camion.patente} <br />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}

      {ventana == "Tablet" && (
        <MapContainer
          center={centroMapa || [-37.46973, -72.35366]}
          zoom={11}
          style={{ height: "100%", width: "100%" }}
          ref={mapRef}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          />

          {camiones.map((camion, index) => (
            <Marker
              key={camion.index}
              position={[
                camion.lat_tablet ? camion.lat_tablet : -37.46973,
                camion.lon_tablet ? camion.lon_tablet : -72.35366,
              ]}
              ref={(ref) => {
                if (ref) {
                  markerRefs.current.set(camion.PATENTE, ref);
                }
              }}
              // Aquí puedes configurar el ícono y otras opciones del marcador
            >
              <Popup>
                {camion.PATENTE} <br />
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      )}
    </>
  );
};

export default MapaDeCamiones;
