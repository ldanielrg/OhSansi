// Home.jsx
import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import Card from "../components/Card";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Importa estilo por defecto
import { useAuth } from "../context/AuthContext"; // ajusta si tu ruta cambia
import imageOlimpics from "/src/assets/hd/olimpiadas.jpg";
import imageInscripcion from "/src/assets/hd/inscripciones.jpg";
import imageDiscipline from "/src/assets/hd/disciplinas.jpg";
import imageEvents from "/src/assets/hd/eventos.jpg";
import { toast } from "react-toastify";

const Home = () => {
  // Hook para navegar
  const navigate = useNavigate();
  const { roles } = useAuth();
  const esAdmin = roles?.includes("Admin");
  const location = useLocation();
  const esDocente = roles.includes("Docente");
  const esDirector = roles.includes("Director");
  useEffect(() => {
    if (location.state?.showWelcomeToast) {
      toast.success("¡Bienvenido al sistema!");
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

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
  const handleNavigateInscritosOficiales = (e) => {
    e.preventDefault();
    navigate("/inscritos-oficiales");
  };
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
                image={imageOlimpics}
                buttonText="Ver más"
                onClick={handleNavigateVer}
              />
            </div>
            <div className="col-md-6">
              <Card
                image={imageInscripcion}
                buttonText="Inscritos Oficiales"
                onClick={handleNavigateInscritosOficiales}
              />
            </div>
            <div className="col-md-6">
              <Card
                image={imageDiscipline}
                buttonText="Disciplinas"
                onClick={handleNavigateDisciplinas}
              />
            </div>
            <div className="col-md-6">
              <Card
                image={imageEvents}
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
