import React, { useState, useEffect } from 'react';
import Caja from '../components/Caja';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <-- Importamos el AuthContext
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
  

  const { roles, loading } = useAuth(); // Usamos el contexto de auth
  const navigate = useNavigate();
  const [opcionesDisponibles, setOpcionesDisponibles] = useState([]);

  // Definir qué opciones mostrar según el rol
  useEffect(() => {
    if (!loading) {
      if (roles.includes('Admin')) {
        setOpcionesDisponibles(todasLasOpciones);
      } else if (roles.includes('Director')) {
        setOpcionesDisponibles(['Docente']);
      } else if (roles.includes('Adm. Inscripcion')) {
        setOpcionesDisponibles(['Aux']);
      }
    }
  }, [roles, loading]);

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
  
    try {
      const response = await api.post('/crear-cuenta', {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        ci: parseInt(formData.ci),
        password: formData.password,
        rol: tipoCuenta,
      });
      
  
      alert('Cuenta creada exitosamente');
      setFormData({
        nombres: '',
        apellidos: '',
        correo: '',
        celular: '',
        password: '',
        confirmarPassword: ''
      });
      setTipoCuenta('');
    } catch (error) {
      console.error(error.response?.data || error);
      alert('Hubo un error al crear la cuenta');
    }
  };

  if (loading) return null; // Esperar a que cargue auth

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
              <input
                name="ci" value={formData.ci} onChange={handleInputChange} />

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
