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
                        <RegistroForm label='Rude' name='rude'></RegistroForm>
                        <RegistroForm 
                            label='Provinvia' 
                            name='provincia' 
                            type='select' 
                            options={[
                                { value: '', label: 'Seleccione una provincia' },
                                { value: 'arani', label: 'Arani' },
                                { value: 'arque', label: 'Arque' },
                                { value: 'ayopaya', label: 'Ayopaya' },
                                { value: 'bolivar', label: 'Bolivar' },
                                { value: 'capinota', label: 'Capinota' },
                                { value: 'carrasco', label: 'Carrasco' },
                                { value: 'cercado ', label: 'Cercado ' },
                                { value: 'chapare', label: 'Chapare' },
                                { value: 'esteban arce', label: 'Esteban Arce' },
                                { value: 'german jordan', label: 'German Jordan' },
                                { value: 'mizque', label: 'Mizque' },
                                { value: 'narciso campero', label: 'Narciso Campero' },
                                { value: 'punata', label: 'Punata' },
                                { value: 'quillacollo', label: 'Quillacollo' },
                                { value: 'tapacarí', label: 'Tapacarí' },
                                { value: 'tiraque', label: 'Tiraque' }

                            ]}
                        />
                        <RegistroForm label='CI/Pasaporte' name='ci/pasaporte'></RegistroForm>
                        <RegistroForm 
                            label='Año de escolaridad' 
                            name='año de escolaridad' 
                            type='select'
                            options={[
                                { value: '', label: 'Seleccione el curso' },
                                    { value: 'arani', label: 'Arani' },
                                    { value: 'arque', label: 'Arque' },
                                    { value: 'ayopaya', label: 'Ayopaya' },
                                    { value: 'bolivar', label: 'Bolivar' },
                                    { value: 'capinota', label: 'Capinota' },
                                    { value: 'carrasco', label: 'Carrasco' },
                        ]}
                        />
                        <RegistroForm 
                        label='Categoria' 
                        name='categoria'
                        type='select'
                        options={[
                            {value: '',label: 'Seleccione su categoria'},
                            {value: 'astronomia y astrofisica', label: 'Astronomia y Astrofisica'},
                            {value: 'biologia', label: 'Biologia'},
                            {value: 'fisica', label: 'Fisica'},
                            {value: 'informatica', label: 'Informatica'},
                            {value: 'matematica', label: 'Matematica'},
                            {value: 'quimica', label: 'Quimica'},
                            {value: 'robotica', label: 'Robotica'}
                        ]}
                        />    
                    </section>

                    <section className='seccion-form'>
                        <RegistroForm label='Fecha de nacimiento' type='date'></RegistroForm>
                        <RegistroForm
                            label="Género"
                            name="genero"
                            type="radio"
                            options={[
                                { value: 'masculino', label: 'Masculino' },
                                { value: 'femenino', label: 'Femenino' }
                            ]}
                        />
                        <RegistroForm 
                            label='Unidad Educativa' 
                            name='unidad educativa'
                            type='select'
                            options={[
                                {value: '',label: 'Seleccione su categoria'},
                                {value: 'astronomia y astrofisica', label: 'Astronomia y Astrofisica'},
                                {value: 'biologia', label: 'Biologia'},
                                {value: 'fisica', label: 'Fisica'},
                                {value: 'informatica', label: 'Informatica'},
                                {value: 'matematica', label: 'Matematica'},
                                {value: 'quimica', label: 'Quimica'},
                                {value: 'robotica', label: 'Robotica'}
                                ]}
                        />

                        <RegistroForm 
                        label='Complemento (opcional)'
                        name='complemento ci'
                        />
                        <RegistroForm
                        label='Área'
                        name='area'
                        type='select'
                        options={[
                            {value: '',label: 'Seleccione su categoria'},
                            {value: 'astronomia y astrofisica', label: 'Astronomia y Astrofisica'},
                            {value: 'biologia', label: 'Biologia'},
                            {value: 'fisica', label: 'Fisica'},
                            {value: 'informatica', label: 'Informatica'},
                            {value: 'matematica', label: 'Matematica'},
                            {value: 'quimica', label: 'Quimica'},
                            {value: 'robotica', label: 'Robotica'}
                            ]}
                        />

                    </section>


                </div>
            </Caja>

            <Caja titulo='Estudiantes inscritos'>

            </Caja>
        </div>
    );
};

export default Inscripciones;
