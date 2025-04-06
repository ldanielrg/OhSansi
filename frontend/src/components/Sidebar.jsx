import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
  const { user, roles } = useAuth();
  const isAuthenticated = !!user;

  const tieneRol = (rol) => roles.includes(rol);
  const tieneAlgunRol = (...permitidos) => roles.some((rol) => permitidos.includes(rol));

  return (
    <nav className="sidebar">
      <ul>
        {/* Siempre visibles */}
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/noticias">Noticias</Link></li>
        <li><Link to="/contactos">Contactos</Link></li>
        <li><Link to="/eventos">Eventos</Link></li>
        <li><Link to="/faq">Preguntas Frecuentes</Link></li>

        {!isAuthenticated && (
          <li><Link to="/login" className="active-button">Login &gt;</Link></li>
        )}

        {/* Solo para Admin */}
        {tieneAlgunRol('Admin', 'Adm. Inscripcion', 'Docente', 'Tutor') && (
          <>
            <li><Link to="/inscripciones">Inscripciones</Link></li>
          </>
        )}
        {tieneRol('Admin') && (
          <>
            <li><Link to="/crear-cuentas">Creación de cuentas</Link></li>
            <li><Link to="/cuentas">Gestión de cuentas</Link></li>
            <li><Link to="/convocatoria">Gestión de convocatoria</Link></li>
            <li><Link to="/crear-ue">Añadir UE</Link></li>
          </>
        )}

        {/* Solo para Director */}
        {tieneRol('Director') && (
          <>
            <li><Link to="/crear-docente">Añadir Docente</Link></li>
          </>
        )}

        {/* Solo para Tutor */}
        {tieneRol('Tutor') && (
          <li><Link to="/perfil-estudiantes">Mis Estudiantes</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Sidebar;
