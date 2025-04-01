import React, { useState } from 'react';
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
  const [editIndex, setEditIndex] = useState(null); // ← guarda índice a editar
  const [modoEdicion, setModoEdicion] = useState(false); // ← si estás en edición
  
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

  const columns = [
    { name: 'Nombre Completo', selector: row => row.nombre, sortable: true },
    { name: 'RUDE', selector: row => row.rude },
    { name: 'Provincia', selector: row => row.provincia },
    { name: 'CI/Pasaporte', selector: row => row.ci },
    { name: 'Curso', selector: row => row.curso },
    { name: 'Categoría', selector: row => row.categoria },
    { name: 'Fecha Nacimiento', selector: row => row.fechaNac }
  ];

  const customStyles = {
    headCells: {
      style: {
        backgroundColor: '#E1F4FF',
        color: 'black',
        fontWeight: 'bold',
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
      // 🔁 Actualizar registro existente
      const nuevosDatos = [...rowData];
      nuevosDatos[editIndex] = formData;
      setRowData(nuevosDatos);
      setModoEdicion(false);
      setEditIndex(null);
    } else {
      // ➕ Registrar nuevo
      setRowData((prev) => [...prev, formData]);
    }
  
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
  

  const handleEditar = () => {
    if (selectedRows.length === 0) {
      alert('Por favor selecciona un registro para editar.');
      return;
    }
  
    const seleccionado = selectedRows[0];
    const index = rowData.findIndex(est => est.ci === seleccionado.ci); // o por algún otro campo único
    setFormData({ ...formData, ...seleccionado });
    setEditIndex(index);
    setModoEdicion(true);
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
          onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
          customStyles={customStyles}
          pagination
          responsive
        />
        <div className='contenedor-botones-tabla-est-inscritos'>
          <BotonForm texto='Editar' onClick={handleEditar} />
          <BotonForm texto='Eliminar' />
        </div>
      </Caja>
    </div>
  );
};

export default Inscripciones;
