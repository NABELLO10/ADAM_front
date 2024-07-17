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

function Mapa({ lat, lon, info  }) {

        return (
        <MapContainer center={[lat, lon]} zoom={13} style={{ width: '100%', height: '600px' }}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">IDFleet</a> contributors'
        />
   
            <Marker 
                key={lat}
                position={[lat, lon]}
                icon={myIcon}
               >
                <Popup>
                    {info}
                </Popup>
            </Marker>
        
    </MapContainer>
    );
}

export default Mapa;
