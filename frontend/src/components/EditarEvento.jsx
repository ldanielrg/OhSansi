// src/pages/EditarEvento.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/EditarEvento.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BallTriangle } from "react-loader-spinner";

const EditarEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  // 1️⃣ Cargar datos del evento desde el backend
  useEffect(() => {
    const fetchEvento = async () => {
      setCargando(true);
      setError("");
      try {
        const response = await api.get(`/eventos/${id}`);
        // La API devuelve un array con un objeto [{ ... }]
        const data = Array.isArray(response.data)
          ? response.data[0]
          : response.data;
        setNombre(data.nombre_evento);
        // Quita la parte "T..." dejando solo "YYYY-MM-DD"
        setFechaInicio(data.fecha_inicio.split("T")[0]);
        setFechaFin(data.fecha_final.split("T")[0]);
      } catch (err) {
        console.error("Error al cargar evento:", err);
        setError("No se pudo cargar el evento.");
      } finally {
        setCargando(false);
      }
    };
    fetchEvento();
  }, [id]);

  // 2️⃣ Función para enviar los cambios al backend
  const handleGuardar = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!nombre || !fechaInicio || !fechaFin) {
      toast.warn("Por favor completa todos los campos.");
      return;
    }
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      toast.warn(
        "La fecha de inicio no puede ser posterior a la fecha de fin."
      );
      return;
    }

    const payload = {
      id_evento: parseInt(id, 10),
      nombre_evento: nombre,
      fecha_inicio: fechaInicio,
      fecha_final: fechaFin,
    };

    try {
      await api.put(`/eventos/${id}`, payload);
      navigate("/eventos", {
        state: { message: "Evento editado exitosamente.", type: "success" },
      });
    } catch (err) {
      console.error("Error al actualizar evento:", err);
      const msg =
        err.response?.data?.message || "Error al actualizar el evento.";
      // aquí sí mostramos el toast de error
      toast.error(msg);
    }
  };

  const handleSalir = () => {
    navigate("/eventos", {
      state: { message: "Edición cancelada.", type: "info" },
    });
  };

  if (cargando) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh" /* Empuja el spinner hacia abajo */,
        }}
      >
        <BallTriangle
          height={100}
          width={100}
          radius={5}
          color="#003366"
          ariaLabel="ball-triangle-loading"
          visible={true}
        />
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={handleSalir}>
          Volver a la lista
        </button>
      </div>
    );
  }

  // 4️⃣ Formulario de edición
  return (
    <div className="editar-evento-page">
      <div className="editar-evento-container">
        <div className="editar-evento-card">
          <div className="editar-evento-header">Editar Evento</div>
          <div className="card-body">
            <form onSubmit={handleGuardar}>
              {/* Nombre del Evento */}
              <div className="mb-3">
                <label htmlFor="nombreEvento" className="form-label">
                  Nombre del Evento
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="nombreEvento"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              {/* Fecha de Inicio */}
              <div className="mb-3">
                <label htmlFor="fechaInicio" className="form-label">
                  Fecha de Inicio
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaInicio"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  required
                />
              </div>

              {/* Fecha de Fin */}
              <div className="mb-3">
                <label htmlFor="fechaFin" className="form-label">
                  Fecha de Fin
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaFin"
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  required
                />
              </div>

              {/* Botones */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="submit" className="btn-custom-primary-aux">
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="btn-custom-secondary-aux"
                  onClick={handleSalir}
                >
                  Salir Sin Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default EditarEvento;