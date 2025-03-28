import React from 'react';
import '../styles/Inscripciones.css'; // Si quieres usar los mismos estilos que Home
import Caja from '../components/Caja';
import RegistroForm from '../components/RegistroForm';

const Inscripciones = () => {
    return (
        <div className="page-container">
            <Caja titulo='Tomar en cuenta'>
                <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, alias! Beatae, ullam dolorum. Ducimus, tenetur maxime sequi quibusdam qui sed voluptates voluptatum quas quia nulla. Officia tempore recusandae accusantium omnis!
                </div>
            </Caja>

            <Caja titulo='Formulario de Inscripcion'>
                <div className='contenedor-secciones-form'>
                    <section className='seccion-form'>
                        <RegistroForm label='Nombre Completo' placeholder='Juan Lopez' name='nombre'></RegistroForm>
                    </section>

                    <section className='seccion-form'>
                        <RegistroForm label='Fecha de nacimiento'></RegistroForm>
                    </section>
                </div>
            </Caja>
        </div>
    );
};

export default Inscripciones;
