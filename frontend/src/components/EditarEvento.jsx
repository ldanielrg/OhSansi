import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import RegistroForm from '../components/RegistroForm';
import '../styles/CrearEvento.css';
import { BsLayoutTextWindowReverse, BsCalendar3Event } from 'react-icons/bs';
import { MdOutlineEventAvailable } from 'react-icons/md';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditarEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [idConvocatoria, setIdConvocatoria] = useState('');
  const [convocatorias, setConvocatorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDatos = async () => {
      try {
        const [eventoRes, convocatoriasRes] = await Promise.all([
          api.get(`/eventos/${id}`),
          api.get('/convocatorias')
        ]);

        const evento = eventoRes.data;
        setNombre(evento.nombre_evento);
        setFechaInicio(evento.fecha_inicio?.slice(0, 10) || '');
        setFechaFin(evento.fecha_final?.slice(0, 10) || '');
        setIdConvocatoria(evento.id_convocatoria_convocatoria);
        setConvocatorias(convocatoriasRes.data);
      } catch (err) {
        console.error(`Error cargando datos del evento ${id}:`, err);
        setError(`No se pudo cargar el evento con ID ${id}`);
      } finally {
        setCargando(false);
      }
    };

    fetchDatos();
  }, [id]);

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nombre || !fechaInicio || !fechaFin || !idConvocatoria) {
      toast.warn('Completa todos los campos.');
      return;
    }

    try {
      await api.put(`/eventos/${id}`, {
        nombre_evento: nombre,
        fecha_inicio: fechaInicio,
        fecha_final: fechaFin,
        id_convocatoria_convocatoria: idConvocatoria
      });

      toast.success('Evento actualizado exitosamente.');
      setTimeout(() => navigate('/eventos'), 2000);
    } catch (err) {
      console.error('Error al actualizar:', err);
      toast.error('Error al guardar los cambios.');
    }
  };

  const handleSalir = () => navigate('/eventos');

  if (cargando) return <p className="container mt-4">Cargando datos del evento...</p>;

  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger">{error}</div>
        <button className="btn btn-secondary" onClick={handleSalir}>Volver</button>
      </div>
    );
  }

  return (
    <div className="crear-evento-page">
      <div className="container mt-4">
        <div className="card crear-evento-card">
          <div className="crear-evento-header">Editar Evento</div>
          <div className="card-body">
            <form onSubmit={handleGuardar}>
              <div className="mb-3">
                <RegistroForm
                  label='Nombre del evento'
                  type='text'
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  usarEvento={true}
                  icono={BsLayoutTextWindowReverse}
                />
              </div>
              <div className="mb-3">
                <RegistroForm
                  label='Fecha de Inicio'
                  type='date'
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  usarEvento={true}
                  icono={BsCalendar3Event}
                />
              </div>
              <div className="mb-3">
                <RegistroForm
                  label='Fecha de Fin'
                  type='date'
                  value={fechaFin}
                  onChange={(e) => setFechaFin(e.target.value)}
                  usarEvento={true}
                  icono={MdOutlineEventAvailable}
                />
              </div>
              <div className="mb-3">
                <RegistroForm
                  label='Convocatoria'
                  name='idConvocatoria'
                  type='select'
                  value={idConvocatoria}
                  onChange={(e) => setIdConvocatoria(e.target.value)}
                  options={[
                    { value: '', label: 'Seleccione una Convocatoria' },
                    ...convocatorias.map(c => ({
                      value: c.id_convocatoria,
                      label: c.nombre_convocatoria
                    }))
                  ]}
                  usarEvento={true}
                  icono={BsLayoutTextWindowReverse}
                />
              </div>
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="submit" className="btn-custom-primary-aux">Guardar Cambios</button>
                <button type="button" className="btn-custom-secondary-aux" onClick={handleSalir}>Salir Sin Guardar</button>
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
