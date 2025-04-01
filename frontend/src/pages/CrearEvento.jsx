// CrearEvento.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventoForm from '../components/EventoForm';

function CrearEvento() {
  const navigate = useNavigate();

  // Al guardar, simulamos enviar a backend y volvemos a /eventos
  const handleCreateSubmit = (eventoData) => {
    console.log("Creando nuevo evento:", eventoData);
    // Aquí harías tu POST a la API
    navigate('/eventos');
  };

  // Si se cancela, volvemos a /eventos
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
