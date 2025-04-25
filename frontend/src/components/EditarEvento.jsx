import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../styles/EditarEvento.css'; // Importamos el nuevo archivo CSS

const EditarEvento = () => {
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [eventoOriginal, setEventoOriginal] = useState(null); // Para guardar el evento original
  const [cargando, setCargando] = useState(true); // Estado para indicar si se están cargando datos
  const [error, setError] = useState(''); // Para manejar errores

  const { id } = useParams(); // Obtiene el 'id' de la URL (ej: /editar-evento/1678886400000)
  const navigate = useNavigate();

  // Efecto para cargar los datos del evento cuando el componente se monta o el ID cambia
  useEffect(() => {
    setCargando(true);
    setError('');
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];
    // Buscamos el evento. ¡Importante convertir el ID de la URL (string) a número!
    const eventoAEditar = storedEvents.find(ev => ev.id === parseInt(id, 10));

    if (eventoAEditar) {
      setEventoOriginal(eventoAEditar); // Guardamos el original por si acaso
      // Rellenamos el estado del formulario con los datos del evento encontrado
      setNombre(eventoAEditar.cronograma.nombre);
      setFechaInicio(eventoAEditar.cronograma.fechaInicio);
      setFechaFin(eventoAEditar.cronograma.fechaFin);
    } else {
      // Si no se encuentra el evento, mostramos un error y podríamos redirigir
      console.error(`Evento con ID ${id} no encontrado.`);
      setError(`La convocatoria con ID ${id} no fue encontrada.`);
      // Opcional: Redirigir después de un tiempo o inmediatamente
      // setTimeout(() => navigate('/eventos'), 3000);
    }
    setCargando(false); // Terminamos la carga
  }, [id]); // Dependencia: se ejecuta si el 'id' cambia

  const handleGuardar = (e) => {
    e.preventDefault();

    if (!nombre || !fechaInicio || !fechaFin) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    // 1. Obtener los eventos existentes
    const storedEvents = JSON.parse(localStorage.getItem('events')) || [];

    // 2. Crear la lista actualizada de eventos
    const updatedEvents = storedEvents.map(evento => {
      // Si el ID coincide, devolvemos el objeto modificado
      if (evento.id === parseInt(id, 10)) {
        return {
          ...evento, // Mantenemos el ID original y otras propiedades si las hubiera
          cronograma: { // Actualizamos solo el cronograma
            nombre: nombre,
            fechaInicio: fechaInicio,
            fechaFin: fechaFin,
          }
        };
      }
      // Si no coincide, devolvemos el evento sin cambios
      return evento;
    });

    // 3. Guardar la lista actualizada en localStorage
    localStorage.setItem('events', JSON.stringify(updatedEvents));

    // 4. Navegar de vuelta a la lista
    navigate('/eventos');
  };

  const handleSalir = () => {
    navigate('/eventos');
  };

  // Mientras carga, muestra un mensaje
  if (cargando) {
    return <div className="container mt-4"><p>Cargando datos de la convocatoria...</p></div>;
  }

  // Si hubo un error al cargar
  if (error) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          Error: {error}
        </div>
        <button className="btn btn-secondary" onClick={handleSalir}>Volver a la lista</button>
      </div>
    );
  }

  // Si todo está bien, muestra el formulario
  return (
    <div className="editar-evento-page"> {/* Cambiamos clase para posible CSS específico */}
      <div className="container mt-4">
        <div className="card editar-evento-card">
          <div className="card-header editar-evento-header">
            Editar Evento
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
                  required
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
                  Guardar Cambios
                </button>
                <button type="button" className="btn btn-secondary" onClick={handleSalir}>
                  Salir Sin Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarEvento;