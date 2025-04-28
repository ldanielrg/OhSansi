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
    {
      name: 'Acciones',
      cell: row => (
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={() => navigate(`/formulario/${row.id_formulario}`)}>
            <FaEdit />
          </button>
          <button onClick={() => eliminarFormulario(row.id_formulario)}>
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
    navigate('/formulario/0');
  };
  
  

  const eliminarFormulario = async (id_formulario) => {
    const confirmacion = window.confirm('¿Deseas eliminar este formulario?');
    if (!confirmacion) return;
  
    try {
      await api.delete(`/formularios/${id_formulario}`);
      alert('Formulario eliminado exitosamente.');
  
      // Actualizar la lista de formularios: eliminarlo del estado
      setFormularios(prev => prev.filter(f => f.id_formulario !== id_formulario));
  
    } catch (error) {
      console.error('Error al eliminar formulario:', error);
      alert('Ocurrió un error al eliminar el formulario.');
    }
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