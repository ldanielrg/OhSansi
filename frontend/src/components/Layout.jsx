// Layout.jsx
import React from "react";
import "../styles/Layout.css";

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

      {/* Navigation Bar */}
      <nav className="navbar custom-navbar">
        <div className="container d-flex justify-content-between align-items-center">
          {/* Lista de botones de la izquierda (menú horizontal) */}
          <ul className="navbar-nav d-flex flex-row" id="left-menu">
            <li className="nav-item me-3">
              <a className="nav-link text-white" href="./src/assets/icono1.png">
                <img
                  src="/src/assets/icono1.svg"
                  alt="Home Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />{" "}
                Inicio
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-white" href="#">
              <img
                  src="/src/assets/icono2.svg"
                  alt="Home Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />{" "} Inscripciones
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-white" href="#">
              <img
                  src="/src/assets/icono3.svg"
                  alt="Home Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />{" "} Eventos
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-white" href="#">
              <img
                  src="/src/assets/icono4.svg"
                  alt="Home Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />{" "} Nosotros
              </a>
            </li>
          </ul>

          {/* Botón "Ingresar" a la derecha */}
          <ul className="navbar-nav" id="right-menu">
            <li className="nav-item">
              <a className="nav-link text-white" href="#">
              <img
                  src="/src/assets/icono5.svg"
                  alt="Home Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />{" "} Ingresar
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {/* Área de contenido con fondo blanco */}
      <main className="content-area">{children}</main>

      {/* Footer */}
      <footer className="footer">Copyright © 2025 | ByteSoft</footer>
    </div>
  );
};

export default Layout;
