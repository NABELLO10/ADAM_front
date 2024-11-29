import {BrowserRouter, Route, Routes} from "react-router-dom"
import React, { lazy, Suspense } from "react";
import AuthLayout from "./layout/AuthLayout"
import RutaProtegida from "./layout/RutaProtegida"
import {AuthProvider} from './context/authProvider'
import {AdicionalesProvider} from './context/adicionalesProvider'

import Login from "./pages/auth/Login"
import OlvidePassword from "./pages/auth/OlvidePassword";
import NuevoPassword from "./pages/auth/NuevoPassword";

import Inicio from "./pages/Inicio"
import WialonToken from "./pages/WialonToken"
import CambiarPassword from "./pages/auth/CambiarPassword"
import Usuarios from "./pages/mantenedores/Usuarios"
import Perfiles from "./pages/mantenedores/Perfiles"
import Camiones from "./pages/mantenedores/Camiones"
import EmpresasSistemas from "./pages/mantenedores/EmpresasSistema"
import Empresas from "./pages/mantenedores/Empresas"
import Arrastres from "./pages/mantenedores/Arrastres"
import CatNotificacion from "./pages/mantenedores/CatNotificacion"
import TipoAlerta from "./pages/mantenedores/TipoAlerta"

import Transportistas from "./pages/mantenedores/Transportistas"
import Conductores from "./pages/mantenedores/Conductores"
import TipoNotificacion from "./pages/mantenedores/TipoNotificacion"
import CorreosNotificaciones from "./pages/mantenedores/CorreosNotificaciones"
import TableroWialon from "./pages/procesos/TableroWialon"
import TabletoTablet from "./pages/procesos/TabletoTablet"
import Turnos from "./pages/procesos/Turnos"
import TableroConductor from "./pages/procesos/TableroConductor"
import InicioConductor from "./pages/procesos/InicioConductor"
import GestionUnificada from "./pages/procesos/GestionUnificada"
import GestionAlertasGral from "./pages/procesos/GestionAlertasGral"

import GestionAlerta from "./pages/ADAM/procesos/GestionAlerta"

import AlertasTransportistas from "./pages/ADAM/procesos/AlertasTransportistas"

import GestionAlarmasHowen from "./pages/HOWEN/procesos/GestionAlarmasHowen"


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AdicionalesProvider>
          <Routes>
            <Route path="/" element={<AuthLayout />}>
              <Route index element={<Login />} />
              <Route path="olvide-password" element={<OlvidePassword />} />
              <Route
                path="olvide-password/:token"
                element={<NuevoPassword />}
              />
              <Route path="primer-ingreso/:token" element={<NuevoPassword />} />

              <Route path="alertas" element={<InicioConductor />} />

            </Route>

            <Route path="/admin" element={<RutaProtegida />}>
              <Route index element={<Inicio />} />
              <Route path="actualizar-password" element={<CambiarPassword />} />
              <Route path="wialon" element={<WialonToken />} />
              <Route path="usuarios" element={<Usuarios />} />
              <Route path="perfil" element={<Perfiles />} />
              <Route path="empresas" element={<EmpresasSistemas />} />
              <Route path="empresaGlobal" element={<Empresas />} />
              <Route path="transportistas" element={<Transportistas />} />
              <Route path="conductores" element={<Conductores />} />
              <Route path="camiones" element={<Camiones />} />
              <Route path="arrastres" element={<Arrastres />} />
              <Route path="cat-not" element={<CatNotificacion />} />
              <Route path="tipo-alerta" element={<TipoAlerta />} />


              <Route path="tipo-notificacion" element={<TipoNotificacion />} />
              <Route path="correos-notificacion" element={<CorreosNotificaciones />} />
              <Route path="tablero-wialon" element={<TableroWialon />} />
              <Route path="gestion" element={<GestionUnificada />} />
        
              <Route path="tablero-tablet" element={<TabletoTablet />} />
              <Route path="tablero-conductor" element={<TableroConductor />} />
              <Route path="turnos" element={<Turnos />} />

            {/* ADAM */}
              <Route path="gestionAlerta" element={<GestionAlerta />} />
              <Route path="gestionAlertaGral" element={<GestionAlertasGral />} />
              <Route path="alertaTransportista" element={<AlertasTransportistas />} />
            
            {/* HOWEN */}
            <Route path="gestionAlertaHowen" element={<GestionAlarmasHowen />} />

            </Route>
          </Routes>
        </AdicionalesProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
