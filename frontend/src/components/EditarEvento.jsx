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

  // estados de formulario
  const [nombre, setNombre] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  // fecha de inicio de la convocatoria
  const [fechaInicioConvocatoria, setFechaInicioConvocatoria] = useState(null);

  // flags de carga/guardado
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEvento = async () => {
      setCargando(true);
      setError("");
      try {
        // 1) Traer datos del evento
        const response = await api.get(`/eventos/${id}`);
        const data = Array.isArray(response.data)
          ? response.data[0]
          : response.data;

        setNombre(data.nombre_evento);
        setFechaInicio(data.fecha_inicio.split("T")[0]);
        setFechaFin(data.fecha_final.split("T")[0]);

        // 2) Con el ID de convocatoria, traer su fecha de inicio
        const idConv = data.id_convocatoria_convocatoria;
        if (idConv) {
          const convRes = await api.get(`/convocatoria-detalle/${idConv}`);
          const conv = Array.isArray(convRes.data)
            ? convRes.data[0]
            : convRes.data;
          if (conv && conv.fecha_inicio) {
            setFechaInicioConvocatoria(conv.fecha_inicio.split("T")[0]);
          } else {
            toast.error("No se pudo obtener la fecha de la convocatoria.");
          }
        }
      } catch (err) {
        console.error("Error al cargar evento:", err);
        setError("No se pudo cargar el evento.");
      } finally {
        setCargando(false);
      }
    };
    fetchEvento();
  }, [id]);

  const handleGuardar = async (e) => {
    e.preventDefault();

    // 1) Validar nombre
    const nombreTrim = nombre.trim();
    if (!nombreTrim) {
      toast.warn("El nombre no puede estar vacío o tener solo espacios.");
      return;
    }
    if (nombre !== nombreTrim) {
      toast.warn("El nombre no puede iniciar o terminar con espacios.");
      return;
    }
    const regex = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]*$/;
    if (!regex.test(nombreTrim)) {
      return toast.warn(
        "El nombre debe comenzar con letra y solo contener letras y espacios."
      );
    }
    if (nombreTrim.length > 100) {
      toast.warn("El nombre no puede superar 100 caracteres.");
      return;
    }

    // 2) Validar campos completos
    if (!fechaInicio || !fechaFin) {
      toast.warn("Por favor completa todas las fechas.");
      return;
    }

    // 3) Inicio ≤ Fin
    const inicioDate = new Date(fechaInicio);
    const finDate = new Date(fechaFin);
    if (inicioDate > finDate) {
      toast.warn("La fecha de inicio no puede ser posterior a la de fin.");
      return;
    }

    // 4) Validar rango según convocatoria
    if (!fechaInicioConvocatoria) {
      toast.error("Aún no se cargó la fecha de la convocatoria.");
      return;
    }
    const inicioConv = new Date(fechaInicioConvocatoria);
    const limiteConv = new Date(inicioConv);
    limiteConv.setFullYear(limiteConv.getFullYear() + 1);

    const validaDentroDeUnAnio = (d) => d >= inicioConv && d <= limiteConv;
    if (!validaDentroDeUnAnio(inicioDate)) {
      toast.error(
        `La fecha de inicio debe estar entre ${fechaInicioConvocatoria} y ${limiteConv
          .toISOString()
          .slice(0, 10)}.`
      );
      return;
    }
    if (!validaDentroDeUnAnio(finDate)) {
      toast.error(
        `La fecha de fin debe estar entre ${fechaInicioConvocatoria} y ${limiteConv
          .toISOString()
          .slice(0, 10)}.`
      );
      return;
    }

    // 5) Envío al backend
    const payload = {
      id_evento: parseInt(id, 10),
      nombre_evento: nombreTrim,
      fecha_inicio: fechaInicio,
      fecha_final: fechaFin,
    };

    try {
      setGuardando(true);
      await api.put(`/eventos/${id}`, payload);
      navigate("/eventos", {
        state: { message: "Evento editado exitosamente.", type: "success" },
      });
    } catch (err) {
      console.error("Error al actualizar evento:", err);
      const msg =
        err.response?.data?.message || "Error al actualizar el evento.";
      toast.error(msg);
    } finally {
      setGuardando(false);
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
          height: "60vh",
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

  return (
    <div className="editar-evento-page">
      <div className="editar-evento-container">
        <div className="editar-evento-card">
          <div className="editar-evento-header">Editar Evento</div>
          <div className="card-body">
            <form onSubmit={handleGuardar}>
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
                  disabled={guardando}
                />
              </div>

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
                  disabled={guardando}
                />
              </div>

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
                  disabled={guardando}
                />
              </div>

              <div className="d-flex justify-content-end gap-2 mt-4">
                <button
                  type="submit"
                  className="btn-custom-primary-aux"
                  disabled={guardando}
                >
                  {guardando ? "Guardando..." : "Guardar Cambios"}
                </button>
                <button
                  type="button"
                  className="btn-custom-secondary-aux"
                  onClick={handleSalir}
                  disabled={guardando}
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
