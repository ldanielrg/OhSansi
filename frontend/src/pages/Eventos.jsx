import api from "../api/axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../styles/Eventos.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../context/AuthContext";
import { BallTriangle } from "react-loader-spinner";

const Eventos = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [idConvocatoriaSeleccionada, setIdConvocatoriaSeleccionada] = useState("");
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [cargandoConvocatorias, setCargandoConvocatorias] = useState(false);
  const [cargandoEventos, setCargandoEventos] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { roles } = useAuth();
  const esAdmin = roles?.includes("Admin");

  // Cargar convocatorias al inicio
  useEffect(() => {
    const fetchConvocatorias = async () => {
      setCargandoConvocatorias(true);
      try {
        const response = await api.get("/convocatorias-activas");
        setConvocatorias(response.data);
      } catch (error) {
        console.error("Error al cargar convocatorias:", error);
        toast.error("No se pudieron cargar las convocatorias.");
      } finally {
        setCargandoConvocatorias(false);
      }
    };

    fetchConvocatorias();

    if (location.state?.message) {
      const { message, type } = location.state;
      toast[type](message);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Cargar eventos cuando se selecciona una convocatoria
  useEffect(() => {
    if (!idConvocatoriaSeleccionada) {
      setEvents([]);
      return;
    }

    const fetchEventos = async () => {
      setCargandoEventos(true);
      try {
        const response = await api.get(
          `/convocatorias/${idConvocatoriaSeleccionada}/eventos`
        );
        setEvents(response.data);
        setSelectedEvent(null);
      } catch (error) {
        console.error("Error al cargar eventos:", error);
        toast.error("No se pudieron cargar los eventos.");
      } finally {
        setCargandoEventos(false);
      }
    };

    fetchEventos();
  }, [idConvocatoriaSeleccionada]);

  const handleCrearEvento = () => {
    if (!idConvocatoriaSeleccionada) return;
    navigate("/crear-evento", {
      state: { idConvocatoria: idConvocatoriaSeleccionada },
    });
  };

  const handleEditarEvento = () => {
    if (!selectedEvent) return;
    navigate(`/editar-evento/${selectedEvent.id_evento}`, {
      state: { idConvocatoria: idConvocatoriaSeleccionada },
    });
  };

  const handleEliminarEvento = async () => {
    if (!selectedEvent) return;
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!selectedEvent) return;

    try {
      await api.delete(`/eventos/${selectedEvent.id_evento}`);
      toast.success("Evento eliminado exitosamente.");
      setEvents((prev) =>
        prev.filter((e) => e.id_evento !== selectedEvent.id_evento)
      );
      setSelectedEvent(null);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error al eliminar evento:", error);
      toast.error("No se pudo eliminar el evento.");
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    toast.info("Eliminación cancelada.");
  };

  return (
    <div className="eventos-page">
      <div
        className="eventos-container"
        style={{ position: "relative", minHeight: "400px" }}
      >
        <div className="eventos-header">Eventos por Convocatoria</div>

        {/* Spinner cargando convocatorias (overlay) */}
        {cargandoConvocatorias && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(255,255,255,0.85)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 20,
              borderRadius: "12px",
            }}
          >
            <BallTriangle
              height={80}
              width={80}
              radius={5}
              color="#003366"
              ariaLabel="loading"
              visible={true}
            />
          </div>
        )}

        {/* Selector convocatorias */}
        <div className="mb-3">
          <label>Seleccionar convocatoria:</label>
          <select
            className="form-select"
            value={idConvocatoriaSeleccionada}
            onChange={(e) => setIdConvocatoriaSeleccionada(e.target.value)}
            disabled={cargandoConvocatorias || cargandoEventos} // bloquear durante carga
          >
            <option value="">-- Selecciona una convocatoria --</option>
            {convocatorias.map((conv) => (
              <option key={conv.id_convocatoria} value={conv.id_convocatoria}>
                {conv.nombre_convocatoria}
              </option>
            ))}
          </select>
        </div>

        {/* Spinner cargando eventos (reemplaza tabla mientras carga) */}
        {cargandoEventos ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "150px",
              marginTop: "1rem",
            }}
          >
            <BallTriangle
              height={60}
              width={60}
              radius={5}
              color="#003366"
              ariaLabel="loading"
              visible={true}
            />
          </div>
        ) : events.length > 0 ? (
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
              ))}
            </tbody>
          </table>
        ) : idConvocatoriaSeleccionada ? (
          <p>No hay eventos para esta convocatoria.</p>
        ) : (
          <p>Selecciona una convocatoria para ver sus eventos.</p>
        )}

        {esAdmin && (
          <div className="eventos-acciones d-flex justify-content-between align-items-center">
            <div className="acciones-left d-flex gap-2">
              <button
                className="btn-primary"
                onClick={handleCrearEvento}
                disabled={!idConvocatoriaSeleccionada || cargandoEventos}
              >
                Crear
              </button>
              <button
                className="btn-primary"
                onClick={handleEditarEvento}
                disabled={!selectedEvent || cargandoEventos}
              >
                Editar
              </button>
            </div>

            <div className="acciones-right">
              <button
                className="btn-primary"
                onClick={handleEliminarEvento}
                disabled={!selectedEvent || cargandoEventos}
              >
                Eliminar
              </button>
            </div>
          </div>
        )}

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
