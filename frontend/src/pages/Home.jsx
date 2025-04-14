// Home.jsx
import React from "react";
import "../styles/Home.css";
import Card from "../components/Card";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css"; // Importa estilo por defecto

const Home = () => {
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
                description="Descripción 1"
                buttonText="Leer más"
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/src/assets/inscripcion.png"
                description="Descripción 2"
                buttonText="inscripciones"
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/src/assets/disciplinas.png"
                description="Descripción 2"
                buttonText="diciplinas"
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/src/assets/eventos.png"
                description="Descripción 2"
                buttonText="Eventos"
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Un card grande con Calendario, Noticias y Ayuda */}
        <div className="col-md-3 right-side">
          <div className="card long-card">
            <div className="card-body">
              {/* Calendario */}
              <div className="myCalendarContainer">
                <Calendar />
              </div>

              {/* Noticias */}
              <h5 className="title-bar">Noticias</h5>
              <div className="news-buttons">
                <button className="btn vertical-btn btn-news">Ganadores</button>
                <button className="btn vertical-btn btn-news">
                  Premiación
                </button>
                <button className="btn vertical-btn btn-news">
                  Próximos eventos
                </button>
              </div>

              {/* Ayuda */}
              <h5 className="title-bar">Ayuda</h5>
              <div className="help-buttons">
                <button className="btn vertical-btn btn-help">
                  Preguntas frecuentes
                </button>
                <button className="btn vertical-btn btn-help">
                  Contáctanos
                </button>
                <button className="btn vertical-btn btn-help">Reclamos</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
