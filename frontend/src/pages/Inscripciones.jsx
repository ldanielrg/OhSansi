import React, { useEffect, useState, useRef } from 'react';
import '../styles/Inscripciones.css';
import Caja from '../components/Caja';
import BotonForm from '../components/BotonForm';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';


const Inscripciones = () => {
  // --- CRUD de Formularios ---
  const [formularios, setFormularios] = useState([]);
  const [formularioIdCounter, setFormularioIdCounter] = useState(1);
  const navigate = useNavigate();

  //Recuparación de formularios que pertenecen al usuario
  useEffect(() => {
    const obtenerFormularios = async () => {
      try {
        const response = await api.post('/formularios');
        setFormularios(response.data.formularios);
      } catch (error) {
        console.error('Error al recuperar formularios:', error);
      }
    };
  
    obtenerFormularios();
  }, []);
  

  const formularioColumns = [
    { name: 'ID', selector: row => row.id_formulario, sortable: true },
    { name: 'Cantidad Estudiantes', selector: row => row.inscripciones_count },
    //Comento esto porque no estoy implementando para recuperar estudiantes.
    {
      name: 'Acciones',
      cell: row => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate(`/formulario/${row.id}`)}>
            <FaEdit />
          </button>
          <button onClick={() => eliminarFormulario(row.id)}>
            <FaTrash />
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