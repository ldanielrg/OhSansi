import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import "../styles/CrearConfiguracionConvocatoria.css";
import { ToastContainer, toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";

export default function EditarConfiguracionConvocatoria() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    descripcion: "",
    inicio: "",
    fin: "",
  });

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        const { data } = await api.get(`/convocatoria-detalle/${id}`);
        const conv = data[0];
        if (!conv.activo) {
        toast.error("No puedes editar una convocatoria inactiva.");
        navigate("/configuracion-convocatoria");
        return;
      }
        if (conv) {
          
          setForm({
            nombre: conv.nombre_convocatoria,
            descripcion: conv.descripcion,
            inicio: conv.fecha_inicio?.split("T")[0] || "",
            fin: conv.fecha_final?.split("T")[0] || "",
          });
        } else {
          toast.error("No se encontró la convocatoria.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error cargando datos.");
      } finally {
        setCargando(false);
      }
    };
    cargarDatos();
  }, [id]);

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

  const handleGuardar = async (e) => {
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

    // Validación fechas ±1 año
    const limiteInicio = new Date(hoy);
    limiteInicio.setFullYear(limiteInicio.getFullYear() - 1);
    if (inicioDate < limiteInicio) {
      toast.warn(
        "La fecha de inicio no puede ser anterior a un año atrás desde hoy."
      );
      return;
    }
    const limiteFinHoy = new Date(hoy);
    limiteFinHoy.setFullYear(limiteFinHoy.getFullYear() + 1);
    if (inicioDate > limiteFinHoy) {
      toast.warn("La fecha de inicio no puede ser más de un año desde hoy.");
      return;
    }
    const minFin = new Date(inicioDate);
    minFin.setFullYear(minFin.getFullYear() - 1);
    const maxFin = new Date(inicioDate);
    maxFin.setFullYear(maxFin.getFullYear() + 1);
    if (finDate < minFin || finDate > maxFin) {
      toast.warn(
        "La fecha de fin debe estar dentro de un año antes o después de la fecha de inicio."
      );
      return;
    }
    if (inicioDate > finDate) {
      toast.warn("La fecha de inicio no puede ser posterior a la de fin.");
      return;
    }

    setGuardando(true);
    try {
      await api.post(`/convocatoria-editar/${id}`, {
        nombre_convocatoria: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
        fecha_inicio: form.inicio,
        fecha_final: form.fin,
        activo: true,
      });
      toast.success("Convocatoria actualizada.");
    } catch {
      toast.error("Error al actualizar.");
    } finally {
      setGuardando(false);
    }
  };

  const irGestionar = () =>
    navigate(`/configuracion-convocatoria/gestionar/${id}`);
  const handleSalir = () => navigate("/configuracion-convocatoria");

  return (
    <div className="crear-config-page">
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
          <div className="crear-config-header">Editar Convocatoria</div>
          {cargando ? (
            <div className="spinner-container">
              <BallTriangle
                height={80}
                width={80}
                radius={5}
                color="#003366"
                visible={true}
              />
            </div>
          ) : (
            <form className="crear-config-body" onSubmit={handleGuardar}>
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
                    {guardando ? "Guardando…" : "Guardar cambios"}
                  </button>
                  <button
                    type="button"
                    className="btn-gestionar"
                    onClick={irGestionar}
                    disabled={guardando}
                  >
                    Gestionar convocatoria
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
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
