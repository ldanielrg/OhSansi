import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Si usas React Router
import "../styles/Eventos.css";
import Caja from "../components/Caja";
import RegistroForm from "../components/RegistroForm";

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

  // Estado para saber cuál fila/registro se seleccionó en la tabla
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // Hook de navegación (asumiendo que usas React Router)
  const navigate = useNavigate();

  // Función para manejar el clic en "Crear evento"
  const handleCrearEvento = () => {
    // Aquí rediriges a tu componente/página de creación
    // donde estará el registro de cronograma y convocatoria
    navigate("/crear-evento");
  };

  // Función para manejar el clic en "Ver" (se asume que tenemos un componente o página de detalle)
  const handleVerEvento = () => {
    if (!eventoSeleccionado) return;
    // Podrías redirigir a algo como "/eventos/:id/ver"
    // o mostrar un modal con los datos completos del evento
    alert(`Mostrando detalles del evento: ${eventoSeleccionado.nombre}`);
  };

  // Función para manejar el clic en "Editar"
  // Solo posible si está en el rango del cronograma
  const handleEditarEvento = () => {
    if (!eventoSeleccionado) return;
    // Aquí deberías verificar si la fecha actual se encuentra
    // dentro de la fechaInicio y fechaFin del evento.
    const hoy = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    if (
      hoy >= eventoSeleccionado.fechaInicio &&
      hoy <= eventoSeleccionado.fechaFin
    ) {
      alert(`Editando evento: ${eventoSeleccionado.nombre}`);
      // Rediriges o abres un formulario de edición
      navigate(`/editar-evento/${eventoSeleccionado.id}`);
    } else {
      alert(
        "Este evento ya no se puede editar (fuera del rango del cronograma)."
      );
    }
  };
  // Función para manejar el clic en "Eliminar"
  const handleEliminarEvento = () => {
    if (!eventoSeleccionado) return;
    const confirmacion = window.confirm(
      `¿Deseas eliminar el evento "${eventoSeleccionado.nombre}"?`
    );
    if (confirmacion) {
      // Eliminar del estado
      setEventos((prev) =>
        prev.filter((ev) => ev.id !== eventoSeleccionado.id)
      );
      setEventoSeleccionado(null);
    }
  };

  return (
    <>
      <div className="page-container">
        {/* Sección de creación rápida (o parcial) de un nuevo evento */}
        <Caja titulo="Crear nuevo evento">
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
        </Caja>

        {/* Sección de eventos creados */}
        <Caja titulo="Eventos Creados">
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
                    eventoSeleccionado?.id === evento.id
                      ? "fila-seleccionada"
                      : ""
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

          {/* Botones de acciones (Crear, Editar, Ver, Eliminar) */}
          <div className="acciones-eventos">
            <button onClick={handleCrearEvento}>Crear</button>
            <button onClick={handleEditarEvento} disabled={!eventoSeleccionado}>
              Editar
            </button>
            <button onClick={handleVerEvento} disabled={!eventoSeleccionado}>
              Ver
            </button>
            <button
              onClick={handleEliminarEvento}
              disabled={!eventoSeleccionado}
            >
              Eliminar
            </button>
          </div>
        </Caja>
      </div>
    </>
  );
};

export default Eventos;
