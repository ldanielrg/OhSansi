import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/CrearConfiguracionConvocatoria.css";
import { ToastContainer, toast } from "react-toastify";

export default function CrearConfiguracionConvocatoria() {
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    inicio: "",
    fin: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCrear = async (e) => {
    e.preventDefault();

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Para comparar sólo fecha sin horas

    const inicioDate = new Date(form.inicio);
    const finDate = new Date(form.fin);

    // Fecha límite mínima: hoy - 1 año
    const limiteInicio = new Date(hoy);
    limiteInicio.setFullYear(limiteInicio.getFullYear() - 1);

    // Fecha límite máxima: hoy + 1 año
    const unAnoDespues = new Date(hoy);
    unAnoDespues.setFullYear(unAnoDespues.getFullYear() + 1);
    unAnoDespues.setHours(23, 59, 59, 999);

    // Validar que la fecha inicio no sea menor a un año atrás
    if (inicioDate < limiteInicio) {
      toast.warn(
        "La fecha de inicio no puede ser anterior a un año atrás desde hoy."
      );
      return;
    }

    // Validar que la fecha inicio no supere 1 año desde hoy
    if (inicioDate > unAnoDespues) {
      toast.warn("La fecha de inicio no puede ser más de 1 año desde hoy.");
      return;
    }

    // Validar que fecha fin sea igual o posterior a fecha inicio
    if (finDate < inicioDate) {
      toast.warn("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }

    // Validar que fecha fin no sea mayor a 1 año desde hoy
    if (finDate > unAnoDespues) {
      toast.warn("La fecha de fin no puede ser más de 1 año desde hoy.");
      return;
    }

    try {
      const res = await api.post("/convocatoria-crear", {
        nombre_convocatoria: form.nombre,
        descripcion: form.descripcion,
        fecha_inicio: form.inicio,
        fecha_final: form.fin,
      });
      toast.success("Convocatoria creada.");
      navigate(`/configuracion-convocatoria`);
    } catch {
      toast.error("Error al crear convocatoria.");
    }
  };

  const handleSalir = () =>
    navigate("/configuracion-convocatoria", {
      state: { message: "Creación cancelada.", type: "info" },
    });

  return (
    <div className="crear-config-page">
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
              />
            </div>

            <div className="acciones-crear">
              <div className="acciones-izquierda">
                <button type="submit" className="btn-crear">
                  Crear
                </button>
              </div>
              <div className="acciones-derecha">
                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={handleSalir}
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
