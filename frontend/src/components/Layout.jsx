// Layout.jsx
import React from 'react';
import '../styles/Layout.css';

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
            {/* Aquí irían los botones de navegación */}
          </div>
        </div>
      </nav>

      {/* Área de contenido */}
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
