// src/pages/Logueado.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Logueado.css";

const Logueado = () => {
  const navigate = useNavigate();
  const { roles } = useAuth();
  const esAdmin = roles?.includes("Admin");
  const esDocente = roles.includes("Docente");
  const esDirector = roles.includes("Director");

  const handleNavigateCrearUE = () => navigate("/crear-ue");
  const handleNavigateCrearCuentas = () => navigate("/crear-cuentas");
  const handleNavigateConfiguracionConvocatoria = () =>
    navigate("/configuracion-convocatoria");
  const handleNavigateEventos = () => navigate("/eventos");
  const handleNavigateConfiguracionCuentas = () =>
    navigate("/configuracion-cuentas");
  const handleNavigateInscritosOficiales = () =>
    navigate("/inscritos-oficiales");
  const handleNavigateGestionComprobantes = () =>
    navigate("/gestion-comprobantes");

  const handleNavigateConfiguracionAreaCategoria = () =>
    navigate("/gestion-area-categoria");
  return (
    <div className="config-page">
      <div className="config-container">
        <div className="config-card">
          <div className="config-card-header">Logueado</div>
          <div className="config-card-body">
            {(esAdmin || esDocente || esDirector) && (
              <>
                {esAdmin && (
                  <button
                    className="btn-news vertical-btn"
                    onClick={handleNavigateCrearUE}
                  >
                    Crear UE
                  </button>
                )}
                {(esAdmin || esDirector) && (
                  <button
                    className="btn-news vertical-btn"
                    onClick={handleNavigateCrearCuentas}
                  >
                    Crear Cuentas
                  </button>
                )}

                {esAdmin && (
                  <button
                    className="btn-news vertical-btn"
                    onClick={handleNavigateConfiguracionConvocatoria}
                  >
                    Creacion Convocatoria
                  </button>
                )}
                {esAdmin && (
                  <button
                    className="btn-news vertical-btn"
                    onClick={handleNavigateConfiguracionAreaCategoria}
                  >
                    Gestion Convocatoria
                  </button>
                )}
                {esAdmin && (
                  <button
                    className="btn-news vertical-btn"
                    onClick={handleNavigateEventos}
                  >
                    Crear Eventos
                  </button>
                )}
                {esAdmin && (
                  <button
                    className="btn-news vertical-btn"
                    onClick={handleNavigateConfiguracionCuentas}
                  >
                    Configuración Cuentas
                  </button>
                )}
                <button
                  className="btn-news vertical-btn"
                  onClick={handleNavigateInscritosOficiales}
                >
                  Inscritos Oficiales
                </button>
                {esAdmin && (
                  <button
                    className="btn-news vertical-btn"
                    onClick={handleNavigateGestionComprobantes}
                  >
                    Gestion de comprobantes
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logueado;
