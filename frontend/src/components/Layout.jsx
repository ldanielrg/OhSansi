// Layout.jsx
import React from 'react';
import '../styles/Layout.css';  // Importa el archivo de estilos

const Layout = ({ children }) => {
  return (
    <div>
      {/* Top Bar */}
      <div className="top-bar"></div>

      {/* Header con fondo y logos */}
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

      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg custom-navbar">
        <div className="container">
          <div className="collapse navbar-collapse">
            {/* Botones a la izquierda */}
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  <i className="fa fa-home"></i> Inicio
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  <i className="fa fa-edit"></i> Inscripciones
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  <i className="fa fa-calendar"></i> Eventos
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  <i className="fa fa-info-circle"></i> Nosotros
                </a>
              </li>
            </ul>
            {/* Botón a la derecha */}
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link text-white" href="#">
                  <i className="fa fa-sign-in"></i> Ingresar
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Área de contenido con fondo blanco */}
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
