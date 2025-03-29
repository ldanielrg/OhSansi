import React, { useState } from 'react';
import '../styles/Inscripciones.css';
import Caja from '../components/Caja';
import RegistroForm from '../components/RegistroForm';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const Inscripciones = () => {
    // Estado para la tabla
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
        { field: 'nombre', headerName: 'Nombre Completo', editable: true },
        { field: 'rude', headerName: 'RUDE', editable: true },
        { field: 'provincia', headerName: 'Provincia', editable: true },
        { field: 'ci', headerName: 'CI/Pasaporte', editable: true },
        { field: 'curso', headerName: 'Curso', editable: true },
        { field: 'categoria', headerName: 'Categoría', editable: true },
        { field: 'fechaNac', headerName: 'Fecha Nac.', editable: true },
        {
            headerName: 'Acciones',
            field: 'accion',
            cellRendererFramework: (params) => (
                <button
                    onClick={() => handleDelete(params.node.rowIndex)}
                    className="btn-delete"
                >
                    Eliminar
                </button>
            )
        }
    ]);

    const handleDelete = (index) => {
        const newData = [...rowData];
        newData.splice(index, 1);
        setRowData(newData);
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
                        <RegistroForm label='Nombre Completo' placeholder='Juan Lopez' name='nombre' />
                        <RegistroForm label='Rude' name='rude' />
                        <RegistroForm 
                            label='Provinvia' 
                            name='provincia' 
                            type='select' 
                            options={[
                                { value: '', label: 'Seleccione una provincia' },
                                { value: 'cercado', label: 'Cercado' },
                                { value: 'quillacollo', label: 'Quillacollo' },
                            ]}
                        />
                        <RegistroForm label='CI/Pasaporte' name='ci' />
                        <RegistroForm 
                            label='Año de escolaridad' 
                            name='curso' 
                            type='select'
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
                            options={[
                                {value: '',label: 'Seleccione su categoria'},
                                {value: 'matematica', label: 'Matematica'},
                                {value: 'quimica', label: 'Quimica'}
                            ]}
                        />    
                    </section>

                    <section className='seccion-form'>
                        <RegistroForm label='Fecha de nacimiento' name='fechaNac' type='date' />
                        <RegistroForm
                            label="Género"
                            name="genero"
                            type="radio"
                            options={[
                                { value: 'masculino', label: 'Masculino' },
                                { value: 'femenino', label: 'Femenino' }
                            ]}
                        />
                        <RegistroForm label='Unidad Educativa' name='unidad educativa' />
                        <RegistroForm label='Complemento (opcional)' name='complemento ci' />
                        <RegistroForm
                            label='Área'
                            name='area'
                            type='select'
                            options={[
                                {value: '',label: 'Seleccione el área'},
                                {value: 'informatica', label: 'Informatica'},
                                {value: 'biologia', label: 'Biologia'}
                            ]}
                        />
                    </section>
                </div>
            </Caja>

            {/* 🔽 Aquí colocamos la tabla */}
            <Caja titulo='Estudiantes inscritos'>
                <div className="ag-theme-alpine tabla-inscritos">
                    <AgGridReact
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
