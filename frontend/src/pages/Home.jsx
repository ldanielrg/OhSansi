// Home.jsx
import React from "react";
import "../styles/Home.css";
import { useNavigate } from "react-router-dom";
import Card from "../components/Card";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Importa estilo por defecto

const Home = () => {
  // Hook para navegar
  const navigate = useNavigate();

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
  return (
    <div className="home-container container-fluid">
      <div className="row">
        {/* Columna Izquierda: Fondo y 4 Cards */}
        <div className="col-md-9 left-side">
          <div className="background-section">
            {/* Asigna aquí tu imagen de fondo o color */}
          </div>
          <div className="cards-section row">
            <div className="col-md-6">
              <Card
                image="/src/assets/olimpiada.png"
                buttonText="Ver más"
                onClick={handleNavigateVer}
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/src/assets/inscripcion.png"
                buttonText="Inscripciones"
                onClick={handleNavigateInscripciones}
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/src/assets/disciplinas.png"
                buttonText="Disciplinas"
                onClick={handleNavigateDisciplinas}
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/src/assets/eventos.png"
                buttonText="Eventos"
                onClick={handleNavigateEventos}
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Un card grande con Calendario, Noticias y Ayuda */}
        <div className="col-md-3 right-side">
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
                  onClick={handleNavigateInscripciones}
                >
                  Ganadores
                </button>
                <button
                  className="btn vertical-btn btn-news"
                  onClick={handleNavigateInscripciones}
                >
                  Premiación
                </button>
                <button
                  className="btn vertical-btn btn-news"
                  onClick={handleNavigateInscripciones}
                >
                  Próximos eventos
                </button>
              </div>

              {/* Ayuda */}
              <h5 className="title-bar">Ayuda</h5>
              <div className="help-buttons">
                <button
                  className="btn vertical-btn btn-help"
                  onClick={handleNavigateInscripciones}
                >
                  Preguntas frecuentes
                </button>
                <button
                  className="btn vertical-btn btn-help"
                  onClick={handleNavigateInscripciones}
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
