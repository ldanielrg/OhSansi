import React, { useState, useEffect } from 'react';
import Caja from '../components/Caja';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/CrearCuentas.css';
import api from '../api/axios';

const todasLasOpciones = [
  'Admin',
  'Director',
  'Docente',
  'Tutor',
  'Adm. Inscripcion',
  'Caja',
  'Organizador',
  'Aux'
];

const CrearCuentas = () => {
  const [tipoCuenta, setTipoCuenta] = useState('');
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    ci: '',
    password: '',
    confirmarPassword: ''
  });

  const { roles, loading } = useAuth();
  const navigate = useNavigate();
  const [opcionesDisponibles, setOpcionesDisponibles] = useState([]);
  const [unidadesEducativas, setUnidadesEducativas] = useState([]);
  const [unidadSeleccionada, setUnidadSeleccionada] = useState('');

  // Definir opciones de roles disponibles
  useEffect(() => {
    if (!loading) {
      if (roles.includes('Admin')) {
        setOpcionesDisponibles(todasLasOpciones);
      } else if (roles.includes('Director')) {
        setOpcionesDisponibles(['Docente']);
      } else if (roles.includes('Adm. Inscripcion')) {
        setOpcionesDisponibles(['Aux']);
      } else {
        navigate('/no-autorizado');
      }
    }
  }, [roles, loading, navigate]);

  // Cargar unidades educativas solo si Admin crea Director o Docente
  useEffect(() => {
    const fetchUnidades = async () => {
      try {
        const res = await api.get('/unidades-educativas');
        setUnidadesEducativas(res.data);
      } catch (error) {
        console.error('Error al cargar unidades educativas', error);
      }
    };

    if (roles.includes('Admin') && (tipoCuenta === 'Director' || tipoCuenta === 'Docente')) {
      fetchUnidades();
    }
  }, [tipoCuenta, roles]);

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Validación extra para Admin creando Director o Docente
    if ((tipoCuenta === 'Director' || tipoCuenta === 'Docente') && roles.includes('Admin') && !unidadSeleccionada) {
      alert('Debes seleccionar una Unidad Educativa');
      return;
    }

    try {
      const payload = {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        ci: parseInt(formData.ci, 10),
        password: formData.password,
        rol: tipoCuenta,
      };

      // Solo Admin debe enviar unidad educativa seleccionada
      if (roles.includes('Admin') && (tipoCuenta === 'Director' || tipoCuenta === 'Docente')) {
        payload.unidad_educativa_id = parseInt(unidadSeleccionada, 10);
      }
      console.log(payload)
      await api.post('/crear-cuenta', payload);

      alert('Cuenta creada exitosamente');
      setFormData({
        nombres: '',
        apellidos: '',
        correo: '',
        ci: '',
        password: '',
        confirmarPassword: ''
      });
      setTipoCuenta('');
      setUnidadSeleccionada('');
    } catch (error) {
      console.error(error.response?.data || error);
      alert('Hubo un error al crear la cuenta');
    }
  };

  if (loading) return null;

  return (
    <div className="pagina-configuracion">
      <Caja titulo={`Creando cuenta ${tipoCuenta || ''}`}>
        <div className="selector-container">
          <select
            value={tipoCuenta}
            onChange={(e) => setTipoCuenta(e.target.value)}
            className="selector-tipo-cuenta"
          >
            <option value="">Selecciona tipo de cuenta</option>
            {opcionesDisponibles.map((opcion, index) => (
              <option key={index} value={opcion}>{opcion}</option>
            ))}
          </select>
        </div>

        {tipoCuenta && (
          <form className="formulario-cuenta" onSubmit={handleSubmit}>
            <div className="form-column">
              <label>Apellidos</label>
              <input name="apellidos" value={formData.apellidos} onChange={handleInputChange} />

              <label>CI</label>
              <input name="ci" value={formData.ci} onChange={handleInputChange}/>

              <label>Contraseña</label>
              <input type="password" name="password" value={formData.password} onChange={handleInputChange} />
            </div>

            <div className="form-column">
              <label>Nombres</label>
              <input name="nombres" value={formData.nombres} onChange={handleInputChange} />

              <label>Correo Electrónico</label>
              <input type="email" name="correo" value={formData.correo} onChange={handleInputChange} />

              <label>Confirmar Contraseña</label>
              <input type="password" name="confirmarPassword" value={formData.confirmarPassword} onChange={handleInputChange} />
            </div>

            {/* Mostrar el selector solo si Admin crea Director o Docente */}
            {roles.includes('Admin') && (tipoCuenta === 'Director' || tipoCuenta === 'Docente') && (
              <div className="form-column">
                <label>Unidad Educativa</label>
                <select
                  value={unidadSeleccionada}
                  onChange={(e) => setUnidadSeleccionada(e.target.value)}
                >
                  <option value="">Selecciona Unidad Educativa</option>
                  {unidadesEducativas.map((ue) => (
                    <option key={ue.id} value={ue.id_ue}>
                      {ue.nombre_ue}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="form-botones">
              <button type="button" className="boton-volver" onClick={() => navigate(-1)}>Volver</button>
              <button type="submit" className="boton-crear">Crear cuenta</button>
            </div>
          </form>
        )}
      </Caja>
    </div>
  );
};

export default CrearCuentas;
