import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CrearEvento.css'; // Importaremos el CSS que crearemos
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    navigate('/eventos', { state: { message: 'Creación de evento completada.', type: 'success' } });
  };

  const handleSalir = () => {
    navigate('/eventos', { state: { message: 'Creación cancelada.', type: 'info' } });
  };

  return (
    <div className="crear-evento-page">
      <div className="container mt-4"> {/* Contenedor de Bootstrap */}
        <div className="card crear-evento-card"> {/* Usamos card para el estilo */}
          <div className="card-header crear-evento-header">
            Crear Nuevo Evento {/* Cambiado de Evento a Convocatoria para consistencia */}
          </div>
          <div className="card-body">
            <form onSubmit={handleGuardar}>
              {/* Campo Nombre */}
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
                  required // Hace el campo obligatorio en HTML5
                />
              </div>

              {/* Campo Fecha Inicio */}
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
                />
              </div>

              {/* Campo Fecha Fin */}
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
                />
              </div>

              {/* Botones */}
              <div className="d-flex justify-content-end gap-2 mt-4">
                <button type="submit" className="btn btn-custom-primary">
                  Guardar
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleSalir}>
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