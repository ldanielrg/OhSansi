import React, { useState, useRef } from 'react';
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

  const [selectedRows, setSelectedRows] = useState([]);
  const selectedRowsRef = useRef([]);

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
    const { nombre, rude, provincia, ci, curso, categoria, fechaNac } = formData;

    if (!nombre || !rude || !provincia || !ci || !curso || !categoria || !fechaNac) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (modoEdicion && editIndex !== null) {
      const nuevosDatos = [...rowData];
      nuevosDatos[editIndex] = formData;
      setRowData(nuevosDatos);
      setModoEdicion(false);
      setEditIndex(null);
    } else {
      setRowData((prev) => [...prev, formData]);
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
    setFormData({ ...formData, ...seleccionado });
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
          onSelectedRowsChange={({ selectedRows }) => {
            setSelectedRows(selectedRows);
            selectedRowsRef.current = selectedRows;
          }}
          customStyles={customStyles}
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
