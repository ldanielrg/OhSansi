// Home.jsx
import React from 'react';
import '../styles/Home.css';
import Card from './components/Card';  // Componente de card para los 4 elementos

const Home = () => {
  return (
    <div className="home-container container-fluid">
      <div className="row">
        {/* Columna Izquierda: 70% aprox. */}
        <div className="col-md-8 left-side">
          {/* Sección de fondo (ajustable) en la parte superior */}
          <div className="background-section">
            {/* Este fondo lo puedes ajustar a tu gusto (p. ej. imagen o color) */}
          </div>
          {/* Sección de 4 Cards dispuestas en 2 filas x 2 columnas */}
          <div className="cards-section row">
            <div className="col-md-6">
              <Card image="/ruta/a/imagen1.jpg" description="Descripción 1" />
            </div>
            <div className="col-md-6">
              <Card image="/ruta/a/imagen2.jpg" description="Descripción 2" />
            </div>
            <div className="col-md-6">
              <Card image="/ruta/a/imagen3.jpg" description="Descripción 3" />
            </div>
            <div className="col-md-6">
              <Card image="/ruta/a/imagen4.jpg" description="Descripción 4" />
            </div>
          </div>
        </div>

        {/* Columna Derecha: 30% aprox. */}
        <div className="col-md-4 right-side">
          <div className="card long-card">
            <div className="card-body">
              {/* Título con formato similar al botón de las cards */}
              <h5 className="card-title button-style-title">Título de la Card</h5>
              {/* Calendario (placeholder; aquí puedes integrar tu componente de calendario) */}
              <div className="calendar-placeholder">
                Calendario aquí
              </div>
              {/* Sección Noticias */}
              <h5 className="card-title button-style-title">Noticias</h5>
              <div className="news-buttons">
                <button className="btn vertical-btn btn-news">Ganadores</button>
                <button className="btn vertical-btn btn-news">Premiación</button>
                <button className="btn vertical-btn btn-news">Próximos eventos</button>
              </div>
              {/* Sección Ayuda */}
              <h5 className="card-title button-style-title">Ayuda</h5>
              <div className="help-buttons">
                <button className="btn vertical-btn btn-help">Preguntas frecuentes</button>
                <button className="btn vertical-btn btn-help">Contáctanos</button>
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
