import React from 'react';
import { NavLink } from 'react-router-dom';
import '../styles/Sidebar.css';

const Sidebar = () => (
    <nav className="sidebar">
        <ul>
            <li><NavLink to="/" className={({ isActive }) => isActive ? 'active-link' : ''}>Inicio</NavLink></li>
            <li><NavLink to="/inscripciones" className={({ isActive }) => isActive ? 'active-link' : ''}>Inscripciones</NavLink></li>
            <li><NavLink to="/noticias" className={({ isActive }) => isActive ? 'active-link' : ''}>Noticias</NavLink></li>
            <li><NavLink to="/contactos" className={({ isActive }) => isActive ? 'active-link' : ''}>Contactos</NavLink></li>
            <li><NavLink to="/login" className={({ isActive }) => isActive ? 'active-link' : ''}>Login</NavLink></li>
            <li><NavLink to="/eventos" className={({ isActive }) => isActive ? 'active-link' : ''}>Eventos</NavLink></li>
            <li><NavLink to="/faq" className={({ isActive }) => isActive ? 'active-link' : ''}>Preguntas Frecuentes</NavLink></li>
        </ul>
    </nav>
);

export default Sidebar;
