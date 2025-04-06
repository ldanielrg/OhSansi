// src/pages/VerEvento.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventoForm from '../components/EventoForm';

function VerEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    const eventoToView = storedEvents.find(ev => ev.id === Number(id));
    if (eventoToView) {
      setInitialData(eventoToView);
    }
  }, [id]);

  const handleCancel = () => {
    navigate('/eventos');
  };

  return initialData ? (
    <EventoForm
      mode="view"
      initialData={initialData}
      onSubmit={() => {}} // No se usa en vista
      onCancel={handleCancel}
    />
  ) : (
    <p style={{ textAlign: 'center' }}>Cargando convocatoria...</p>
  );
}

export default VerEvento;
