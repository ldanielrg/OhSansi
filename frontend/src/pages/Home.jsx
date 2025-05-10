// Home.jsx
import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Importa estilo por defecto
import { useAuth } from "../context/AuthContext"; // ajusta si tu ruta cambia



const Home = () => {
  // Hook para navegar
  const navigate = useNavigate();
  const { roles } = useAuth();
  const esAdmin = roles?.includes("Admin");

  const handleNavigateReclamos = (e) => {
    e.preventDefault();
    navigate("/reclamos");
  };
  const handleNavigateInscripciones = (e) => {
    e.preventDefault();
    navigate("/inscripciones");
  };
  const handleNavigateEventos = (e) => {
    e.preventDefault();
    navigate("/eventos");
  };
  const handleNavigateVer = (e) => {
    e.preventDefault();
    navigate("/ver");
  };
  const handleNavigateDisciplinas = (e) => {
    e.preventDefault();
    navigate("/disciplinas");
  };
  const handleNavigateGanadores = (e) => {
    e.preventDefault();
    navigate("/ganadores");
  };
  const handleNavigatePremiacion = (e) => {
    e.preventDefault();
    navigate("/premiacion");
  };
  const handleNavigateProximosEventos = (e) => {
    e.preventDefault();
    navigate("/proximoseventos");
  };
  const handleNavigateContactanos = (e) => {
    e.preventDefault();
    navigate("/contactanos");
  };
  const handleNavigatePreguntasFrecuentes = (e) => {
    e.preventDefault();
    navigate("/preguntasfrecuentes");
  };
  const handleNavigateConfiguracionConvocatoria = (e) => {
    e.preventDefault();
    navigate("/configuracion-convocatoria");
  };
  const handleNavigateConfiguracionEventos = (e) => {
    e.preventDefault();
    navigate("/configuracioneventos");
  };
  const handleNavigateCrearUE = (e) => {
    e.preventDefault();
    navigate("/crear-ue");
  };
  const handleNavigateCrearCuentas = (e) => {
    e.preventDefault();
    navigate("/crear-cuentas");
  };
  const handleNavigateConfiguracionCuentas = (e) => {
    e.preventDefault();
    navigate("/configuracion-cuentas");
  };
  handleNavigateConfiguracionCuentas
  return (
    <div className="home-container container-fluid">
      <div className="row">
        {/* Columna Izquierda: Fondo y 4 Cards */}
        <div className="col-md-8 left-side">
          <div className="background-section">
            {/* Asigna aquí tu imagen de fondo o color */}
          </div>
          <div className="cards-section row">
            <div className="col-md-6">
              <Card
                image="/src/assets/hd/olimpiadas.jpg"
                buttonText="Ver más"
                onClick={handleNavigateVer}
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/src/assets/hd/inscripciones.jpg"
                buttonText="Inscripciones"
                onClick={handleNavigateInscripciones}
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/src/assets/hd/disciplinas.jpg"
                buttonText="Disciplinas"
                onClick={handleNavigateDisciplinas}
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/src/assets/hd/eventos.jpg"
                buttonText="Eventos"
                onClick={handleNavigateEventos}
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Un card grande con Calendario, Noticias y Ayuda */}
        <div className="col-md-4 right-side">
          <div className="card long-card">
            <div className="card-body">
              {/* Calendario */}
              <h5 className="title-bar">Calendario</h5>
              <div className="myCalendarContainer">
                <Calendar />
              </div>

              {/* Noticias */}
              <h5 className="title-bar">Noticias</h5>
              <div className="news-buttons">
                <button
                  className="btn vertical-btn btn-news"
                  onClick={handleNavigateGanadores}
                >
                  Ganadores
                </button>
                <button
                  className="btn vertical-btn btn-news"
                  onClick={handleNavigatePremiacion}
                >
                  Premiación
                </button>
                <button
                  className="btn vertical-btn btn-news"
                  onClick={handleNavigateProximosEventos}
                >
                  Próximos eventos
                </button>
              </div>

              {/* Ayuda */}
              <h5 className="title-bar">Ayuda</h5>
              <div className="help-buttons">
                <button
                  className="btn vertical-btn btn-help"
                  onClick={handleNavigatePreguntasFrecuentes}
                >
                  Preguntas frecuentes
                </button>
                <button
                  className="btn vertical-btn btn-help"
                  onClick={handleNavigateContactanos}
                >
                  Contáctanos
                </button>
                <button
                  className="btn vertical-btn btn-help "
                  onClick={handleNavigateReclamos}
                >
                  Reclamos
                </button>
                {esAdmin && (
                  <>
                  <button
                    className="btn vertical-btn btn-help"
                    onClick={handleNavigateCrearUE}
                  >
                    Crear UE
                  </button>
                  <button
                    className="btn vertical-btn btn-help"
                    onClick={handleNavigateCrearCuentas}
                  >
                    Crear Cuentas
                  </button>
                  <button
                    className="btn vertical-btn btn-help"
                    onClick={handleNavigateConfiguracionConvocatoria}
                  >
                    Configuración Convocatoria
                  </button>
                  <button
                    className="btn vertical-btn btn-help"
                    onClick={handleNavigateEventos}
                  >
                    Crear Eventos
                  </button>
                  <button
                    className="btn vertical-btn btn-help"
                    onClick={handleNavigateConfiguracionCuentas}
                  >
                    Configuración Cuentas
                  </button>
                </>
                )}

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;