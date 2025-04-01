// CrearEvento.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventoForm from '../components/EventoForm';

function CrearEvento() {
  const navigate = useNavigate();

  const handleCreateSubmit = (eventoData) => {
    // 1. Leer los eventos ya guardados en localStorage
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

    // 2. Crear un objeto con ID único (por ejemplo, usando Date.now())
    const newEvent = { id: Date.now(), ...eventoData };

    // 3. Actualizamos el array con el nuevo evento
    const updatedEvents = [...storedEvents, newEvent];

    // 4. Guardar el array actualizado en localStorage
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    // 5. Ir a la lista de eventos
    navigate('/eventos');
  };

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
