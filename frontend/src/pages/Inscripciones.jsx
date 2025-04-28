import React, { useEffect, useState, useRef } from 'react';
import '../styles/Inscripciones.css';
import Caja from '../components/Caja';
import BotonForm from '../components/BotonForm';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Inscripciones = () => {
  // --- FUTURO: Sección de estudiantes y formData (para Formulario.jsx) ---
  /*
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
  */

  // --- CRUD de Formularios ---
  const [formularios, setFormularios] = useState([]);
  const [formularioIdCounter, setFormularioIdCounter] = useState(1);
  const navigate = useNavigate();

  const formularioColumns = [
    { name: 'ID', selector: row => row.id, sortable: true },
    { name: 'Cantidad Estudiantes', selector: row => row.estudiantes.length },
    {
      name: 'Acciones',
      cell: row => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className='botones-iconos-crud-formularios'onClick={() => navigate(`/formulario/${row.id}`)}>
            <FaEdit className='iconos-crud-formularios'/>
          </button>
          <button className='botones-iconos-crud-formularios' onClick={() => eliminarFormulario(row.id)}>
            <FaTrash className='iconos-crud-formularios'/>
          </button>
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

  const agregarFormulario = () => {
    const nuevoFormulario = {
      id: formularioIdCounter,
      estudiantes: [] // o un array vacío, o lo que quieras predefinir
    };
    setFormularios(prev => [...prev, nuevoFormulario]);
    setFormularioIdCounter(prev => prev + 1);
  };
  

  const eliminarFormulario = (id) => {
    const confirmacion = window.confirm('¿Deseas eliminar este formulario?');
    if (!confirmacion) return;

    setFormularios(prev => prev.filter(f => f.id !== id));
  };

  // --- FUTURO: Cargar opciones (para Formulario.jsx) ---
  /*
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
  */

  return (
    <div className="page-container">
      <Caja titulo='Tomar en cuenta' width='50%'>
        <div>Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo, alias! Beatae, ullam dolorum...</div>
      </Caja>

      <section className='seccion-crud-formularios'>
        <div className='para-separar-de-tabla-formularios'>
          <BotonForm
            texto='+ Agregar Formulario'
            className='boton-añadir-formularios'
            onClick={agregarFormulario}
          />
        </div>

        <DataTable
          columns={formularioColumns}
          data={formularios}
          noDataComponent='Aún no se han registrado formularios.'
          pagination
          customStyles={customStyles}
        />
      </section>
    </div>
  );
};

export default Inscripciones;
