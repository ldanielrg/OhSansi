import React, { useEffect, useState, useRef } from 'react'; 
import '../styles/Inscripciones.css';
import Caja from '../components/Caja';
import RegistroForm from '../components/RegistroForm';
import BotonForm from '../components/BotonForm';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash, FaEye , FaRegFile } from 'react-icons/fa';

const Inscripciones = () => {
  const [formData, setFormData] = useState({
    nombre: '',apellido: '', email: '', ci: '', fechaNac: '', rude: '',
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
  const [showFormulario, setShowFormulario] = useState(false);

  const [formularios, setFormularios] = useState([]);
  const [formularioIdCounter, setFormularioIdCounter] = useState(1);

  const columns = [
    { name: 'Nombre', selector: row => row.nombre, sortable: true },
    { name: 'Apellido', selector: row => row.apellido, sortable: true },
    { name: 'Email', selector: row => row.email },
    { name: 'CI', selector: row => row.ci },
    { name: 'Fecha de Nacimiento', selector: row => row.fechaNac },
    { name: 'Rude', selector: row => row.rude },
    { name: 'Área', selector: row => row.area },
    { name: 'Categoría', selector: row => row.categoria },
    { name: 'UE', selector: row => row.ue }
  ];

  const formularioColumns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Cantidad Estudiantes', selector: row => row.estudiantes.length },
    {
      name: 'Acciones',
      cell: row => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => alert(`Ver formulario ${row.id}`)}><FaRegFile/></button>
          <button onClick={() => alert(`Editar formulario ${row.id}`)}><FaEdit /></button>
          <button onClick={() => eliminarFormulario(row.id)}><FaTrash /></button>
        </div>
      )
    }
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

  const handleRegistrar = () => {
    const { nombre, apellido, email, ci, fechaNac, rude, area, categoria, ue, municipio } = formData;

    if (nombre.length < 6) return alert('El nombre debe tener al menos 6 caracteres.');
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) return alert('El nombre solo puede contener letras y espacios.');
    if (nombre.length > 60) return alert('El nombre no puede superar los 60 caracteres.');
    if (!/^\d{1,16}$/.test(rude)) return alert('El RUDE debe contener solo números y como máximo 16 dígitos.');
    if (!/^\d{1,8}$/.test(ci)) return alert('El CI/Pasaporte debe contener solo números y como máximo 8 dígitos.');
    if (complemento.length > 3) return alert('El complemento del CI debe tener como máximo 3 caracteres.');
    if (unidadEducativa.length > 40) return alert('El nombre de la Unidad Educativa no puede superar los 40 caracteres.');
    if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,-]*$/.test(unidadEducativa)) return alert('El nombre de la Unidad Educativa contiene caracteres no válidos.');

    if (modoEdicion && editIndex !== null) {
      const nuevosDatos = [...rowData];
      nuevosDatos[editIndex] = formData;
      setRowData(nuevosDatos);
      setModoEdicion(false);
      setEditIndex(null);
    } else {
      setRowData(prev => [...prev, formData]);
    }

    alert('Registro realizado correctamente.');

    setFormData({ nombre: '', rude: '', provincia: '', ci: '', curso: '', categoria: '', fechaNac: '', genero: '', unidadEducativa: '', complemento: '', area: '' });
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


  const guardarFormulario = () => {
    const registrador = {
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      ci: parseInt(formData.ci)
    };
  
    const estudiantesTransformados = rowData.map(est => ({
      nombre: est.nombre,
      apellido: est.apellido,
      email: est.email,
      ci: parseInt(est.ci),
      fecha_nacimiento: est.fechaNac,
      rude: parseInt(est.rude),
      idAarea: parseInt(est.area),
      idCategoria: parseInt(est.categoria)
    }));
  
    const formularioPayload = {
      registrador,
      id_ue: parseInt(formData.unidadEducativa),
      id_formulario_actual: formularioIdCounter,
      estudiantes: estudiantesTransformados
    };
  
    fetch('http://localhost:8000/api/formularios', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formularioPayload),
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al guardar el formulario en el servidor.');
      }
      return response.json();
    })
    .then(data => {
      alert('Formulario guardado correctamente en el servidor.');
  
      // Actualizamos el estado local
      setFormularios(prev => [...prev, {
        id: formularioIdCounter,
        estudiantes: rowData
      }]);
      setFormularioIdCounter(prev => prev + 1);
      setRowData([]);
      setShowFormulario(false);
    })
    .catch(error => {
      console.error('Error al enviar los datos:', error);
      alert('Hubo un problema al guardar los datos.');
    });
  };
  

  const eliminarFormulario = (id) => {
    const confirmacion = window.confirm('¿Deseas eliminar este formulario?');
    if (!confirmacion) return;

    setFormularios(prev => prev.filter(f => f.id !== id));
  };


  useEffect(() => {
    if (formData.area) {
      fetch(`http://localhost:8000/api/categorias/${formData.area}`)
        .then(res => res.json())
        .then(data => setCategorias(data))
        .catch(error => console.error('Error al obtener categorías:', error));
    } else {
      setCategorias([]); // Limpia si no hay área seleccionada
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

  const opcionesFiltradasUE = ue
    .filter(item => item.municipio_id === parseInt(formData.municipio))
    .map(item => ({ value: item.id_ue, label: item.nombre_ue }));

  return (
    <div className="page-container">
      <Caja titulo='Tomar en cuenta' width='50%'>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, alias! Beatae, ullam dolorum...</div>
      </Caja>

      <section className='seccion-crud-formularios'>
        <div className='para-separar-de-tabla-formularios'>
          <button className='boton-añadir-formularios' onClick={() => setShowFormulario(true)}>+</button>
          <h3>Formularios</h3>
        </div>
        <DataTable
          columns={formularioColumns}
          data={formularios}
          noDataComponent='Aún no se han registrado formularios.'
          pagination
          customStyles={customStyles}
        />
      </section>

      {showFormulario && (
        <section className='contenedor-form-info'>
          <div className='boton-eliminar-form'>
            <BotonForm texto='X' className='boton-eliminar-form-bf' onClick={() => setShowFormulario(false)} />
          </div>

          <Caja titulo='Formulario de Inscripcion' width='99%' className='caja-formulario-est'>
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
                <RegistroForm label='Unidad Educativa' name='unidadEducativa' type='select' value={formData.unidadEducativa} onChange={setFormData} options={[{value: '', label: 'Seleccione una Unidad Educativa' },...opcionesFiltradasUE]} />
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
            <BotonForm className='boton-guardar-form-est' texto='Guardar formulario' onClick={guardarFormulario} />
          </div>
        </section>
      )}
    </div>
  );
};

export default Inscripciones;
