// src/pages/EditarEvento.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventoForm from '../components/EventoForm';

function EditarEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    const eventoToEdit = storedEvents.find(ev => ev.id === Number(id));
    if (eventoToEdit) {
      setInitialData(eventoToEdit);
    }
  }, [id]);

  const handleEditSubmit = (eventoData) => {
    // Recuperar lista
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    // Reemplazar el evento con ID dado
    const updatedEvents = storedEvents.map(ev =>
      ev.id === Number(id) ? { ...ev, ...eventoData } : ev
    );
    // Guardar
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    navigate('/eventos');
  };

  const handleCancel = () => {
    navigate('/eventos');
  };

  // Cargar datos y pasarlos a EventoForm en modo "edit"
  return initialData ? (
    <EventoForm
      mode="edit"
      initialData={initialData}
      onSubmit={handleEditSubmit}
      onCancel={handleCancel}
    />
  ) : (
    <p style={{ textAlign: 'center' }}>Cargando convocatoria a editar...</p>
  );
}

export default EditarEvento;
