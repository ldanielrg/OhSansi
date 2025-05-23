import React, { useEffect, useState, useRef } from 'react';
import '../styles/Inscripciones.css';
import Caja from '../components/Caja';
import BotonForm from '../components/BotonForm';
import DataTable from 'react-data-table-component';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { BsFileEarmarkText } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useSearchParams } from 'react-router-dom';

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
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();
  const [convocatorias, setConvocatorias] = useState([]);
  const [convocatoriaSeleccionada, setConvocatoriaSeleccionada] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [cargandoConvocatorias, setCargandoConvocatorias] = useState(true);
  const [pagandoId, setPagandoId] = useState(null);


  const handleConvocatoriaChange = (e) => {
  const id = e.target.value;
    setConvocatoriaSeleccionada(id);
    setSearchParams({ convocatoria: id });
  };

  useEffect(() => {
    const obtenerFormularios = async () => {
      const id = parseInt(convocatoriaSeleccionada);
      if (!id || isNaN(id)) return;

      setCargando(true);
      try {
        const res = await api.get(`/recuperar-formularios/${id}`);
        console.log('Respuesta completa:', res.data);
        setFormularios(res.data.formularios);
      } catch (error) {
        console.error('Error al recuperar formularios:', error);
        toast.error('Ocurrió un error al recuperar los formularios.');
      } finally {
        setCargando(false);
      }
    };

    obtenerFormularios();
  }, [convocatoriaSeleccionada]);

  useEffect(() => {
    const obtenerConvocatorias = async () => {
      try {
        const res = await api.get('/convocatorias-activas');
        setConvocatorias(res.data.filter(c => c.activo));
      } catch (error) {
        console.error('Error al obtener convocatorias:', error);
      } finally {
        setCargandoConvocatorias(false); // importante: en el finally
      }
    };
    obtenerConvocatorias();
  }, []);


  useEffect(() => {
  const idFromUrl = searchParams.get('convocatoria');
  if (idFromUrl) {
    setConvocatoriaSeleccionada(idFromUrl);
  }
}, []);


  const formularioColumns = [
    { name: 'ID de Formulario', selector: row => row.id_formulario, sortable: true },
    { name: 'Cantidad Estudiantes', selector: row => row.inscripciones_count},
    {
  name: 'Acciones',
  cell: row => {
    const estaPagado = row.pagado === true;

    return (
      <div style={{ display: 'flex', gap: '10px' }}>
        {/* Editar */}
        <div className='contenedor-botones-crud-forms'>
          <button
            className={`botones-iconos-crud-formularios ${estaPagado ? 'boton-deshabilitado' : ''}`}
            onClick={() => !estaPagado && navigate(`/formulario/${row.id_formulario}`)}
            disabled={estaPagado}
            title={estaPagado ? 'Formulario pagado - no editable' : 'Editar formulario'}
          >
            <FaEdit className='iconos-crud-formularios icono-editar-formulario' />
          </button>
          <p className='label-botones-crud-forms'>Editar</p>
        </div>

        {/* Eliminar */}
        <div className='contenedor-botones-crud-forms'>
          <button
            className={`botones-iconos-crud-formularios ${estaPagado ? 'boton-deshabilitado' : ''}`}
            onClick={() => !estaPagado && eliminarFormulario(row.id_formulario)}
            disabled={estaPagado}
            title={estaPagado ? 'Formulario pagado - no se puede eliminar' : 'Eliminar formulario'}
          >
            <FaTrash className='iconos-crud-formularios icono-eliminar-formulario' />
          </button>
          <p className='label-botones-crud-forms'>Eliminar</p>
        </div>

        {/* Orden de pago */}
        <div className='contenedor-botones-crud-forms'>
          <button
            className='botones-iconos-crud-formularios'
            onClick={() => handleOrdenPago(row.id_formulario)}
          >
            {pagandoId === row.id_formulario ? (
              <BallTriangle height={20} width={20} color="#003366" />
            ) : (
              <BsFileEarmarkText className='iconos-crud-formularios icono-orden-pago-formulario' />
            )}
          </button>
          <p className='label-botones-crud-forms'>
            {row.pagado ? 'Pagado' : 'Pago'}
          </p>
        </div>

      </div>
    );
  }
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
      await api.delete(`/formulario-eliminar/${id_formulario}`);
      toast.success('Formulario eliminado exitosamente.');
      setFormularios(prev => prev.filter(f => f.id_formulario !== id_formulario));
    } catch (error) {
      console.error('Error al eliminar formulario:', error);
      if (error.response) {
        console.error('Detalle del error:', error.response.data);
        toast.error(error.response.data.message || 'Ocurrió un error al eliminar el formulario.');
      } else {
        toast.error('Error de conexión o inesperado.');
      }
    }
  };

const handleOrdenPago = async (id_formulario) => {
  setPagandoId(id_formulario); // 🚀 Activar loader

  try {
    await api.get(`/orden-pago/${id_formulario}`);
    navigate(`/orden-de-pago/${id_formulario}?convocatoria=${convocatoriaSeleccionada}`);
  } catch (error) {
    if (error.response && error.response.status === 404) {
      try {
        await api.post('/orden-pago', {
          fecha_emision: new Date().toISOString().split('T')[0],
          fecha_vencimiento: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
          monto_total: 20,
          id_formulario_formulario: id_formulario
        });
        navigate(`/orden-de-pago/${id_formulario}?convocatoria=${convocatoriaSeleccionada}`);
      } catch (crearError) {
        toast.error('No se pudo crear la orden de pago.');
        console.error(crearError);
      }
    } else {
      toast.error('Error al verificar la orden de pago.');
      console.error(error);
    }
  } finally {
    setPagandoId(null); // ✅ Desactivar loader
  }
};

const handleConvocatoriaChangeManual = (id) => {
  setConvocatoriaSeleccionada(id);
  setSearchParams({ convocatoria: id });
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

      <div className="page-container">
        <section className='seccion-crud-formularios'>
          {!convocatoriaSeleccionada && (
          <div className='para-separar-de-tabla-formularios'>
            <h3 className='label-seleccionar-convocatoria'>Selecciona la convocatoria donde quieres inscribir</h3>

            {cargandoConvocatorias ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
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
              <div className="seccion-botones-inscripciones-convocatoria">
                {convocatorias.map((conv) => (
                  <button
                    key={conv.id_convocatoria}
                    onClick={() => handleConvocatoriaChangeManual(conv.id_convocatoria)}
                    className={`botones-inscripciones-convocatoria ${
                      convocatoriaSeleccionada === conv.id_convocatoria ? 'activo' : ''
                    }`}
                  >
                    {conv.nombre_convocatoria}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

          {convocatoriaSeleccionada && (
            <>
              <div className='para-separar-de-tabla-formularios'>
                <BotonForm
                  texto='+ Agregar Formulario'
                  className='boton-añadir-formularios'
                  onClick={() =>
  navigate(`/formulario/0?convocatoria=${convocatoriaSeleccionada}`)
}

                />
              </div>

              {cargando ? (
                <div style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "40vh",
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
                <DataTable
                  columns={formularioColumns}
                  data={formularios}
                  noDataComponent='Aún no se han registrado formularios.'
                  customStyles={customStyles}
                  responsive
                />
              )}
            </>
          )}
        </section>
      </div>
    </>
  );
};

export default Inscripciones;
