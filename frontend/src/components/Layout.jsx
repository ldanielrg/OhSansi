// Layout.jsx
import React from 'react';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  return (
    <div>
      {/* Top Bar */}
      <div className="top-bar"></div>

      {/* Header con fondo detrás de los logos */}
      <header className="header">
        <div className="container">
          <div className="row align-items-center">
            {/* Logo del Instituto */}
            <div className="col">
              <img 
                src="/ruta/a/tu/logo-instituto.png" 
                alt="Logo Instituto" 
                className="logo-instituto"
              />
            </div>
            {/* Logo de la Empresa */}
            <div className="col text-end">
              <img 
                src="/ruta/a/tu/logo-empresa.png" 
                alt="Logo Empresa" 
                className="logo-empresa"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Bar con botones organizados verticalmente */}
      <nav className="navbar custom-navbar">
        <div className="container d-flex justify-content-between">
          {/* Grupo de botones a la izquierda */}
          <div className="nav flex-column left-nav">
            <a className="nav-link text-white" href="#"><i className="fa fa-home"></i> Inicio</a>
            <a className="nav-link text-white" href="#"><i className="fa fa-edit"></i> Inscripciones</a>
            <a className="nav-link text-white" href="#"><i className="fa fa-calendar"></i> Eventos</a>
            <a className="nav-link text-white" href="#"><i className="fa fa-info-circle"></i> Nosotros</a>
          </div>
          {/* Grupo de botón a la derecha */}
          <div className="nav flex-column right-nav">
            <a className="nav-link text-white" href="#"><i className="fa fa-sign-in"></i> Ingresar</a>
          </div>
        </div>
      </nav>

      {/* Área de contenido de la página, con fondo blanco */}
      <main className="content-area">
        { children }
      </main>

      {/* Footer */}
      <footer className="footer">
        Copyright © 2025 | ByteSoft
      </footer>
    </div>
  );
};

export default Layout;
