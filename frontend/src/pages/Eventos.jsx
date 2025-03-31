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
    const confirmacion = window.confirm(`¿Deseas eliminar el evento "${eventoSeleccionado.nombre}"?`);
    if (confirmacion) {
      // Eliminar del estado
      setEventos((prev) => prev.filter((ev) => ev.id !== eventoSeleccionado.id));
      setEventoSeleccionado(null);
    }
  }; 
  

  return <></>;
};

export default Eventos;
