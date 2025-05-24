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
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    setGuardando(true);

    // Aquí puedes agregar validaciones si quieres (fechas, etc)

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
    } finally {
      setGuardando(false);
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

          {cargando ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "250px",
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
                  <button type="submit" className="btn-crear" disabled={guardando}>
                    {guardando ? (
                      <BallTriangle
                        height={20}
                        width={20}
                        radius={5}
                        color="#fff"
                        ariaLabel="guardando-cargando"
                        visible={true}
                      />
                    ) : (
                      "Guardar cambios"
                    )}
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
