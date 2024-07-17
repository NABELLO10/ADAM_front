import React, { useState } from 'react';

const FormularioCamion = () => {
  const [patente, setPatente] = useState('');
  const [horaSalida, setHoraSalida] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí manejarías la lógica para agregar un nuevo camión
  };

  return (
    <div className="mb-8">
      <h2 className="font-bold mb-3">Agregar Camión</h2>
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <input
          className="border p-2"
          type="text"
          placeholder="Patente"
          value={patente}
          onChange={(e) => setPatente(e.target.value)}
        />
        <input
          className="border p-2"
          type="time"
          placeholder="Hora de Salida"
          value={horaSalida}
          onChange={(e) => setHoraSalida(e.target.value)}
        />
        <button className="bg-blue-500 text-white p-2" type="submit">
          Agregar
        </button>
      </form>
    </div>
  );
};

export default FormularioCamion;
