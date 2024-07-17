import React from 'react';
import { MapContainer, TileLayer, Marker, Popup  } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const myIcon = new L.Icon({
    iconUrl: '/icoMapa.png',
    iconSize: [30, 31],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

function Mapa({ posiciones  }) {
    const centerLat = posiciones.length > 0 ? posiciones[0].Latitud : 0;
    const centerLon = posiciones.length > 0 ? posiciones[0].Longitud : 0;

    return (
        <MapContainer center={[centerLat, centerLon]} zoom={8} style={{ width: '100%', height: '400px' }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {posiciones.map((position, index) => (
            <Marker 
                key={index}
                position={[position.Latitud, position.Longitud]}
                icon={myIcon}
              >
                <Popup>
                    {position.FechaGPS}
                </Popup>
            </Marker>
        ))}
    </MapContainer>
    );
}

export default Mapa;
