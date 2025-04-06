// pages/Eventos.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Eventos.css';

const Eventos = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const navigate = useNavigate();

  // Cargar eventos de localStorage al montar
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(storedEvents);
  }, []);

  const handleCrearEvento = () => {
    navigate('/crear-evento');
  };

  const handleEditarEvento = () => {
    if (!selectedEvent) return;
    navigate(`/editar-evento/${selectedEvent.id}`);
  };

  const handleVerEvento = () => {
    if (!selectedEvent) return;
    navigate(`/ver-evento/${selectedEvent.id}`);
  };

  const handleEliminarEvento = () => {
    if (!selectedEvent) return;
    const confirmacion = window.confirm(
      `¿Deseas eliminar el evento "${selectedEvent.cronograma?.nombre}"?`
    );
    if (confirmacion) {
      // Filtramos el evento eliminado
      const updatedEvents = events.filter(ev => ev.id !== selectedEvent.id);
      setEvents(updatedEvents);
      localStorage.setItem('events', JSON.stringify(updatedEvents));
      setSelectedEvent(null);
    }
  };

  return (
    <div className="eventos-page">
      <div className="eventos-container">
        <div className="eventos-header">Lista de Eventos</div>
        <div className="eventos-body">
          {events.length > 0 ? (
            <table className="tabla-eventos">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Fecha Inicio</th>
                  <th>Fecha Fin</th>
                  <th>Preinscripción</th>
                  <th>Inscripción</th>
                </tr>
              </thead>
              <tbody>
                {events.map(evento => (
                  <tr
                    key={evento.id}
                    onClick={() => setSelectedEvent(evento)}
                    className={
                      selectedEvent?.id === evento.id ? 'fila-seleccionada' : ''
                    }
                  >
                    <td>{evento.cronograma?.nombre}</td>
                    <td>{evento.cronograma?.fechaInicio}</td>
                    <td>{evento.cronograma?.fechaFin}</td>
                    <td>{evento.cronograma?.fechaPreinscripcion}</td>
                    <td>{evento.cronograma?.fechaInscripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay eventos creados.</p>
          )}

          {/* Botones de acción */}
          <div className="eventos-acciones">
            <button className="btn-primary" onClick={handleCrearEvento}>
              Crear
            </button>
            <button
              className="btn-primary"
              onClick={handleEditarEvento}
              disabled={!selectedEvent}
            >
              Editar
            </button>
            <button
              className="btn-primary"
              onClick={handleVerEvento}
              disabled={!selectedEvent}
            >
              Ver
            </button>
            <button
              className="btn-primary"
              onClick={handleEliminarEvento}
              disabled={!selectedEvent}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventos;
