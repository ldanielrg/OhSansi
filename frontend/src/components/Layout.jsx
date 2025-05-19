// Layout.jsx
import React, { useState } from "react";
import "../styles/Layout.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import iconoHome from "/src/assets/icono1.svg";
import iconoInscripciones from "/src/assets/icono2.svg";
import iconoEventos from "/src/assets/icono3.svg";
import logoInstituto from "/src/assets/umss.svg";
import logoEmpresa from "/src/assets/LOGO.png";
import fondo from "/src/assets/fondo.svg";
import iconoNosotros from "/src/assets/icono4.svg";
import iconoLogin from "/src/assets/icono5.svg";
import iconoAjuste from "/src/assets/iconoAjuste.png";

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const { roles } = useAuth();
  const esAdmin = roles?.includes("Admin");

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleNavigate = (ruta) => (e) => {
    e.preventDefault();
    navigate(ruta);
    closeMenu();
  };

  return (
    <div>
      {/* Top Bar */}
      <div className=""></div>

      {/* Header */}
      <header
        className="header"
        style={{
          backgroundImage: `url(${fondo})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          padding: "20px",
          height: "250px",
          position: "relative",
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <img
                src={logoInstituto}
                alt="Logo Instituto"
                className="logo-instituto"
              />
            </div>
            <div className="col text-end">
              <img
                src={logoEmpresa}
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
          <ul className="navbar-nav d-flex flex-row" id="left-menu">
            <li className="nav-item me-3">
              <a
                className="nav-link text-white"
                href="#"
                onClick={handleNavigate("/")}
              >
                <img
                  src={iconoHome}
                  alt="Home Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />
                Inicio
              </a>
            </li>
            <li className="nav-item me-3">
              <a
                className="nav-link text-white"
                href="#"
                onClick={handleNavigate("/inscripciones")}
              >
                <img
                  src={iconoInscripciones}
                  alt="Inscripciones Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />
                Inscripciones
              </a>
            </li>
            <li className="nav-item me-3">
              <a
                className="nav-link text-white"
                href="#"
                onClick={handleNavigate("/eventos")}
              >
                <img
                  src={iconoEventos}
                  alt="Eventos Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />
                Eventos
              </a>
            </li>
            <li className="nav-item me-3">
              <a
                className="nav-link text-white"
                href="#"
                onClick={handleNavigate("/nosotros")}
              >
                <img
                  src={iconoNosotros}
                  alt="Nosotros Icon"
                  style={{ width: "20px", marginRight: "5px" }}
                />
                Nosotros
              </a>
            </li>
            {esAdmin && (
              <>
                <li className="nav-item me-3">
                  <a
                    className="nav-link text-white"
                    href="#"
                    onClick={handleNavigate("/logueado")}
                  >
                    <img
                      src={iconoAjuste}
                      alt="Nosotros Icon"
                      style={{ width: "20px", marginRight: "5px" }}
                    />
                    Logueado
                  </a>
                </li>
              </>
            )}
          </ul>

          {/* Botón User a la derecha */}
          <ul className="navbar-nav" id="right-menu">
            {user ? (
              <li className="nav-item d-flex align-items-center position-relative text-white">
                <div
                  className="d-flex align-items-center me-2"
                  onClick={toggleMenu}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src={iconoLogin}
                    alt="User Icon"
                    style={{ width: "20px", marginRight: "5px" }}
                  />
                  <span>Hola, {user.name}</span>
                </div>
                {menuOpen && (
                  <div className="user-menu-dropdown">
                    <button
                      className="dropdown-item"
                      onClick={handleNavigate("/modificar-cuenta")}
                    >
                      Modificar cuenta
                    </button>
                    <button
                      className="dropdown-item"
                      onClick={handleNavigate("/logout")}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li className="nav-item">
                <a
                  className="nav-link text-white"
                  href="#"
                  onClick={handleNavigate("/login")}
                >
                  <img
                    src="/src/assets/icono5.svg"
                    alt="Ingresar Icon"
                    style={{ width: "20px", marginRight: "5px" }}
                  />
                  Ingresar
                </a>
              </li>
            )}
          </ul>
        </div>
      </nav>

      {/* Área de contenido */}
      <main className="content-area">{children}</main>

      {/* Footer */}
      <footer className="footer">Copyright © 2025 | ByteSoft</footer>
    </div>
  );
};

export default Layout;
