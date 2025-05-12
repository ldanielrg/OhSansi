import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../styles/CrearConfiguracionConvocatoria.css";
import { ToastContainer, toast } from "react-toastify";

export default function EditarConfiguracionConvocatoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    inicio: "",
    fin: "",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const { data } = await api.get(`/convocatoria-detalle/${id}`);
        setForm({
          nombre: data.nombre_convocatoria,
          descripcion: data.descripcion,
          inicio: data.fecha_inicio.split("T")[0],
          fin: data.fecha_final.split("T")[0],
        });
      } catch {
        toast.error("Error cargando datos.");
      }
    };
    cargarDatos();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/convocatoria-editar/${id}`, {
        nombre_convocatoria: form.nombre,
        descripcion: form.descripcion,
        fecha_inicio: form.inicio,
        fecha_final: form.fin,
        activo: true,
      });
      toast.success("Convocatoria actualizada.");
    } catch {
      toast.error("Error al actualizar.");
    }
  };

  const irGestionar = () => {
    navigate(`/configuracion-convocatoria/gestionar/${id}`);
  };

  const handleSalir = () => {
    navigate("/configuracion-convocatoria");
  };

  return (
    <div className="crear-config-page">
      <div className="crear-config-container">
        <div className="crear-config-card">
          <div className="crear-config-header">Editar Convocatoria</div>
          <form className="crear-config-body" onSubmit={handleGuardar}>
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
                  Guardar cambios
                </button>
                <button
                  type="button"
                  className="btn-gestionar"
                  onClick={irGestionar}
                >
                  Gestionar convocatoria
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
