import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import RegistroForm from "../components/RegistroForm";
import '../styles/CrearEvento.css'; // Importaremos el CSS que crearemos
import { BsLayoutTextWindowReverse } from "react-icons/bs";
import { BsCalendar3Event } from "react-icons/bs";
import { MdOutlineEventAvailable } from "react-icons/md";

const CrearEvento = () => {
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const navigate = useNavigate();

  const handleGuardar = (e) => {
    e.preventDefault(); // Prevenir el envío por defecto del formulario

    // Validación simple (opcional pero recomendado)
    if (!nombre || !fechaInicio || !fechaFin) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // 1. Obtener los eventos existentes de localStorage
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

    // 2. Crear el nuevo objeto de evento
    // Usamos Date.now() para un ID simple y único (en una app real podrías usar UUID)
    // Mantenemos la estructura con 'cronograma' como en tu Eventos.jsx
    const nuevoEvento = {
      id: Date.now(),
      cronograma: {
        nombre: nombre,
        fechaInicio: fechaInicio,
        fechaFin: fechaFin,
      },
      // Puedes añadir más campos específicos del evento aquí si los necesitas en el futuro
    };

    // 3. Añadir el nuevo evento a la lista
    const updatedEvents = [...storedEvents, nuevoEvento];

    // 4. Guardar la lista actualizada en localStorage
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    // 5. Navegar de vuelta a la lista de eventos
    navigate('/eventos'); // Asegúrate que esta ruta coincide con tu configuración de rutas
  };

  const handleSalir = () => {
    navigate('/eventos'); // Navegar de vuelta sin guardar
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
    </div>
  );
};

export default CrearEvento;