import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/ConfiguracionConvocatoria.css";
import { ToastContainer, toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";

const ConfiguracionConvocatoria = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loadingEstadoIds, setLoadingEstadoIds] = useState([]); // estados en carga por ID
  const navigate = useNavigate();
  const [cargandoConvocatorias, setCargandoConvocatorias] = useState(false);
  const [cargandoGlobal, setCargandoGlobal] = useState(false);
  
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
  setCargandoConvocatorias(true);
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
  } finally {
    setCargandoConvocatorias(false);
  }
};

  const handleCrear = () => navigate("/crear-configuracion-convocatoria");
  const handleEditar = () => {
    const convocatoria = convocatorias.find((c) => c.id_convocatoria === selectedId);
    if (selectedId && convocatoria?.activo) {
      navigate(`/editar-configuracion-convocatoria/${selectedId}`);
    } else {
      toast.warn("Sólo puedes editar convocatorias activas.");
    }
  };
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
    if (cargandoGlobal) return; // evita doble click mientras carga

    setCargandoGlobal(true); // activa spinner global
    try {
      await api.put(`/convocatoria-estado/${id}`);
      toast.success("Estado actualizado.");
      fetchAll();
    } catch {
      toast.error("Error al cambiar estado.");
    } finally {
      setCargandoGlobal(false); // desactiva spinner
    }
  };

  return (
    <div className="config-page">
      {cargandoGlobal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255,255,255,0.7)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <BallTriangle
            height={80}
            width={80}
            radius={5}
            color="#003366"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      )}
      <div className="config-container">
        <div className="config-card">
          <div className="config-card-header">Convocatorias</div>
          <div className="config-card-body" style={{ position: "relative", minHeight: "150px" }}>
  {cargandoConvocatorias ? (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255,255,255,0.85)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
        borderRadius: "12px",
      }}
    >
      <BallTriangle
        height={60}
        width={60}
        radius={5}
        color="#003366"
        ariaLabel="loading"
        visible={true}
      />
    </div>
  ) : (
    convocatorias.length === 0 ? (
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
                  {convocatorias.map((c) => {
                    const isLoading = loadingEstadoIds.includes(c.id_convocatoria);
                    return (
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
                            className={`estado-badge ${c.activo ? "activo" : "inactivo"} ${
                              isLoading ? "loading" : ""
                            }`}
                            onClick={(e) => toggleActivo(e, c.id_convocatoria)}
                            disabled={isLoading}
                            style={{ position: "relative" }}
                          >
                            {isLoading ? (
                              <BallTriangle
                                height={24}
                                width={24}
                                radius={5}
                                color="#fff"
                                ariaLabel="loading"
                                visible={true}
                                wrapperStyle={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                              />
                            ) : (
                              c.activo ? "Activo" : "Inactivo"
                            )}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
    )
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
