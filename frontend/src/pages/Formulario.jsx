import '../styles/Formulario.css';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Caja from '../components/Caja';
import BotonForm from '../components/BotonForm';
import DataTable from 'react-data-table-component';
import RegistroForm from '../components/RegistroForm';
import api from '../api/axios'; //ESTO ES LA API en AXIOS.



const Formulario = () => {
    const { id } = useParams(); // Obtenemos el ID del formulario que se está editando
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nombre: '', apellido: '', email: '', ci: '', fechaNac: '', rude: '',
        area: '', categoria: '', ue: '', municipio: '', unidadEducativa: ''
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
        { name: 'Área', selector: row => row.nombre_area },
        { name: 'Categoría', selector: row => row.nombre_categoria },
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

    useEffect(() => {
        const cargarFormulario = async () => {
          // Si estamos creando un nuevo formulario (id == 0), no hacemos nada
          if (parseInt(id) === 0) return;
      
          try {
            const response = await api.get(`/formularios/${id}`); // Ruta
            //const registrador = response.data.registrador; Usaré esto pronto para los Administradores globales de inscripción.
            const estudiantes = response.data.estudiantes; // Lista de estudiantes inscritos
      
            {/* Esto lo usaré junto con el "cons registrador"
            setFormData({
              nombre: formulario.nombre ?? '',
              apellido: formulario.apellido ?? '',
              email: formulario.email ?? '',
              ci: formulario.ci ?? '',
              fechaNac: '',
              rude: '',
              area: '',
              categoria: '',
              ue: '',
              municipio: '',
              unidadEducativa: '',
            });   */}
      
            // Setear estudiantes en la tabla
            const estudiantesFormateados = estudiantes.map(est => ({
              nombre: est.nombre,
              apellido: est.apellido,
              email: est.email,
              ci: est.ci,
              fechaNac: est.fecha_nacimiento,
              rude: est.rude,
              id_area: est.idArea,
              nombre_area: est?.nombre_area || '',
              id_categoria: est.idCategoria,
              nombre_categoria: est?.nombre_categoria || '',
              municipio: '',
              unidadEducativa: ''
            }));
      
            setRowData(estudiantesFormateados);
      
          } catch (error) {
            console.error('Error al cargar formulario:', error);
            alert('No se pudo cargar el formulario.');
          }
        };
      
        cargarFormulario();
      }, [id]);
      

    const opcionesFiltradasUE = ue
        .filter(item => item.municipio_id === parseInt(formData.municipio))
        .map(item => ({ value: item.id_ue, label: item.nombre_ue }));

    const handleRegistrar = () => {
        const { nombre, apellido, ci, fechaNac, rude, area, categoria, municipio } = formData;

        if (nombre.length < 6) return alert('El nombre debe tener al menos 6 caracteres.');
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return alert('El nombre solo puede contener letras y espacios.');
        if (!/^\d{1,16}$/.test(rude)) return alert('El RUDE debe contener solo números y como máximo 16 dígitos.');
        if (!/^\d{1,8}$/.test(ci)) return alert('El CI debe contener solo números y como máximo 8 dígitos.');

        //Estoy sacando IDs de area y categoria.
        const areaSeleccionada = areas.find(a => a.id_area === parseInt(formData.area));
        const categoriaSeleccionada = categorias.find(c => c.id_categoria === parseInt(formData.categoria));

        //Estoy creando los Datos en uno para añadir a la fila de la tabla.
        const nuevoEstudiante = {
            ...formData,
            id_area: areaSeleccionada ? areaSeleccionada.id_area : null,
            nombre_area: areaSeleccionada ? areaSeleccionada.nombre_area : '',
            id_categoria: categoriaSeleccionada ? categoriaSeleccionada.id_categoria : null,
            nombre_categoria: categoriaSeleccionada ? categoriaSeleccionada.nombre_categoria : ''
        };

        if (modoEdicion && editIndex !== null) {
            const nuevosDatos = [...rowData];
            nuevosDatos[editIndex] = nuevoEstudiante;
            setRowData(nuevosDatos);
            setModoEdicion(false);
            setEditIndex(null);
        } else {
            setRowData(prev => [...prev, nuevoEstudiante]);
        }

        alert('Estudiante registrado correctamente.');

        setFormData({
            nombre: '', apellido: '', email: '', ci: '', fechaNac: '', rude: '',
            area: '', categoria: '', ue: '', municipio: '', unidadEducativa: ''
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

    const handleGuardarFormulario = async () => {
        if (rowData.length === 0) {
            alert('No hay estudiantes registrados para guardar.');
            return;
        }
    
        const datosEnviar = {
            //id_ue: parseInt(formData.ue || formData.unidadEducativa), No necesairo con el token
            //id_formulario_actual: parseInt(id), Mejorar logica de creacion de id antes de hacer esto
            id_formulario_actual: 0,
            estudiantes: rowData.map(est => ({
                nombre: est.nombre,
                apellido: est.apellido,
                email: est.email,
                ci: parseInt(est.ci),
                fecha_nacimiento: est.fechaNac,
                rude: parseInt(est.rude),
                idAarea: est.id_area,
                idCategoria: est.id_categoria
            }))
        };
        try {
            console.log(datosEnviar);
            const response = await api.post('/inscribir', datosEnviar);
            console.log('Formulario guardado exitosamente:', response.data);
            alert('Formulario guardado exitosamente');
            navigate('/');
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Ocurrió un error al guardar el formulario.');
        }
        
    };




    return (
        <div className="formulario-page-container">
            <section className='contenedor-form-info'>
                <div className='boton-eliminar-form'>
                    <BotonForm texto='X' className='boton-eliminar-form-bf' />
                </div>

                <Caja titulo={`Formulario de Inscripción #${id}`} width='99%' className='caja-formulario-est'>
                    <div className='contenedor-secciones-form'>
                        <section className='seccion-form'>
                            <RegistroForm label='Nombres' name='nombre' value={formData.nombre} onChange={setFormData} />
                            <RegistroForm label='C.I.' name='ci' value={formData.ci} onChange={setFormData} />
                            <RegistroForm label='Fecha de nacimiento' name='fechaNac' type='date' value={formData.fechaNac} onChange={setFormData} />
                            <RegistroForm label='Categoria' name='categoria' type='select' value={formData.categoria} onChange={setFormData} options={[{ value: '', label: 'Seleccione una Categoria' }, ...categorias.map(cat => ({ value: cat.id_categoria, label: cat.nombre_categoria }))]} />
                            <RegistroForm label='Municipio' name='municipio' type='select' value={formData.municipio} onChange={setFormData} options={[{ value: '', label: 'Seleccione un Municipio' }, ...municipios.map(mun => ({ value: mun.id, label: mun.nombre }))]} />
                            <BotonForm className='boton-lista-est' texto='Subir lista' />
                        </section>

                        <section className='seccion-form'>
                            <RegistroForm label='Apellidos' name='apellido' value={formData.apellido} onChange={setFormData} />
                            <RegistroForm label='Rude' name='rude' value={formData.rude} onChange={setFormData} />
                            <RegistroForm label='Área' name='area' type='select' value={formData.area} onChange={setFormData} options={[{ value: '', label: 'Seleccione una Área' }, ...areas.map(area => ({ value: area.id_area, label: area.nombre_area }))]} />
                            <RegistroForm label='Unidad Educativa' name='unidadEducativa' type='select' value={formData.unidadEducativa} onChange={setFormData} options={[{ value: '', label: 'Seleccione una Unidad Educativa' }, ...opcionesFiltradasUE]} />
                            <RegistroForm label='Email' name='email' value={formData.email} onChange={setFormData}/>
                            <div className='contenedor-boton-registrar-est'>
                                <BotonForm texto={modoEdicion ? "Guardar" : "Registrar"} onClick={handleRegistrar} />
                            </div>
                        </section>
                    </div>
                </Caja>

                <Caja titulo='Estudiantes inscritos' width='99%'>
                    <DataTable
                        columns={columns}
                        data={rowData}
                        selectableRows
                        selectableRowsNoSelectAll
                        clearSelectedRows={toggleClearSelected}
                        onSelectedRowsChange={({ selectedRows }) => {
                            setSelectedRows(selectedRows);
                            selectedRowsRef.current = selectedRows;
                        }}
                        customStyles={customStyles}
                        noDataComponent="Aquí verás a los estudiantes que inscribiste."
                        pagination
                        responsive
                    />
                    <div className='contenedor-botones-tabla-est-inscritos'>
                        <BotonForm className='botones-editar-eliminar-tabla-est' texto='Editar' onClick={handleEditar} />
                        <BotonForm className='botones-editar-eliminar-tabla-est' texto='Eliminar' onClick={handleEliminar} />
                    </div>
                </Caja>

                <div className='div-boton-guardar-form-est'>
                    <BotonForm className='boton-guardar-form-est' texto='Guardar formulario' onClick={handleGuardarFormulario} />
                </div>
            </section>
        </div>
    );
};

export default Formulario;
