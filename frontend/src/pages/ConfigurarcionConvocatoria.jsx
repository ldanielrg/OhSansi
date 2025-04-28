// src/pages/ConfiguracionConvocatoria.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ConfiguracionConvocatoria.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ConfiguracionConvocatoria = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("convocatorias")) || [];
    setConvocatorias(stored);
  }, []);

  const handleNavigate = (path) => (e) => {
    // e.preventDefault(); // Ya no necesitamos prevenir el default aquí si solo llamamos a navigate
    navigate(path);
  };

  const handleCrear =
    convocatorias.length === 0 // Mantén la restricción de 1 convocatoria
      ? handleNavigate("/crear-configuracion-convocatoria")
      : () => {
          // Opcional: podrías mostrar una alerta aquí si quieres
          // alert('Solo se permite crear una convocatoria a la vez.');
          
        };

  // --- CORRECCIÓN AQUÍ ---
  // Si hay una convocatoria seleccionada, navega a la ruta de edición incluyendo su ID.
  const handleEditar = selected
    ? handleNavigate(`/editar-configuracion-convocatoria/${selected.id}`) // <-- Pasa el ID aquí
    : () => {}; // Si no hay nada seleccionado, no hace nada.
  // ---------------------

  const promptDelete = (e) => {
    e.preventDefault();
    if (selected) setShowDeleteModal(true);
  };

  const confirmDelete = () => {
  const updated = convocatorias.filter(c => c.id !== selected.id);
  localStorage.setItem('convocatorias', JSON.stringify(updated));
  setConvocatorias(updated);
  setSelected(null);
  setShowDeleteModal(false);
  toast.error(`Convocatoria "${selected.nombre}" eliminada.`);
};

  const cancelDelete = () => {
    setShowDeleteModal(false);
  };

  return (
    <div className="config-page">
      <div className="config-container">
        <div className="config-header">Convocatoria</div>
        <div className="config-body">
          {convocatorias.length === 0 ? (
            <p>No hay convocatoria</p>
          ) : (
            <table className="tabla-config">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th style={{ width: "500px" }}>Descripción</th>
                </tr>
              </thead>
              <tbody>
                {convocatorias.map((c) => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={selected?.id === c.id ? "fila-seleccionada" : ""}
                  >
                    <td>{c.nombre}</td>
                    <td>{c.descripcion}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          <div className="acciones-container">
            <div className="acciones-left">
              {/* El botón Crear se deshabilita si ya existe una convocatoria */}
              <button
                className="btn-primary"
                onClick={handleCrear}
                disabled={convocatorias.length > 0}
              >
                Crear
              </button>
              {/* El botón Editar se deshabilita si no hay selección */}
              <button
                className="btn-primary"
                onClick={handleEditar}
                disabled={!selected}
              >
                Editar
              </button>
            </div>
            <div className="acciones-right">
              {/* El botón Eliminar se deshabilita si no hay selección */}
              <button
                className="btn-primary"
                onClick={promptDelete}
                disabled={!selected}
              >
                Eliminar
              </button>
            </div>
          </div>

          {showDeleteModal && (
            <div className="modal-container">
              <div className="modal-content">
                <p>¿Deseas eliminar la convocatoria "{selected?.nombre}"?</p>{" "}
                {/* Usar optional chaining */}
                <div style={{ marginTop: "1rem" }}>
                  <button
                    className="btn-primary"
                    onClick={confirmDelete}
                    style={{ marginRight: "1rem" }}
                  >
                    Eliminar
                  </button>
                  <button className="btn-primary" onClick={cancelDelete}>
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default ConfiguracionConvocatoria;
