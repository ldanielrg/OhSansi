import React from 'react';
import '../styles/Caja.css';

const Caja = ({ titulo, children }) => {
    return (
        <div className="caja-container">
            {/* Franja Azul (Encabezado) */}
            <div className="caja-header">
                {titulo}
            </div>

            {/* Cuerpo (Contenido Dinámico) */}
            <div className="caja-body">
                {children}
            </div>
        </div>
    );
};

export default Caja;
