import api from "../api/axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Eventos.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Eventos = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [idConvocatoriaSeleccionada, setIdConvocatoriaSeleccionada] =
    useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Cargar convocatorias al inicio
  useEffect(() => {
    const fetchConvocatorias = async () => {
      try {
        const response = await api.get("/convocatorias");
        setConvocatorias(response.data);
      } catch (error) {
        console.error("Error al cargar convocatorias:", error);
        toast.error("No se pudieron cargar las convocatorias.");
      }
    };

    fetchConvocatorias();

    if (location.state?.message) {
      const { message, type } = location.state;
      toast[type](message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

<<<<<<< HEAD
  const formatearFecha = (fecha) => fecha?.split('T')[0] ?? ''; // elimina la parte "T00:00:00.000Z"

  // Navegar para crear un evento nuevo
=======
  // Cargar eventos cuando se selecciona una convocatoria
  useEffect(() => {
    if (!idConvocatoriaSeleccionada) {
      setEvents([]);
      return;
    }

    const fetchEventos = async () => {
      try {
        const response = await api.get(
          `/convocatorias/${idConvocatoriaSeleccionada}/eventos`
        );
        setEvents(response.data);
        setSelectedEvent(null);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        toast.error("No se pudieron cargar los eventos.");
      }
    };

    fetchEventos();
  }, [idConvocatoriaSeleccionada]);

>>>>>>> origin/main
  const handleCrearEvento = () => {
    if (!idConvocatoriaSeleccionada) return;
    navigate("/crear-evento", {
      state: { idConvocatoria: idConvocatoriaSeleccionada },
    });
  };

  const handleEditarEvento = () => {
<<<<<<< HEAD
    if (!selectedEvent) return;
    navigate(`/editar-evento/${selectedEvent.id_evento}`);
=======
    // Navegamos a /editar-evento/:id_evento
    navigate(`/editar-evento/${selectedEvent.id_evento}`, {
      state: {
        idConvocatoria: idConvocatoriaSeleccionada,
      },
    });
>>>>>>> origin/main
  };

  const handleEliminarEvento = async () => {
    if (!selectedEvent) return;
    setShowDeleteModal(true);
  };
<<<<<<< HEAD
  // Función que realiza la eliminación real
  const confirmDelete = async () => {
    if (!selectedEvent) return;
  
    try {
      // 🔥 Eliminar del backend
      await api.delete(`/eventos/${selectedEvent.id_evento}`);
  
      // 🔄 Actualizar el estado local
      const updatedEvents = events.filter((ev) => ev.id_evento !== selectedEvent.id_evento);
      setEvents(updatedEvents);
      toast.success(`Evento "${selectedEvent.nombre_evento}" eliminado correctamente.`);
    } catch (error) {
      console.error('Error al eliminar evento:', error);
      toast.error('No se pudo eliminar el evento.');
    } finally {
      setSelectedEvent(null);
      setShowDeleteModal(false);
=======

  const confirmDelete = async () => {
    if (!selectedEvent) return;

    try {
      + await api.delete(`/eventos/${selectedEvent.id_evento}`);
      toast.success("Evento eliminado exitosamente.");
      setEvents((prev) =>
        prev.filter((e) => e.id_evento !== selectedEvent.id_evento)
      );
      setSelectedEvent(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      toast.error("No se pudo eliminar el evento.");
>>>>>>> origin/main
    }
  };
  

  const cancelDelete = () => {
    setShowDeleteModal(false);
    toast.info("Eliminación cancelada.");
  };

  return (
    <div className="eventos-page">
      <div className="eventos-container">
        <div className="eventos-header">Eventos por Convocatoria</div>

        <div className="mb-3">
          <label>Seleccionar convocatoria:</label>
          <select
            className="form-select"
            value={idConvocatoriaSeleccionada}
            onChange={(e) => setIdConvocatoriaSeleccionada(e.target.value)}
          >
            <option value="">-- Selecciona una convocatoria --</option>
            {convocatorias.map((conv) => (
              <option key={conv.id_convocatoria} value={conv.id_convocatoria}>
                {conv.nombre_convocatoria}
              </option>
            ))}
          </select>
        </div>

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
                  key={evento.id_evento}
                  onClick={() => setSelectedEvent(evento)}
                  className={
                    selectedEvent?.id_evento === evento.id_evento
                      ? "fila-seleccionada"
                      : ""
                  }
                >
                  <td>{evento.nombre_evento}</td>
                  <td>{evento.fecha_inicio.split("T")[0]}</td>
                  <td>{evento.fecha_final.split("T")[0]}</td>
                </tr>
<<<<<<< HEAD
              </thead>
              <tbody>
                {events.map((evento) => (
                  <tr
                    key={evento.id_evento}
                    onClick={() => setSelectedEvent(evento)}
                    className={
                      selectedEvent?.id_evento === evento.id_evento ? "fila-seleccionada" : ""
                    }
                  >
                    <td>{evento.nombre_evento}</td>
                    <td>{formatearFecha(evento.fecha_inicio)}</td>
                    <td>{formatearFecha(evento.fecha_final)}</td>

                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No hay convocatorias creadas.</p>
          )}
=======
              ))}
            </tbody>
          </table>
        ) : idConvocatoriaSeleccionada ? (
          <p>No hay eventos para esta convocatoria.</p>
        ) : (
          <p>Selecciona una convocatoria para ver sus eventos.</p>
        )}
>>>>>>> origin/main

        <div className="eventos-acciones d-flex justify-content-between align-items-center">
          <div className="acciones-left d-flex gap-2">
            <button
              className="btn-primary"
              onClick={handleCrearEvento}
              disabled={!idConvocatoriaSeleccionada}
            >
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

        {/* Modal de eliminación */}
        {showDeleteModal && (
          <div className="modal-container">
            <div className="modal-content">
              <p>
                ¿Deseas eliminar el evento "{selectedEvent?.nombre_evento}"?
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
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Eventos;
