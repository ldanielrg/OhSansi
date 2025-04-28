import '../styles/Formulario.css';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Caja from '../components/Caja';
import BotonForm from '../components/BotonForm';
import DataTable from 'react-data-table-component';
import RegistroForm from '../components/RegistroForm';


const Formulario = () => {
    const { id } = useParams(); // Obtenemos el ID del formulario
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
    nombre: '', apellido: '', email: '', ci: '', fechaNac: '', rude: '',
    area: '', categoria: '', ue: '', municipio: ''
    });
    const [editIndex, setEditIndex] = useState(null);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [rowData, setRowData] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [toggleClearSelected, setToggleClearSelected] = useState(false);
    const selectedRowsRef = useRef([]);
    const [areas, setAreas] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [municipios, setMunicipios] = useState([]);
    const [ue, setUe] = useState([]);

    const columns = [
    { name: 'Nombre', selector: row => row.nombre, sortable: true },
    { name: 'Apellido', selector: row => row.apellido, sortable: true },
    { name: 'CI', selector: row => row.ci },
    { name: 'Fecha de Nacimiento', selector: row => row.fechaNac },
    { name: 'Rude', selector: row => row.rude },
    { name: 'Área', selector: row => row.area },
    { name: 'Categoría', selector: row => row.categoria },
    { name: 'Municipio', selector: row => row.municipio }
    ];

    const customStyles = {
    headCells: {
        style: {
        backgroundColor: '#E1F4FF',
        color: 'black',
        fontWeight: 'semibold',
        fontSize: '14px',
        },
    },
    };
    // Cargar opciones (áreas, municipios, unidades educativas)
    useEffect(() => {
    if (formData.area) {
        fetch(`http://localhost:8000/api/categorias/${formData.area}`)
        .then(res => res.json())
        .then(data => setCategorias(data))
        .catch(error => console.error('Error al obtener categorías:', error));
    } else {
        setCategorias([]);
    }
    }, [formData.area]);

    useEffect(() => {
    fetch('http://localhost:8000/api/areas')
        .then(res => res.json())
        .then(data => setAreas(data));
    fetch('http://localhost:8000/api/municipios')
        .then(res => res.json())
        .then(data => setMunicipios(data));
    fetch('http://localhost:8000/api/unidades-educativas')
        .then(res => res.json())
        .then(data => setUe(data));
    }, []);
    const handleRegistrar = () => {
    const { nombre, apellido, ci, fechaNac, rude, area, categoria, municipio } = formData;

    if (nombre.length < 6) return alert('El nombre debe tener al menos 6 caracteres.');
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+$/.test(nombre)) return alert('El nombre solo puede contener letras y espacios.');
    if (!/^\d{1,16}$/.test(rude)) return alert('El RUDE debe contener solo números y como máximo 16 dígitos.');
    if (!/^\d{1,8}$/.test(ci)) return alert('El CI debe contener solo números y como máximo 8 dígitos.');

    if (modoEdicion && editIndex !== null) {
        const nuevosDatos = [...rowData];
        nuevosDatos[editIndex] = formData;
        setRowData(nuevosDatos);
        setModoEdicion(false);
        setEditIndex(null);
    } else {
        setRowData(prev => [...prev, formData]);
    }

    alert('Estudiante registrado correctamente.');

    setFormData({
        nombre: '', apellido: '', email: '', ci: '', fechaNac: '', rude: '',
        area: '', categoria: '', ue: '', municipio: ''
    });

    setSelectedRows([]);
    selectedRowsRef.current = [];
    setToggleClearSelected(prev => !prev);
    };

    const handleEditar = () => {
    const seleccionActual = selectedRowsRef.current;
    if (seleccionActual.length === 0) return alert('Por favor selecciona un registro para editar.');
    if (seleccionActual.length > 1) return alert('Solo puedes editar un registro a la vez.');
    if (!window.confirm('¿Estás seguro de que deseas editar este registro?')) return;

    const seleccionado = seleccionActual[0];
    const index = rowData.findIndex(est => est.ci === seleccionado.ci);
    if (index === -1) return alert('No se pudo encontrar el registro a editar.');

    setFormData({ ...seleccionado });
    setEditIndex(index);
    setModoEdicion(true);
    };

    const handleEliminar = () => {
    const seleccionActual = selectedRowsRef.current;
    if (seleccionActual.length === 0) return alert('Por favor selecciona al menos un registro para eliminar.');
    if (!window.confirm('¿Estás seguro de que deseas eliminar el/los registro(s) seleccionado(s)?')) return;

    const nuevosDatos = rowData.filter(row => !seleccionActual.some(sel => sel.ci === row.ci));
    setRowData(nuevosDatos);
    setSelectedRows([]);
    selectedRowsRef.current = [];
    setToggleClearSelected(prev => !prev);
    };




    return (
    <div className="formulario-page-container">
        <Caja titulo='Tomar en cuenta' width='50%'>
            <div>En caso de querer inscribir un grupo de estudiantes sin usar el formulario, puede hacerlo descargando el siguiente archivo excel siguiendo las instrucciones:</div>
            <div className='contenedor-archivo-excel'>
            <a 
                href="/plantillas/FormatoParaSubirLista.xlsx" 
                download="FormatoParaSubirLista.xlsx"
                className="boton-descargar-excel"
                >
                Descargar plantilla Excel
            </a>
            </div>
            <div>Paso 1.- Descargar el archivo. <br />
                Paso 2.- Llenar los campos correspondientes en el excel. <br />
                Paso 3.-Subir el archivo a esta pagina presionando el boton "Subir lista". <br />
                En caso de no cumplir el formato sugerido explicado en el documento excel, el sistema rechazará su archivo.
            </div>
        </Caja>
        <section className='contenedor-form-info'>
            <div className='boton-eliminar-form'>
            <BotonForm texto='X' className='boton-eliminar-form-bf'/>
            </div>

            <Caja titulo={`Formulario de Inscripción #${id}`} width='99%' className='caja-formulario-est'>

            <div className='contenedor-secciones-form'>
                <section className='seccion-form'>
                <RegistroForm label='Nombres' name='nombre' value={formData.nombre} onChange={setFormData} />
                <RegistroForm label='C.I.' name='ci' value={formData.ci} onChange={setFormData} />
                <RegistroForm label='Fecha de nacimiento' name='fechaNac' type='date' value={formData.fechaNac} onChange={setFormData} />
                <RegistroForm label='Categoria' name='categoria' type='select' value={formData.categoria} onChange={setFormData} options= {[{ value: '', label: 'Seleccione una Categoria' },...categorias.map(cat => ({ value: cat.id_categoria, label: cat.nombre_categoria }))]} />
                <RegistroForm label='Municipio' name='municipio' type='select' value={formData.municipio} onChange={setFormData} options={[{value: '', label: 'Seleccione un Municipio' },...municipios.map(mun => ({ value: mun.id, label: mun.nombre }))]} />
                <BotonForm className='boton-lista-est' texto='Subir lista' />
                </section>

                <section className='seccion-form'>
                <RegistroForm label='Apellidos' name='apellido' value={formData.apellido} onChange={setFormData} />
                <RegistroForm label='Rude' name='rude' value={formData.rude} onChange={setFormData} />
                <RegistroForm label='Área' name='area' type='select' value={formData.area} onChange={setFormData} options={[{value: '', label: 'Seleccione una Area' },...areas.map(area => ({ value: area.id_area, label: area.nombre_area }))]} />
                {/*<RegistroForm label='Unidad Educativa' name='unidadEducativa' type='select' value={formData.unidadEducativa} onChange={setFormData} options={[{value: '', label: 'Seleccione una Unidad Educativa' },...opcionesFiltradasUE]} />*/}
                <RegistroForm label='Grado' name='grado' />
                <div className='contenedor-boton-registrar-est'>
                    <BotonForm texto={modoEdicion ? "Guardar" : "Registrar"} onClick={handleRegistrar} />
                </div>
                </section>
            </div>
            </Caja>

            <Caja titulo='Estudiantes inscritos' width='99%'>
            <DataTable columns={columns} data={rowData} selectableRows selectableRowsNoSelectAll clearSelectedRows={toggleClearSelected} onSelectedRowsChange={({ selectedRows }) => { setSelectedRows(selectedRows); selectedRowsRef.current = selectedRows; }} customStyles={customStyles} noDataComponent="Aqui veras a los estudiantes que inscribiste." pagination responsive />
            <div className='contenedor-botones-tabla-est-inscritos'>
                <BotonForm className='botones-editar-eliminar-tabla-est' texto='Editar' onClick={handleEditar} />
                <BotonForm className='botones-editar-eliminar-tabla-est' texto='Eliminar' onClick={handleEliminar} />
            </div>
            </Caja>

            <div className='div-boton-guardar-form-est'>
            <BotonForm className='boton-guardar-form-est' texto='Guardar formulario'/>
            </div>
        </section>
    </div>
    );
};

export default Formulario;
