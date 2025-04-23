// src/pages/ConfiguracionConvocatoria.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ConfiguracionConvocatoria.css';

const ConfiguracionConvocatoria = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [selected, setSelected] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('convocatorias')) || [];
    setConvocatorias(stored);
  }, []);

  const handleNavigate = (path) => (e) => {
    e.preventDefault();
    navigate(path);
  };  

  const handleCrear = handleNavigate('/crear-configuracion-convocatoria');
  const handleEditar = selected
    ? handleNavigate(`/editar-configuracion-convocatoria`)
    : () => {};
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
  };

  const cancelDelete = () => setShowDeleteModal(false);

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
                <tr><th>Nombre</th><th style={{ width: '500px' }}>Descripción</th></tr>
              </thead>
              <tbody>
                {convocatorias.map(c => (
                  <tr
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className={selected?.id === c.id ? 'fila-seleccionada' : ''}
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
              <button className="btn-primary" onClick={handleCrear}>Crear</button>
              <button className="btn-primary" onClick={handleEditar} disabled={!selected}>Editar</button>
            </div>
            <div className="acciones-right">
              
              <button className="btn-primary" onClick={promptDelete} disabled={!selected}>Eliminar</button>
            </div>
          </div>

          {showDeleteModal && (
            <div className="modal-container">
              <div className="modal-content">
                <p>¿Deseas eliminar la convocatoria "{selected.nombre}"?</p>
                <div style={{ marginTop: '1rem' }}>
                  <button className="btn-primary" onClick={confirmDelete} style={{ marginRight: '1rem' }}>Eliminar</button>
                  <button className="btn-primary" onClick={cancelDelete}>Cancelar</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConfiguracionConvocatoria;
