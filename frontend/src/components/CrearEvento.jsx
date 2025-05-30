import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../api/axios";
import RegistroForm from "../components/RegistroForm";
import "../styles/CrearEvento.css";
import { BsLayoutTextWindowReverse, BsCalendar3Event } from "react-icons/bs";
import { MdOutlineEventAvailable } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CrearEvento = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { idConvocatoria } = location.state || {};
  const [fechaInicioConvocatoria, setFechaInicioConvocatoria] = useState(null);

  useEffect(() => {
    if (!idConvocatoria) {
      toast.error(
        "Falta el ID de convocatoria. Regresa desde la lista de eventos."
      );
      navigate("/eventos");
    } else {
      // Obtener fecha inicio convocatoria
      api
        .get(`/convocatoria-detalle/${idConvocatoria}`)
        .then(({ data }) => {
          if (data && data[0] && data[0].fecha_inicio) {
            setFechaInicioConvocatoria(data[0].fecha_inicio.split("T")[0]);
          } else {
            toast.error(
              "No se pudo obtener la fecha de inicio de la convocatoria."
            );
          }
        })
        .catch(() => {
          toast.error("Error al obtener la convocatoria.");
        });
    }
  }, [idConvocatoria, navigate]);

  const [formData, setFormData] = useState({
    nombre: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const isFechaValida = (fechaEvento) => {
    if (!fechaInicioConvocatoria) return true; // aún no cargó convocatoria

    const inicio = new Date(fechaInicioConvocatoria);
    const limite = new Date(inicio);
    limite.setFullYear(limite.getFullYear() + 1);

    const eventoDate = new Date(fechaEvento);

    return eventoDate >= inicio && eventoDate <= limite;
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    const { nombre, fechaInicio, fechaFin } = formData;

    // 1. Validar nombre
    const nombreTrim = nombre.trim();
    if (!nombreTrim) {
      toast.warn("El nombre no puede estar vacío o tener sólo espacios.");
      return;
    }
    const regex = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]*$/;
    if (!regex.test(nombreTrim)) {
      return toast.warn(
        "El nombre debe comenzar con letra y solo contener letras y espacios."
      );
    }
    if (nombre !== nombreTrim) {
      toast.warn("El nombre no puede iniciar ni terminar con espacios.");
      return;
    }
    if (nombreTrim.length > 100) {
      toast.warn("El nombre no puede superar 100 caracteres.");
      return;
    }

    if (!fechaInicio || !fechaFin) {
      toast.warn("Por favor completa todas las fechas.");
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      toast.warn("La fecha de inicio no puede ser posterior a la de fin.");
      return;
    }

    const inicioConv = new Date(fechaInicioConvocatoria);
    const limite = new Date(inicioConv);
    limite.setFullYear(limite.getFullYear() + 1);

    const validaDentroDeUnAnio = (fechaStr) => {
      const d = new Date(fechaStr);
      return d >= inicioConv && d <= limite;
    };

    if (!validaDentroDeUnAnio(fechaInicio)) {
      toast.error(
        `La fecha de inicio del evento debe estar entre ${fechaInicioConvocatoria} y ${limite
          .toISOString()
          .slice(0, 10)}.`
      );
      return;
    }
    if (!validaDentroDeUnAnio(fechaFin)) {
      toast.error(
        `La fecha de fin del evento debe estar entre ${fechaInicioConvocatoria} y ${limite
          .toISOString()
          .slice(0, 10)}.`
      );
      return;
    }

    // 5. Enviar payload
    const payload = {
      id_convocatoria_convocatoria: idConvocatoria,
      nombre_evento: nombreTrim,
      fecha_inicio: fechaInicio,
      fecha_final: fechaFin,
    };

    try {
      await api.post("/eventos", payload);
      toast.success("Evento creado exitosamente.");
      navigate("/eventos", {
        state: {
          message: "!Evento creado exitosamente.",
          type: "success",
          idConvocatoria,
        },
      });
    } catch (error) {
      console.error("Error al crear evento:", error);
      const msg = error.response?.data?.message || error.message;
      toast.error(`Error: ${msg}`);
    }
  };

  const handleSalir = () => {
    navigate("/eventos", {
      state: { message: "Creación cancelada.", type: "info" },
    });
  };

  return (
    <div className="crear-evento-page">
      <div className="crear-evento-container">
        <div className="crear-evento-card">
          <div className="crear-evento-header">Crear Nuevo Evento</div>
          <div className="card-body">
            <form onSubmit={handleGuardar}>
              <div className="mb-3">
                <RegistroForm
                  label="Nombre del evento"
                  name="nombre"
                  type="text"
                  value={formData.nombre}
                  onChange={setFormData}
                  required
                  icono={BsLayoutTextWindowReverse}
                />
              </div>

              <div className="mb-3">
                <RegistroForm
                  label="Fecha de Inicio"
                  name="fechaInicio"
                  type="date"
                  value={formData.fechaInicio}
                  onChange={setFormData}
                  required
                  icono={BsCalendar3Event}
                />
              </div>

              <div className="mb-3">
                <RegistroForm
                  label="Fecha de Fin"
                  name="fechaFin"
                  type="date"
                  value={formData.fechaFin}
                  onChange={setFormData}
                  required
                  icono={MdOutlineEventAvailable}
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-custom-primary-aux">
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn-custom-secondary-aux"
                  onClick={handleSalir}
                >
                  Salir
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

export default CrearEvento;
