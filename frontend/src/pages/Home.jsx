// Home.jsx
import React from "react";
import "../styles/Home.css";
import Card from "../components/Card";

const Home = () => {
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
                image="/ruta/a/imagen1.jpg"
                description="Descripción 1"
                buttonText="Leer más"
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/ruta/a/imagen2.jpg"
                description="Descripción 2"
                buttonText="Registrar"
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/ruta/a/imagen2.jpg"
                description="Descripción 2"
                buttonText="Registrar"
              />
            </div>
            <div className="col-md-6">
              <Card
                image="/ruta/a/imagen2.jpg"
                description="Descripción 2"
                buttonText="Registrar"
              />
            </div>
          </div>
        </div>

        {/* Columna Derecha: Un card grande con Calendario, Noticias y Ayuda */}
        <div className="col-md-4 right-side">
          <div className="card long-card">
            <div className="card-body">
              {/* Calendario */}
              <h5 className="card-title section-title">Calendario</h5>
              <div className="calendar-placeholder">Calendario aquí</div>

              {/* Noticias */}
              <h5 className="card-title section-title">Noticias</h5>
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
              <h5 className="card-title section-title">Ayuda</h5>
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
