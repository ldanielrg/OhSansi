import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => (
    <nav className="sidebar">
        <ul>
            <li><Link to="/">Inicio</Link></li>
            <li><Link to="/inscripciones">Inscripciones</Link></li>
            <li><Link to="/noticias">Noticias</Link></li>
            <li><Link to="/contactos">Contactos</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/eventos">Eventos</Link></li>
            <li><Link to="/faq">Preguntas Frecuentes</Link></li>
        </ul>
    </nav>
);

export default Sidebar;
