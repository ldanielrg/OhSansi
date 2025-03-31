import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Si usas React Router
import '../styles/Eventos.css';
import Caja from '../components/Caja';
import RegistroForm from '../components/RegistroForm';

const Eventos = () => {
    return (
        <div className="page-container">
            <Caja titulo="Crear nuevo evento">
                <h2>Cronograma</h2>
                <div className='contenedor-cronograma-convocatoria'>
                    <section className='cont-form-cronograma'>
                        <RegistroForm 
                            label='Nombre del evento'
                        />
                        <RegistroForm
                            label='Fecha de inicio'
                            type='date'
                        />
                        <RegistroForm
                            label='Fecha de Preinscripcion'
                            type='date'
                        />
                        
                    </section>
                    <section className='cont-form-cronograma'>
                        <RegistroForm 
                            label='Duracion (dias)'
                        />
                        <RegistroForm
                            label='Fecha fin'
                            type='date'
                        />
                        <RegistroForm
                            label='Fecha de Inscripcion'
                            type='date'
                        />
                    </section>
                </div>
            </Caja>
        </div>
    );
};

export default Eventos;
