import React, { useState, useEffect } from "react";
import clienteAxios from "../config/axios";
import { msgError } from "../components/Alertas";

import GestionAlertasGral from "../pages/procesos/GestionAlertasGral"


const Inicio = () => {

  return (
    <>
      <div className="lg:flex items-center gap-2 ">
        <h2 className="font-black  text-red-900 lg:text-lg ">
          Gestion <span className="font-black text-red-500">Alertas </span>
        </h2>
      </div>

      <GestionAlertasGral />
    </>
  );
};

export default Inicio;
