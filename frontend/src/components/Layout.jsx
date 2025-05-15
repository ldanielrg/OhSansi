// Layout.jsx
import React, { useState } from "react";
import "../styles/Layout.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { BallTriangle } from 'react-loader-spinner';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Layout = ({ children }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cerrandoSesion, setCerrandoSesion] = useState(false);



  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  const handleNavigate = (ruta) => (e) => {
    e.preventDefault();
    navigate(ruta);
    closeMenu();
  };
  const handleCerrarSesion = async () => {
  setCerrandoSesion(true);
  try {
    // Si tienes una función de logout real, colócala aquí (por ejemplo: await logout();)
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simula delay de logout

    toast.success("Has cerrado sesión correctamente");

    setTimeout(() => {
      navigate("/login"); // Cambia la ruta si deseas otro destino
    }, 1500);
  } catch (error) {
    console.error("Error al cerrar sesión", error);
    toast.error("Ocurrió un error al cerrar sesión");
  } finally {
    setCerrandoSesion(false);
  }
};



  return (
    <div>
      {/* Top Bar */}
      <div className=""></div>

      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="row align-items-center">
            <div className="col">
              <img
                src="/src/assets/umss.svg"
                alt="Logo Instituto"
                className="logo-instituto"
              />
            </div>
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
          <ul className="navbar-nav d-flex flex-row" id="left-menu">
            <li className="nav-item me-3">
              <a className="nav-link text-white" href="#" onClick={handleNavigate("/")}>
                <img src="/src/assets/icono1.svg" alt="Home Icon" style={{ width: "20px", marginRight: "5px" }} />
                Inicio
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-white" href="#" onClick={handleNavigate("/inscripciones")}>
                <img src="/src/assets/icono2.svg" alt="Inscripciones Icon" style={{ width: "20px", marginRight: "5px" }} />
                Inscripciones
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-white" href="#" onClick={handleNavigate("/eventos")}>
                <img src="/src/assets/icono3.svg" alt="Eventos Icon" style={{ width: "20px", marginRight: "5px" }} />
                Eventos
              </a>
            </li>
            <li className="nav-item me-3">
              <a className="nav-link text-white" href="#" onClick={handleNavigate("/nosotros")}>
                <img src="/src/assets/icono4.svg" alt="Nosotros Icon" style={{ width: "20px", marginRight: "5px" }} />
                Nosotros
              </a>
            </li>
          </ul>

          {/* Botón User a la derecha */}
          <ul className="navbar-nav" id="right-menu">
            {user ? (
              <li className="nav-item d-flex align-items-center position-relative text-white">
                <div className="d-flex align-items-center" onClick={toggleMenu} style={{ cursor: 'pointer' }}>
                  <img
                    src="/src/assets/icono5.svg"
                    alt="User Icon"
                    style={{ width: "20px", marginRight: "5px" }}
                  />
                  <span className="me-2">Hola, {user.name}</span>
                </div>
                {menuOpen && (
                  <div className="user-menu-dropdown">
                    <button className="dropdown-item" onClick={handleNavigate("/modificar-cuenta")}>
                      Modificar cuenta
                    </button>
                    <button className="dropdown-item" onClick={handleCerrarSesion} disabled={cerrandoSesion}>
                      {cerrandoSesion ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <BallTriangle height={20} width={20} color="#003366" />
                          Cerrando sesión...
                        </div>
                      ) : (
                        "Cerrar sesión"
                      )}
                    </button>


                  </div>
                )}
              </li>
            ) : (
              <li className="nav-item">
                <a className="nav-link text-white" href="#" onClick={handleNavigate("/login")}>
                  <img src="/src/assets/icono5.svg" alt="Ingresar Icon" style={{ width: "20px", marginRight: "5px" }} />
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
      <>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>

    </div>
  );
};

export default Layout;
