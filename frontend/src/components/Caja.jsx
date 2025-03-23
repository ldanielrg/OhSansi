import React from 'react';
import '../styles/Caja.css';

const Caja = ({ titulo, width = '80%', children }) => {
    return (
        <div className="caja-container" style={{ width }}>
            {/* Franja Azul (Encabezado) */}
            <div className="caja-header">
                {titulo}
            </div>

            {/* Cuerpo del contenido */}
            <div className="caja-body">
                {children}
            </div>
        </div>
    );
};

export default Caja;
