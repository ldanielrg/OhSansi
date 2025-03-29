import React from 'react';
import '../styles/Eventos.css';
import Caja from '../components/Caja';

const Eventos = () => {
    return (
        <div className="page-container">
            <Caja titulo="Eventos">
                <p>Aquí se mostrarán los próximos eventos de las Olimpiadas Científicas.</p>
            </Caja>
        </div>
    );
};

export default Eventos;
