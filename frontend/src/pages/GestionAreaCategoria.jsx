import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/GestionAreaCategoria.css";
import { ToastContainer, toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";

export default function GestionAreaCategoria() {
  const navigate = useNavigate();
  const [convocatorias, setConvocatorias] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchConv = async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/convocatorias-activas"); // o '/convocatorias-activas'
        setConvocatorias(data);
      } catch (err) {
        console.error(err);
        toast.error("No se pudieron cargar las convocatorias.");
      } finally {
        setLoading(false);
      }
    };
    fetchConv();
  }, []);

  const handleGestion = () => {
    if (!selectedId) {
      toast.warn("Selecciona primero una convocatoria.");
      return;
    }
    navigate(`/configuracion-convocatoria/gestionar/${selectedId}`);
  };

  const handleSalir = () => {
    navigate("/configuracion-convocatoria");
  };

  return (
    <div className="gestion-page">
      <div className="gestion-container">
        <div className="gestion-card">
          <div className="gestion-header">Gestión Area,Categoria</div>
          <div className="gestion-body">
            {loading ? (
              <div className="spinner-wrapper">
                <BallTriangle
                  height={80}
                  width={80}
                  radius={5}
                  color="#003366"
                  ariaLabel="cargando-convocatorias"
                  visible={true}
                />
              </div>
            ) : (
              <div className="form-row">
                <label htmlFor="selConv">Seleccionar convocatoria:</label>
                <select
                  id="selConv"
                  className="form-select"
                  value={selectedId}
                  onChange={e => setSelectedId(e.target.value)}
                >
                  <option value="">-- Elige convocatoria --</option>
                  {convocatorias.map(conv => (
                    <option
                      key={conv.id_convocatoria}
                      value={conv.id_convocatoria}
                    >
                      {conv.nombre_convocatoria}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="acciones-ger">
              <button
                className="btn-crear"
                onClick={handleGestion}
                disabled={loading || !selectedId}
              >
                Gestión Convocatoria
              </button>
              <button className="btn-eliminar" onClick={handleSalir}>
                Salir
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
