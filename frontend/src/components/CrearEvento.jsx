
import React, { useState, useEffect } from 'react';
import api from '../api/axios';

import { useNavigate } from 'react-router-dom'
import RegistroForm from "../components/RegistroForm";
import '../styles/CrearEvento.css'; // Importaremos el CSS que crearemos
import { BsLayoutTextWindowReverse } from "react-icons/bs";
import { BsCalendar3Event } from "react-icons/bs";
import { MdOutlineEventAvailable } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CrearEvento = () => {
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [idConvocatoria, setIdConvocatoria] = useState(''); //AGREGUE YO
  const [convocatorias, setConvocatorias] = useState([]); //AGUEGUE YO
  const navigate = useNavigate();

  // 🔥 Traemos las convocatorias apenas entra a la página
  useEffect(() => {
    const fetchConvocatorias = async () => {
      try {
        const response = await api.get('/convocatorias');
        console.log('Convocatorias:', response.data); // 👈 verifica esto
        setConvocatorias(response.data);
      } catch (error) {
        console.error('Error al cargar convocatorias:', error);
        toast.error('Error al cargar las convocatorias.');
      }
    };
  
    fetchConvocatorias();
  }, []);
  

  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!nombre || !fechaInicio || !fechaFin || !idConvocatoria) {
      toast.warn('Por favor, completa todos los campos.');
      return;
    }

    if (new Date(fechaInicio) > new Date(fechaFin)) {
      toast.warn('La fecha de inicio no puede ser después de la fecha de fin.');
      return;
    }
    // Validación extra (opcional pero buena práctica)
  if (isNaN(new Date(fechaInicio)) || isNaN(new Date(fechaFin))) {
    toast.error('Las fechas no son válidas.');
    return;
  }

  // 🔧 Formatear fechas (YYYY-MM-DD)
  const formatearFecha = (fecha) => new Date(fecha).toISOString().slice(0, 10);


  try {
    await api.post('/eventos', {
      nombre_evento: nombre,
      fecha_inicio: formatearFecha(fechaInicio),
      fecha_final: formatearFecha(fechaFin),
      id_convocatoria_convocatoria: idConvocatoria
    });

      toast.success('¡Se creó un nuevo evento EXITOSAMENTE!');

      setTimeout(() => {
        navigate('/eventos');
      }, 2000);
      
    } catch (error) {
      console.error('Error al crear evento:', error);
      toast.error('Ocurrió un error al crear el evento.');
    }
  };

  const handleSalir = () => {
    navigate('/eventos', { state: { message: 'Creación cancelada.', type: 'info' } });
  };

  return (
    <div className="crear-evento-page">
      <div className="container mt-4"> {/* Contenedor de Bootstrap */}
        <div className="card crear-evento-card"> {/* Usamos card para el estilo */}
          <div className="crear-evento-header">
            Crear Nuevo Evento {/* Cambiado de Evento a Convocatoria para consistencia */}
          </div>
          <div className="card-body">
            <form onSubmit={handleGuardar}>
              {/* Campo Nombre */}
              <div className="mb-3">
                
                <RegistroForm
                  label='Nombre del evento'
                  type="text"
                  className="form-control"
                  id="nombreEvento"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required // Hace el campo obligatorio en HTML5
                  usarEvento={true}
                  icono={BsLayoutTextWindowReverse}
                />
              </div>

              {/* Campo Fecha Inicio */}
              <div className="mb-3">
              <RegistroForm
                label="Fecha de Inicio"
                name="fechaInicio"
                type="date"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
                usarEvento={true}
                icono={BsCalendar3Event}
              />

              </div>

              {/* Campo Fecha Fin */}
              <div className="mb-3">
              <RegistroForm
                label="Fecha de Fin"
                name="fechaFin"
                type="date"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
                usarEvento={true}
                icono={MdOutlineEventAvailable}
              />
              /* Campo Seleccionar Convocatoria (select dinámico) */
              <div className="mb-3">
                <RegistroForm
                  label="Convocatoria"
                  name="idConvocatoria"
                  type="select"
                  value={idConvocatoria}
                  onChange={(e) => setIdConvocatoria(e.target.value)}
                  options={[
                    { value: "", label: "Seleccione una Convocatoria" },
                    ...convocatorias.map((convocatoria) => ({
                      value: convocatoria.id_convocatoria,
                      label: convocatoria.nombre_convocatoria, // o como se llame tu campo de nombre
                    }))
                  ]}
                  usarEvento={true}
                  icono={BsLayoutTextWindowReverse}
                />
              </div>

              </div>

              {/* Botones */}
              <div className="d-flex justify-content-end gap-2 mt-4">
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