import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Si usas React Router
import '../styles/Eventos.css'; // Aquí colocarías tus estilos, incluyendo .evento-container, .evento-header, .evento-body
import RegistroForm from '../components/RegistroForm'; // Ajusta la ruta si difiere en tu proyecto


const Eventos = () => {
  // Estado local de ejemplo para eventos creados
  const [eventos, setEventos] = useState([
    {
      id: 1,
      nombre: "Olimpiada de Matemáticas",
      fechaInicio: "2023-04-10",
      fechaFin: "2023-04-15",
      fechaPreinscripcion: "2023-04-01",
      fechaInscripcion: "2023-04-05",
    },
    {
      id: 2,
      nombre: "Olimpiada de Física",
      fechaInicio: "2023-05-01",
      fechaFin: "2023-05-06",
      fechaPreinscripcion: "2023-04-20",
      fechaInscripcion: "2023-04-25",
    },
  ]);

  // Estado para la selección de fila en la tabla
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const navigate = useNavigate();

  // Crear nuevo evento: redirección a la página de creación
  const handleCrearEvento = () => {
    navigate("/crear-evento");
  };

  // Ver evento (ejemplo simple con alert; puedes redirigir o usar un modal)
  const handleVerEvento = () => {
    if (!eventoSeleccionado) return;
    alert(`Mostrando detalles del evento: ${eventoSeleccionado.nombre}`);
  };

  // Editar evento (solo si la fecha actual está dentro del rango)
  const handleEditarEvento = () => {
    if (!eventoSeleccionado) return;
    const hoy = new Date().toISOString().split("T")[0]; // Formato "YYYY-MM-DD"
    if (hoy >= eventoSeleccionado.fechaInicio && hoy <= eventoSeleccionado.fechaFin) {
      alert(`Editando evento: ${eventoSeleccionado.nombre}`);
      navigate(`/editar-evento/${eventoSeleccionado.id}`);
    } else {
      alert("Este evento ya no se puede editar (fuera del rango del cronograma).");
    }
  };

  // Eliminar evento
  const handleEliminarEvento = () => {
    if (!eventoSeleccionado) return;
    const confirmacion = window.confirm(`¿Deseas eliminar el evento "${eventoSeleccionado.nombre}"?`);
    if (confirmacion) {
      setEventos(prev => prev.filter(ev => ev.id !== eventoSeleccionado.id));
      setEventoSeleccionado(null);
    }
  };

  return (
    <div className="page-container">
      {/* Bloque: Crear nuevo evento 
      <div className="evento-container">
        <div className="evento-header">Crear nuevo evento</div>
        <div className="evento-body">
          <h2>Cronograma</h2>
          <div className="contenedor-cronograma-convocatoria">
            <section className="cont-form-cronograma">
              <RegistroForm label="Nombre del evento" />
              <RegistroForm label="Fecha de inicio" type="date" />
              <RegistroForm label="Fecha de Preinscripción" type="date" />
            </section>
            <section className="cont-form-cronograma">
              <RegistroForm label="Duración (días)" />
              <RegistroForm label="Fecha fin" type="date" />
              <RegistroForm label="Fecha de Inscripción" type="date" />
            </section>
          </div>
        </div>
      </div>
      */}
      {/* Bloque: Eventos creados */}
      <div className="evento-container">
        <div className="evento-header">Eventos Creados</div>
        <div className="evento-body">
          <table className="tabla-eventos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Fecha Preinscripción</th>
                <th>Fecha Inscripción</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr
                  key={evento.id}
                  onClick={() => setEventoSeleccionado(evento)}
                  className={eventoSeleccionado?.id === evento.id ? "fila-seleccionada" : ""}
                >
                  <td>{evento.nombre}</td>
                  <td>{evento.fechaInicio}</td>
                  <td>{evento.fechaFin}</td>
                  <td>{evento.fechaPreinscripcion}</td>
                  <td>{evento.fechaInscripcion}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="acciones-eventos">
            <button className="nav-link" onClick={handleCrearEvento}>Crear</button>
            <button className='nav-link' onClick={handleEditarEvento} disabled={!eventoSeleccionado}>Editar</button>
            <button className='nav-link' onClick={handleVerEvento} disabled={!eventoSeleccionado}>Ver</button>
            <button className='nav-link' onClick={handleEliminarEvento} disabled={!eventoSeleccionado}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventos;
