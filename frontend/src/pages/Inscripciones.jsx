import React, { useEffect, useState, useRef } from 'react';
import '../styles/Inscripciones.css';
import Caja from '../components/Caja';
import RegistroForm from '../components/RegistroForm';
import BotonForm from '../components/BotonForm';
import DataTable from 'react-data-table-component';

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

  const [editIndex, setEditIndex] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [rowData, setRowData] = useState([]);

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleClearSelected, setToggleClearSelected] = useState(false);
  const selectedRowsRef = useRef([]);
  const [municipios, setMunicipios] = useState([]);
  const [ue, setUe] = useState([]);

  const columns = [
    { name: 'Nombre Completo', selector: row => row.nombre, sortable: true },
    { name: 'RUDE', selector: row => row.rude },
    { name: 'Provincia', selector: row => row.provincia },
    { name: 'CI/Pasaporte', selector: row => row.ci },
    { name: 'Curso', selector: row => row.curso },
    { name: 'Categoría', selector: row => row.categoria },
    { name: 'Área', selector: row => row.area }
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
    const {
      nombre, rude, provincia, ci, curso,
      categoria, fechaNac, genero, unidadEducativa, complemento, area
    } = formData;

    if (nombre.length < 6) {
      alert('El nombre debe tener al menos 6 caracteres.');
      return;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(nombre)) {
      alert('El nombre solo puede contener letras y espacios.');
      return;
    }
    if (nombre.length > 60) {
      alert('El nombre no puede superar los 60 caracteres.');
      return;
    }

    if (!/^\d{1,16}$/.test(rude)) {
      alert('El RUDE debe contener solo números y como máximo 16 dígitos.');
      return;
    }

    if (!/^\d{1,8}$/.test(ci)) {
      alert('El CI/Pasaporte debe contener solo números y como máximo 8 dígitos.');
      return;
    }

    if (complemento.length > 3) {
      alert('El complemento del CI debe tener como máximo 3 caracteres.');
      return;
    }

    if (unidadEducativa.length > 40) {
      alert('El nombre de la Unidad Educativa no puede superar los 40 caracteres.');
      return;
    }

    if (!/^[a-zA-Z0-9\sáéíóúÁÉÍÓÚñÑ.,-]*$/.test(unidadEducativa)) {
      alert('El nombre de la Unidad Educativa contiene caracteres no válidos.');
      return;
    }

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

    setSelectedRows([]);
    selectedRowsRef.current = [];
    setToggleClearSelected(prev => !prev);
  };

  const handleEditar = () => {
    const seleccionActual = selectedRowsRef.current;

    if (seleccionActual.length === 0) {
      alert('Por favor selecciona un registro para editar.');
      return;
    }

    if (seleccionActual.length > 1) {
      alert('Solo puedes editar un registro a la vez.');
      return;
    }

    const confirmado = window.confirm('¿Estás seguro de que deseas editar este registro?');
    if (!confirmado) return;

    const seleccionado = seleccionActual[0];
    const index = rowData.findIndex(est => est.ci === seleccionado.ci);

    if (index === -1) {
      alert('No se pudo encontrar el registro a editar.');
      return;
    }

    setFormData({ ...seleccionado });
    setEditIndex(index);
    setModoEdicion(true);
  };

  const handleEliminar = () => {
    const seleccionActual = selectedRowsRef.current;

    if (seleccionActual.length === 0) {
      alert('Por favor selecciona al menos un registro para eliminar.');
      return;
    }

    const confirmado = window.confirm('¿Estás seguro de que deseas eliminar el/los registro(s) seleccionado(s)?');
    if (!confirmado) return;

    const nuevosDatos = rowData.filter(
      row => !seleccionActual.some(sel => sel.ci === row.ci)
    );

    setRowData(nuevosDatos);
    setSelectedRows([]);
    selectedRowsRef.current = [];
    setToggleClearSelected(prev => !prev);
  };

  useEffect(() => {
    fetch('http://localhost:8000/api/municipios')
      .then(res => res.json())
      .then(data => setMunicipios(data));

    fetch('http://localhost:8000/api/unidades-educativas')
      .then(res => res.json())
      .then(data => setUe(data));
  }, []);

  useEffect(() => {
    console.log('Unidades educativas cargadas:', ue);
  }, [ue]);

  const opcionesFiltradas = ue
    .filter(item => item.municipio_id === parseInt(formData.provincia))
    .map(item => ({ value: item.id, label: item.nombre }));

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
              options={municipios.map(mun => ({ value: mun.id, label: mun.nombre }))}
            />
            <RegistroForm label='C.I.' name='ci' value={formData.ci} onChange={setFormData} />
            <RegistroForm
              label='Nivel/Categoria'
              name='curso'
              type='select'
              value={formData.curso}
              onChange={setFormData}
              options={[
                { value: '', label: 'Seleccione un nivel/categoria' },
                { value: '3ro Primaria', label: '3ro Primaria' },
                { value: '4to Primaria', label: '4to Primaria' },
                { value: '5to Primaria', label: '5to Primaria' },
                { value: '6to Primaria', label: '6to Primaria' },
                { value: '1ro Secundaria', label: '1ro Secundaria' },
                { value: '2do Secundaria', label: '2do Secundaria' },
                { value: '3ro Secundaria', label: '3ro Secundaria' },
                { value: '4to Secundaria', label: '4to Secundaria' },
                { value: '5to Secundaria', label: '5to Secundaria' },
                { value: '6to Secundaria', label: '6to Secundaria' }
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
            <RegistroForm
              label='Unidad Educativa'
              name='unidadEducativa'
              type='select'
              value={formData.unidadEducativa}
              onChange={setFormData}
              options={opcionesFiltradas}
            />
            <RegistroForm label='Complemento (opcional)' name='complemento' value={formData.complemento} onChange={setFormData} />
            <RegistroForm
              label='Área'
              name='area'
              type='select'
              value={formData.area}
              onChange={setFormData}
              options={[
                { value: '', label: 'Seleccione el área' },
                { value: 'astronomia y astrofisica', label: 'Astronomia y Astrofisica' },
                { value: 'biologia', label: 'Biología' },
                { value: 'fisica', label: 'Fisica' },
                { value: 'informática', label: 'Informática' },
                { value: 'matematicas', label: 'Matemáticas' },
                { value: 'quimica', label: 'Quimica' },
                { value: 'robótica', label: 'Robótica' }
              ]}
            />
            <div className='contenedor-boton-registrar-est'>
              <BotonForm texto={modoEdicion ? "Guardar" : "Registrar"} onClick={handleRegistrar} />
            </div>
          </section>
        </div>
      </Caja>

      <Caja titulo='Estudiantes inscritos'>
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
          noDataComponent="No hay estudiantes inscritos aún"
          pagination
          responsive
        />
        <div className='contenedor-botones-tabla-est-inscritos'>
          <BotonForm className='botones-editar-eliminar-tabla-est' texto='Editar' onClick={handleEditar} />
          <BotonForm className='botones-editar-eliminar-tabla-est' texto='Eliminar' onClick={handleEliminar} />
        </div>
      </Caja>
    </div>
  );
};

export default Inscripciones;
