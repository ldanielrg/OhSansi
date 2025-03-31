import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Si usas React Router
import '../styles/Eventos.css'; // Aquí colocarías tus estilos, incluyendo .caja-container, .caja-header, .caja-body
import RegistroForm from '../components/RegistroForm'; // Ajusta la ruta si difiere en tu proyecto

const Eventos = () => {
  // Estado local para almacenar los eventos ya creados (ejemplo)
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

  // Estado para saber cuál fila/registro se seleccionó en la tabla
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // Hook de navegación (asumiendo que usas React Router)
  const navigate = useNavigate();

  // Función para manejar el clic en "Crear evento"
  const handleCrearEvento = () => {
    // Aquí rediriges a tu componente/página de creación de evento
    navigate("/crear-evento");
  };

  // Función para manejar el clic en "Ver" (ejemplo simple)
  const handleVerEvento = () => {
    if (!eventoSeleccionado) return;
    alert(`Mostrando detalles del evento: ${eventoSeleccionado.nombre}`);
    // Podrías redirigir a "/eventos/:id/ver" o mostrar un modal con más info
  };

  // Función para manejar el clic en "Editar" (verifica fechas)
  const handleEditarEvento = () => {
    if (!eventoSeleccionado) return;
    const hoy = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
    if (hoy >= eventoSeleccionado.fechaInicio && hoy <= eventoSeleccionado.fechaFin) {
      alert(`Editando evento: ${eventoSeleccionado.nombre}`);
      // Redirige o muestra modal de edición
      navigate(`/editar-evento/${eventoSeleccionado.id}`);
    } else {
      alert("Este evento ya no se puede editar (fuera del rango del cronograma).");
    }
  };

  // Función para manejar el clic en "Eliminar"
  const handleEliminarEvento = () => {
    if (!eventoSeleccionado) return;
    const confirmacion = window.confirm(`¿Deseas eliminar el evento "${eventoSeleccionado.nombre}"?`);
    if (confirmacion) {
      // Eliminar del estado local
      setEventos(prev => prev.filter(ev => ev.id !== eventoSeleccionado.id));
      setEventoSeleccionado(null);
    }
  };

  return (
    <div className="page-container">
      {/* Bloque para "Crear nuevo evento" 
      <div className="caja-container">
        <div className="caja-header">Crear nuevo evento</div>
        <div className="caja-body">
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
      {/* Bloque para "Eventos Creados" */}
      <div className="caja-container">
        <div className="caja-header">Eventos Creados</div>
        <div className="caja-body">
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

          {/* Botones para acciones con el evento seleccionado */}
          <div className="acciones-eventos">
            <button onClick={handleCrearEvento}>Crear</button>
            <button onClick={handleEditarEvento} disabled={!eventoSeleccionado}>Editar</button>
            <button onClick={handleVerEvento} disabled={!eventoSeleccionado}>Ver</button>
            <button onClick={handleEliminarEvento} disabled={!eventoSeleccionado}>Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eventos;
