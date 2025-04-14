// Layout.jsx
import React from "react";
import "../styles/Layout.css";
import { useNavigate } from 'react-router-dom'

const Layout = ({ children }) => {
  const navigate = useNavigate()
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
                src="/src/assets/umss.svg"
                alt="Logo Instituto"
                className="logo-instituto"
              />
            </div>
            {/* Logo de la Empresa */}
            <div className="col text-end">
              <img
                src="/src/assets/LOGO.png"
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
            <Link className="nav-link text-white" to="#">
                <img
                  src="/src/assets/icono1.svg"
                  alt="Home Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />{" "}
                Inicio
            </Link>
            </li>
            <li className="nav-item me-3">
            <Link className="nav-link text-white" to="#">
              <img
                  src="/src/assets/icono2.svg"
                  alt="Home Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />{" "} Inscripciones
              </Link>
            </li>
            <li className="nav-item me-3">
            <Link className="nav-link text-white" to="#">
              <img
                  src="/src/assets/icono3.svg"
                  alt="Home Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />{" "} Eventos
              </Link>
            </li>
            <li className="nav-item me-3">
            <Link className="nav-link text-white" to="#">
              <img
                  src="/src/assets/icono4.svg"
                  alt="Home Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />{" "} Nosotros
              </Link>
            </li>
          </ul>

          {/* Botón "Ingresar" a la derecha */}
          <ul className="navbar-nav" id="right-menu">
            <li className="nav-item">
            <Link className="nav-link text-white" to="#">
              <img
                  src="/src/assets/icono5.svg"
                  alt="Home Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />{" "} Ingresar
              </Link>
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
