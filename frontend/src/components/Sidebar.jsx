import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Sidebar.css';

const Sidebar = () => {
    const { user, roles } = useAuth();
    const isAuthenticated = !!user;
    const esAdmin = roles.includes('Admin');

    return (
        <nav className="sidebar">
            <ul>
                {!isAuthenticated ? (
                    <>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/inscripciones">Inscripciones</Link></li>
                        <li><Link to="/noticias">Noticias</Link></li>
                        <li><Link to="/contactos">Contactos</Link></li>
                        <li><Link to="/login" className="active-button">Login &gt;</Link></li>
                        <li><Link to="/eventos">Eventos</Link></li>
                        <li><Link to="/faq">VISTA PARA OTROS ROLES</Link></li>
                    </>
                ) : esAdmin ? (
                    <>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/inscripciones">Inscripciones</Link></li>
                        <li><Link to="/noticias">Noticias</Link></li>
                        <li><Link to="/contactos">Contactos</Link></li>
                        <li><Link to="/login" className="active-button">Login &gt;</Link></li>
                        <li><Link to="/eventos">Eventos</Link></li>
                        <li><Link to="/faq">Preguntas Frecuentes</Link></li>
                        
                        <li><Link to="/configuracion">Configuración de la cuenta</Link></li>
                        <li><Link to="/cuentas">Gestión de cuentas</Link></li>
                        <li><Link to="/cronograma">Gestión de cronograma</Link></li>
                        <li><Link to="/convocatoria">Gestión de convocatoria</Link></li>
                        <li><Link to="/inscripciones/seguimiento">Seguimiento de inscripciones</Link></li>
                        <li><Link to="/añadir-ue">Añadir UE</Link></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/">Inicio</Link></li>
                        <li><Link to="/inscripciones">Inscripciones</Link></li>
                        <li><Link to="/noticias">Noticias</Link></li>
                        <li><Link to="/contactos">Contactos</Link></li>
                        <li><Link to="/login" className="active-button">Login &gt;</Link></li>
                        <li><Link to="/eventos">Eventos</Link></li>
                        <li><Link to="/faq">Preguntas Frecuentes</Link></li>
                    </>
                )}
            </ul>
        </nav>
    );
};

export default Sidebar;
