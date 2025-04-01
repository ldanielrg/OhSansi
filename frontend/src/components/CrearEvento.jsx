// CrearEvento.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventoForm from '../components/EventoForm';

function CrearEvento() {
  const navigate = useNavigate();

  const handleCreateSubmit = (eventoData) => {
    // Recuperar eventos almacenados
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    // Generar un ID único (por ejemplo, usando Date.now())
    const newEvent = { id: Date.now(), ...eventoData };
    const updatedEvents = [...storedEvents, newEvent];
    localStorage.setItem('events', JSON.stringify(updatedEvents));
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
