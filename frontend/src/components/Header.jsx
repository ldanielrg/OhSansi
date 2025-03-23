import React from 'react';
import logo from '../assets/logoSansi.png'; // Correcta importación de la imagen
import '../styles/Header.css'; // Importar los estilos del Header

const Header = () => (
    <header className="header">
        <img src={logo} alt="Logo de OhSansi" className="logo" />
        <div className='contenedor-titulo-olimpiadas'>
            <h1 className='titulo-olimpiadas'>Olimpiadas Científicas</h1>
            <p className='letras-edicion'>Edición 2025 | Desafía tus límites</p>
        </div>
    </header>
);

export default Header;
