import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Eventos.css';

const Eventos = () => {
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

  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);
  const navigate = useNavigate();

  const handleCrearEvento = () => {
    navigate("/crear-evento");
  };

  const handleVerEvento = () => {
    if (!eventoSeleccionado) return;
    alert(`Mostrando detalles del evento: ${eventoSeleccionado.nombre}`);
    // Podrías redirigir a /eventos/:id/ver o mostrar un modal
  };

  const handleEditarEvento = () => {
    if (!eventoSeleccionado) return;
    const hoy = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    if (hoy >= eventoSeleccionado.fechaInicio && hoy <= eventoSeleccionado.fechaFin) {
      alert(`Editando evento: ${eventoSeleccionado.nombre}`);
      navigate(`/editar-evento/${eventoSeleccionado.id}`);
    } else {
      alert("Este evento ya no se puede editar (fuera del rango del cronograma).");
    }
  };

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
      {/* Bloque de creación rápida (o parcial) de un nuevo evento 
      <div className="caja-container">
        <div className="caja-header">Crear nuevo evento</div>
        <div className="caja-body">
          <p>
            Aquí podrías mostrar un formulario breve para crear o pre-crear un evento.
            Sin embargo, el formulario completo se encuentra en <strong>CrearEvento</strong>.
          </p>
        </div>
      </div>

      {/* Bloque de eventos creados */}
      <div className="caja-container">
        <div className="caja-header">Eventos Creados</div>
        <div className="caja-body">
          <table className="tabla-eventos">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Fecha Inicio</th>
                <th>Fecha Fin</th>
                <th>Preinscripción</th>
                <th>Inscripción</th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr
                  key={evento.id}
                  onClick={() => setEventoSeleccionado(evento)}
                  className={
                    eventoSeleccionado?.id === evento.id ? "fila-seleccionada" : ""
                  }
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
            <button 
              className="nav-link" 
              onClick={handleCrearEvento}
            >
              Crear
            </button>

            <button 
              className="nav-link" 
              onClick={handleEditarEvento} 
              disabled={!eventoSeleccionado}
            >
              Editar
            </button>

            <button 
              className="nav-link" 
              onClick={handleVerEvento} 
              disabled={!eventoSeleccionado}
            >
              Ver
            </button>

            <button 
              className="nav-link" 
              onClick={handleEliminarEvento} 
              disabled={!eventoSeleccionado}
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventos;
