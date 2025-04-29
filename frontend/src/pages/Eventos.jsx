// src/pages/Eventos.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Eventos.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from "react-router-dom";

const Eventos = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const location = useLocation();
  // Nuevo: control del modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  // Cargar los eventos guardados en localStorage
  useEffect(() => {
    const storedEvents = JSON.parse(localStorage.getItem("events")) || [];
    setEvents(storedEvents);
    if (location.state?.message) {
      const { message, type } = location.state;

      toast[type](message);

      // Opcional pero recomendado: limpiar el state después de mostrar la notificación
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Navegar para crear un evento nuevo
  const handleCrearEvento = () => {
    navigate("/crear-evento");
  };

  // Navegar para editar el evento seleccionado
  const handleEditarEvento = () => {
    if (!selectedEvent) return;
    navigate('/editar-evento');
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
    const updatedEvents = events.filter((ev) => ev.id !== selectedEvent.id);
    localStorage.setItem("events", JSON.stringify(updatedEvents));
    setEvents(updatedEvents);
    toast.error(`Evento "${selectedEvent.cronograma.nombre}" eliminada.`);
    setSelectedEvent(null);
    setShowDeleteModal(false); // Cerrar el modal
  };

  const cancelDelete = () => {
    // Simplemente cerramos el modal
    setShowDeleteModal(false);
    toast.info('Eliminación cancelada.');
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
                </tr>
              </thead>
              <tbody>
                {events.map((evento) => (
                  <tr
                    key={evento.id}
                    onClick={() => setSelectedEvent(evento)}
                    className={
                      selectedEvent?.id === evento.id ? "fila-seleccionada" : ""
                    }
                  >
                    <td>{evento.cronograma.nombre}</td>
                    <td>{evento.cronograma.fechaInicio}</td>
                    <td>{evento.cronograma.fechaFin}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay convocatorias creadas.</p>
          )}

          <div className="eventos-acciones d-flex justify-content-between align-items-center">
            <div className="acciones-left d-flex gap-2">
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
            </div>

            <div className="acciones-right">
              <button
                className="btn-primary"
                onClick={handleEliminarEvento}
                disabled={!selectedEvent}
              >
                Eliminar
              </button>
            </div>
          </div>

          {/* Modal para confirmar eliminación */}
          {showDeleteModal && (
            <div className="modal-container">
              <div className="modal-content">
                <p>
                  ¿Deseas eliminar la convocatoria "
                  {selectedEvent?.cronograma?.nombre}"?
                </p>
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="btn-primary"
                    onClick={confirmDelete}
                    style={{ marginRight: "1rem" }}
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
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Eventos;
