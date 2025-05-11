// src/pages/CrearEvento.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api/axios';
import RegistroForm from '../components/RegistroForm';
import '../styles/CrearEvento.css';
import { BsLayoutTextWindowReverse, BsCalendar3Event } from 'react-icons/bs';
import { MdOutlineEventAvailable } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrearEvento = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { idConvocatoria } = location.state || {};
  useEffect(() => {
    if (!idConvocatoria) {
      toast.error('Falta el ID de convocatoria. Regresa desde la lista de eventos.');
      navigate('/eventos');
    }
  }, [idConvocatoria, navigate]);

  const [formData, setFormData] = useState({
    nombre: '',
    fechaInicio: '',
    fechaFin: '',
  });

  const handleGuardar = async (e) => {
    e.preventDefault();
    const { nombre, fechaInicio, fechaFin } = formData;

    // Validaciones
    if (!nombre || !fechaInicio || !fechaFin) {
      toast.warn('Por favor completa todos los campos.');
      return;
    }
    if (new Date(fechaInicio) > new Date(fechaFin)) {
      toast.warn('La fecha de inicio no puede ser posterior a la de fin.');
      return;
    }

    // Preparamos el objeto tal como el backend lo espera
    const payload = {
      id_convocatoria_convocatoria: idConvocatoria,  // clave exacta de la columna
      nombre_evento: formData.nombre,
      fecha_inicio: formData.fechaInicio,
      fecha_final: formData.fechaFin,
    };

    console.log('Payload a enviar:', payload);

    try {
      api.post('/eventos', payload);
      navigate('/eventos',{
        state: {
          message:'!Evento creado exitosamente.',
          type: 'success',
          idConvocatoria: idConvocatoria     // <-- esto es nuevo
        }
      });
    } catch (error) {
      console.error('Error al crear evento:', error);
      // Si el backend devuelve un mensaje de error en response.data.message, lo mostramos
      const msg = error.response?.data?.message || error.message;
      toast.error(`Error: ${msg}`);
    }
  };

  const handleSalir = () => {
    navigate('/eventos', { state: { message: 'Creación cancelada.', type: 'info' } });
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
                <button type="button" className="btn-custom-secondary-aux" onClick={handleSalir}>
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