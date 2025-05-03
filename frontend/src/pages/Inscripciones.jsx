import React, { useEffect, useState, useRef } from 'react';
import '../styles/Inscripciones.css';
import Caja from '../components/Caja';
import BotonForm from '../components/BotonForm';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BsFileEarmarkText } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

// Toastify
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Loader
import { BallTriangle } from 'react-loader-spinner';

// Sweetalert2
import Swal from 'sweetalert2';

const Inscripciones = () => {
  const [formularios, setFormularios] = useState([]);
  const [formularioIdCounter, setFormularioIdCounter] = useState(1);
  const [cargando, setCargando] = useState(true); // Estado de carga
  const navigate = useNavigate();

  // Recuperación de formularios que pertenecen al usuario
  useEffect(() => {
    const obtenerFormularios = async () => {
      try {
        const response = await api.post('/formularios');
        setFormularios(response.data.formularios);
      } catch (error) {
        console.error('Error al recuperar formularios:', error);
        toast.error('Ocurrió un error al recuperar formularios.');
      } finally {
        setCargando(false); // ✅ Finalizar carga siempre
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
          <button
            className='botones-iconos-crud-formularios'
            onClick={() => navigate(`/formulario/${row.id_formulario}`)}
          >
            <FaEdit className='iconos-crud-formularios icono-editar-formulario' />
          </button>

          <button
            className='botones-iconos-crud-formularios'
            onClick={() => eliminarFormulario(row.id_formulario)}
          >
            <FaTrash className='iconos-crud-formularios icono-eliminar-formulario' />
          </button>

          <button
            className='botones-iconos-crud-formularios'
          >
            <BsFileEarmarkText className='iconos-crud-formularios icono-orden-pago-formulario' />
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
    const result = await Swal.fire({
      title: '¿Eliminar formulario?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/formularios/${id_formulario}`);
      toast.success('Formulario eliminado exitosamente.');

      // Actualizar la lista de formularios
      setFormularios(prev => prev.filter(f => f.id_formulario !== id_formulario));
    } catch (error) {
      console.error('Error al eliminar formulario:', error);
      toast.error('Ocurrió un error al eliminar el formulario.');
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      {cargando ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          backgroundColor: "#f8f9fa"
        }}>
          <BallTriangle
            height={50}
            width={50}
            radius={5}
            color="#003366"
            ariaLabel="ball-triangle-loading"
            visible={true}
          />
        </div>
      ) : (
        <div className="page-container">
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
      )}
    </>
  );
};

export default Inscripciones;
