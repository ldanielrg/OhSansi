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
    try {
      const res = await api.post("/convocatoria-crear", {
        nombre_convocatoria: form.nombre,
        descripcion: form.descripcion,
        fecha_inicio: form.inicio,
        fecha_final: form.fin,
      });
      const newId = res.data.id_convocatoria; // <-- Asume que viene aquí
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
