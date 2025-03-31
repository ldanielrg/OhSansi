import React, { useState } from 'react';
import '../styles/Inscripciones.css';
import Caja from '../components/Caja';
import RegistroForm from '../components/RegistroForm';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import BotonForm from '../components/BotonForm';

import { AgGridReact } from 'ag-grid-react';
import { ClientSideRowModelModule } from 'ag-grid-community';


const Inscripciones = () => {
    const [formData, setFormData] = useState({
        nombre: '',
        rude: '',
        provincia: '',
        ci: '',
        curso: '',
        categoria: '',
        fechaNac: '',
        genero: '',
        unidadEducativa: '',
        complemento: '',
        area: ''
    });

    const [rowData, setRowData] = useState([
        {
        nombre: 'Juan Lopez',
        rude: '12345678',
        provincia: 'Cercado',
        ci: '7894561',
        curso: '6to',
        categoria: 'Matematica',
        fechaNac: '2009-04-10'
        }
    ]);

    

    const [columnDefs] = useState([
        { field: 'nombre', headerName: 'Nombre Completo' },
        { field: 'rude', headerName: 'RUDE' },
        { field: 'provincia', headerName: 'Provincia' },
        { field: 'ci', headerName: 'CI/Pasaporte' },
        { field: 'curso', headerName: 'Curso' },
        { field: 'categoria', headerName: 'Categoría' },
        { field: 'fechaNac', headerName: 'Fecha Nacimiento' },
      ]);

    const handleDelete = (index) => {
        const newData = [...rowData];
        newData.splice(index, 1);
        setRowData(newData);
    };

    const handleRegistrar = () => {
        const { nombre, rude, provincia, ci, curso, categoria, fechaNac } = formData;
        if (!nombre || !rude || !provincia || !ci || !curso || !categoria || !fechaNac) {
            alert('Por favor completa todos los campos obligatorios.');
            return;
        }

        setRowData((prev) => [...prev, formData]);

        // Limpiar formulario
        setFormData({
            nombre: '',
            rude: '',
            provincia: '',
            ci: '',
            curso: '',
            categoria: '',
            fechaNac: '',
            genero: '',
            unidadEducativa: '',
            complemento: '',
            area: ''
        });
    };

    return (
        <div className="page-container">
            <Caja titulo='Tomar en cuenta'>
                <div>
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, alias! Beatae, ullam dolorum...
                </div>
            </Caja>

            <Caja titulo='Formulario de Inscripcion'>
                <div className='contenedor-secciones-form'>
                    <section className='seccion-form'>
                        <RegistroForm label='Nombre Completo' name='nombre' value={formData.nombre} onChange={setFormData} />
                        <RegistroForm label='Rude' name='rude' value={formData.rude} onChange={setFormData} />
                        <RegistroForm
                            label='Provincia'
                            name='provincia'
                            type='select'
                            value={formData.provincia}
                            onChange={setFormData}
                            options={[
                                { value: '', label: 'Seleccione una provincia' },
                                { value: 'cercado', label: 'Cercado' },
                                { value: 'quillacollo', label: 'Quillacollo' },
                            ]}
                        />
                        <RegistroForm label='CI/Pasaporte' name='ci' value={formData.ci} onChange={setFormData} />
                        <RegistroForm
                            label='Año de escolaridad'
                            name='curso'
                            type='select'
                            value={formData.curso}
                            onChange={setFormData}
                            options={[
                                { value: '', label: 'Seleccione el curso' },
                                { value: '6to', label: '6to' },
                                { value: '5to', label: '5to' },
                            ]}
                        />
                        <RegistroForm
                            label='Categoria'
                            name='categoria'
                            type='select'
                            value={formData.categoria}
                            onChange={setFormData}
                            options={[
                                { value: '', label: 'Seleccione su categoria' },
                                { value: 'matematica', label: 'Matematica' },
                                { value: 'quimica', label: 'Quimica' }
                            ]}
                        />
                    </section>

                    <section className='seccion-form'>
                        <RegistroForm label='Fecha de nacimiento' name='fechaNac' type='date' value={formData.fechaNac} onChange={setFormData} />
                        <RegistroForm
                            label='Género'
                            name='genero'
                            type='radio'
                            value={formData.genero}
                            onChange={setFormData}
                            options={[
                                { value: 'masculino', label: 'Masculino' },
                                { value: 'femenino', label: 'Femenino' }
                            ]}
                        />
                        <RegistroForm label='Unidad Educativa' name='unidadEducativa' value={formData.unidadEducativa} onChange={setFormData} />
                        <RegistroForm label='Complemento (opcional)' name='complemento' value={formData.complemento} onChange={setFormData} />
                        <RegistroForm
                            label='Área'
                            name='area'
                            type='select'
                            value={formData.area}
                            onChange={setFormData}
                            options={[
                                { value: '', label: 'Seleccione el área' },
                                { value: 'informatica', label: 'Informática' },
                                { value: 'biologia', label: 'Biología' }
                            ]}
                        />

                        <BotonForm texto="Registrar" onClick={handleRegistrar} />
                    </section>
                </div>
            </Caja>

            <Caja titulo='Estudiantes inscritos'>
                <div className="ag-theme-alpine tabla-inscritos">
                <AgGridReact
    modules={[ClientSideRowModelModule]} // 👈 ¡esto es lo nuevo!
    rowData={rowData}
    columnDefs={columnDefs}
    domLayout="autoHeight"
    pagination={true}
    paginationPageSize={5}
    defaultColDef={{ resizable: true }}
    animateRows={true}
/>

                </div>
            </Caja>
        </div>
    );
};

export default Inscripciones;
