// src/pages/CrearEvento.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventoForm from '../components/EventoForm';

// Crear una convocatoria nueva
function CrearEvento() {
  const navigate = useNavigate();

  // Manejar guardado
  const handleCreateSubmit = (eventoData) => {
    // Leer registros actuales
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    // Generar un ID único
    const newEvent = { id: Date.now(), ...eventoData };
    // Actualizar array
    const updatedEvents = [...storedEvents, newEvent];
    // Guardar en localStorage
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    // Volver a la lista
    navigate('/eventos');
  };

  // Cancelar
  const handleCancel = () => {
    navigate('/eventos');
  };

  return (
    <EventoForm
      mode="create"
      onSubmit={handleCreateSubmit}
      onCancel={handleCancel}
    />
  );
}

export default CrearEvento;
