// CrearEvento.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventoForm from '../components/EventoForm';
import { crearCronograma } from '../api/cronogramaApi';

function CrearEvento() {
  const navigate = useNavigate();

  const handleCreateSubmit = async (eventoData) => {
    try {
      // 1. Enviar a la API Laravel
      const res = await crearCronograma('2025-01-01');
      console.log('Cronograma creado en Laravel:', res);
  
      // 2. Guardar también en localStorage (si aún lo necesitas)
      const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
      const newEvent = { id: Date.now(), ...eventoData };
      const updatedEvents = [...storedEvents, newEvent];
      localStorage.setItem('events', JSON.stringify(updatedEvents));
  
      // 3. Navegar a lista de eventos
      navigate('/eventos');
    } catch (err) {
      console.error('Error al crear cronograma en Laravel:', err);
      alert('Error al guardar cronograma en la base de datos');
    }
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
