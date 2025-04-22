// src/pages/Eventos.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Eventos.css';

const Eventos = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  // Nuevo: control del modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  // Cargar los eventos guardados en localStorage
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    setEvents(storedEvents);
  }, []);

  // Navegar para crear un evento nuevo
  const handleCrearEvento = () => {
    navigate('/crear-evento');
  };

  // Navegar para editar el evento seleccionado
  const handleEditarEvento = () => {
    if (!selectedEvent) return;
    navigate(`/editar-evento/${selectedEvent.id}`);
  };

  // Navegar para ver el evento seleccionado
  const handleVerEvento = () => {
    if (!selectedEvent) return;
    navigate(`/ver-evento/${selectedEvent.id}`);
  };

  // Eliminar el evento seleccionado
  const handleEliminarEvento = () => {
    if (!selectedEvent) return;
    // En lugar de window.confirm, abrimos nuestro modal:
    setShowDeleteModal(true);
  };
  // Función que realiza la eliminación real
  const confirmDelete = () => {
    if (!selectedEvent) return;
    const updatedEvents = events.filter(ev => ev.id !== selectedEvent.id);
    localStorage.setItem('events', JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    setSelectedEvent(null);
    setShowDeleteModal(false); // Cerrar el modal
  };

  const cancelDelete = () => {
    // Simplemente cerramos el modal
    setShowDeleteModal(false);
  };

  return (
    <div className="eventos-page">
      <div className="eventos-container">
        <div className="eventos-header">Lista de Convocatorias</div>
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
                    className={selectedEvent?.id === evento.id ? 'fila-seleccionada' : ''}
                  >
                    <td>{evento.cronograma.nombre}</td>
                    <td>{evento.cronograma.fechaInicio}</td>
                    <td>{evento.cronograma.fechaFin}</td>
                    <td>{evento.cronograma.fechaPreinscripcion}</td>
                    <td>{evento.cronograma.fechaInscripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay convocatorias creadas.</p>
          )}
  
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
              onClick={handleEliminarEvento}
              disabled={!selectedEvent}
            >
              Eliminar
            </button>
          </div>
  
          {/* Modal para confirmar eliminación */}
          {showDeleteModal && (
            <div className="modal-container">
              <div className="modal-content">
                <p>
                  ¿Deseas eliminar la convocatoria "
                  {selectedEvent?.cronograma?.nombre}"?
                </p>
                <div style={{ marginTop: '1rem' }}>
                  <button
                    className="btn-primary"
                    onClick={confirmDelete}
                    style={{ marginRight: '1rem' }}
                  >
                    Eliminar
                  </button>
                  <button className="btn-primary" onClick={cancelDelete}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Eventos;
