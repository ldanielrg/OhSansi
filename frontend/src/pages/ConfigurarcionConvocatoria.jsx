import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/ConfiguracionConvocatoria.css";
import { ToastContainer, toast } from "react-toastify";

const ConfiguracionConvocatoria = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const { data } = await api.get("/convocatorias");
      setConvocatorias(
        data.map((c) => ({
          ...c,
          fecha_inicio: c.fecha_inicio.split("T")[0],
          fecha_final: c.fecha_final.split("T")[0],
        }))
      );
    } catch {
      toast.error("No se pudieron cargar las convocatorias.");
    }
  };

  const handleCrear  = () => navigate("/crear-configuracion-convocatoria");
  const handleEditar = () => selectedId && navigate(`/editar-configuracion-convocatoria/${selectedId}`);
  const promptDelete = () => selectedId && setShowDeleteModal(true);

  const confirmDelete = async () => {
    try {
      await api.delete(`/convocatoria-eliminar/${selectedId}`);
      toast.error("Convocatoria eliminada.");
      setShowDeleteModal(false);
      setSelectedId(null);
      fetchAll();
    } catch {
      toast.error("No se pudo eliminar.");
    }
  };
  const cancelDelete = () => setShowDeleteModal(false);

  const toggleActivo = async (e, id) => {
    e.stopPropagation();
    try {
      await api.put(`/convocatoria-estado/${id}`);
      toast.success("Estado actualizado.");
      fetchAll();
    } catch {
      toast.error("Error al cambiar estado.");
    }
  };

  return (
    <div className="config-page">
      <div className="config-container">
        <div className="config-card">
          <div className="config-card-header">Convocatorias</div>
          <div className="config-card-body">
            {convocatorias.length === 0 ? (
              <p>No hay convocatorias.</p>
            ) : (
              <table className="tabla-config">
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Descripción</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {convocatorias.map((c) => (
                    <tr
                      key={c.id_convocatoria}
                      className={selectedId === c.id_convocatoria ? "fila-seleccionada" : ""}
                      onClick={() => setSelectedId(c.id_convocatoria)}
                    >
                      <td>{c.nombre_convocatoria}</td>
                      <td>{c.descripcion}</td>
                      <td>{c.fecha_inicio}</td>
                      <td>{c.fecha_final}</td>
                      <td>
                        <button
                          className={`estado-badge ${c.activo ? "activo" : "inactivo"}`}
                          onClick={(e) => toggleActivo(e, c.id_convocatoria)}
                        >
                          {c.activo ? "Activo" : "Inactivo"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div className="acciones-container">
              <div className="acciones-left">
                <button className="btn-crear" onClick={handleCrear}>
                  Crear Convocatoria
                </button>
                <button
                  className="btn-editar"
                  onClick={handleEditar}
                  disabled={!selectedId}
                >
                  Editar Convocatoria
                </button>
              </div>
              <div className="acciones-right">
                <button
                  className="btn-eliminar"
                  onClick={promptDelete}
                  disabled={!selectedId}
                >
                  Eliminar Convocatoria
                </button>
              </div>
            </div>

            {showDeleteModal && (
              <div className="modal-container">
                <div className="modal-content">
                  <p>¿Eliminar convocatoria seleccionada?</p>
                  <div className="modal-buttons">
                    <button className="btn-crear" onClick={confirmDelete}>
                      Sí, eliminar
                    </button>
                    <button className="btn-eliminar" onClick={cancelDelete}>
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default ConfiguracionConvocatoria;
