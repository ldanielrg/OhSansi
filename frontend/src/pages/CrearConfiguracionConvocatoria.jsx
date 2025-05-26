import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/CrearConfiguracionConvocatoria.css";
import { ToastContainer, toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";  

export default function CrearConfiguracionConvocatoria() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    inicio: "",
    fin: "",
  });
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (value.startsWith(" ")) {
      toast.warn("No puede comenzar con espacios.");
      return;
    }
    if (name === "nombre" && value.length > 80) {
      toast.warn("El nombre no puede superar 80 caracteres.");
      return;
    }
    if (name === "descripcion" && value.length > 500) {
      toast.warn("La descripción no puede superar 500 caracteres.");
      return;
    }

    setForm({ ...form, [name]: value });
  };

  const handleCrear = async (e) => {
    e.preventDefault();

    if (!form.nombre.trim()) {
      toast.warn("El nombre no puede estar vacío o contener solo espacios.");
      return;
    }
    if (!form.descripcion.trim()) {
      toast.warn(
        "La descripción no puede estar vacía o contener solo espacios."
      );
      return;
    }

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const inicioDate = new Date(form.inicio);
    const finDate = new Date(form.fin);

    const limiteInicio = new Date(hoy);
    limiteInicio.setFullYear(limiteInicio.getFullYear() - 1);

    const unAnoDespues = new Date(hoy);
    unAnoDespues.setFullYear(unAnoDespues.getFullYear() + 1);
    unAnoDespues.setHours(23, 59, 59, 999);

    if (inicioDate < limiteInicio) {
      toast.warn(
        "La fecha de inicio no puede ser anterior a un año atrás desde hoy."
      );
      return;
    }
    if (inicioDate > unAnoDespues) {
      toast.warn("La fecha de inicio no puede ser más de 1 año desde hoy.");
      return;
    }
    if (finDate < inicioDate) {
      toast.warn("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }
    if (finDate > unAnoDespues) {
      toast.warn("La fecha de fin no puede ser más de 1 año desde hoy.");
      return;
    }

    setGuardando(true);
    try {
      await api.post("/convocatoria-crear", {
        nombre_convocatoria: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        fecha_inicio: form.inicio,
        fecha_final: form.fin,
      });
      toast.success("Convocatoria creada.");
      navigate("/configuracion-convocatoria");
    } catch {
      toast.error("Error al crear convocatoria.");
    } finally {
      setGuardando(false);
    }
  };

  const handleSalir = () =>
    navigate("/configuracion-convocatoria", {
      state: { message: "Creación cancelada.", type: "info" },
    });

  return (
    <div className="crear-config-page">
      {/* Overlay spinner de toda la página */}
      {guardando && (
        <div className="overlay-spinner">
          <BallTriangle
            height={80}
            width={80}
            radius={5}
            color="#003366"
            ariaLabel="guardando-spinner"
            visible={true}
          />
        </div>
      )}

      <div className="crear-config-container">
        <div className="crear-config-card">
          <div className="crear-config-header">Crear Convocatoria</div>
          <form className="crear-config-body" onSubmit={handleCrear}>
            <div className="form-row">
              <label>Nombre</label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                disabled={guardando}
              />
            </div>
            <div className="form-row">
              <label>Descripción</label>
              <textarea
                name="descripcion"
                className="fixed-desc"
                value={form.descripcion}
                onChange={handleChange}
                required
                disabled={guardando}
              />
            </div>
            <div className="form-row">
              <label>Fecha Inicio</label>
              <input
                type="date"
                name="inicio"
                value={form.inicio}
                onChange={handleChange}
                required
                disabled={guardando}
              />
            </div>
            <div className="form-row">
              <label>Fecha Fin</label>
              <input
                type="date"
                name="fin"
                value={form.fin}
                onChange={handleChange}
                required
                disabled={guardando}
              />
            </div>

            <div className="acciones-crear">
              <div className="acciones-izquierda">
                <button
                  type="submit"
                  className="btn-crear"
                  disabled={guardando}
                >
                  {guardando ? "Guardando…" : "Crear"}
                </button>
              </div>
              <div className="acciones-derecha">
                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={handleSalir}
                  disabled={guardando}
                >
                  Salir
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
