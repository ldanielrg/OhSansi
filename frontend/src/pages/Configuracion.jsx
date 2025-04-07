import React, { useState } from 'react';
import Caja from '../components/Caja';
import { useNavigate } from 'react-router-dom';
import '../styles/Configuracion.css';
import api from '../api/axios';


const opciones = [
  'Admin',
  'Director',
  'Docente',
  'Tutor',
  'Adm. Inscripcion',
  'Caja',
  'Organizador',
  'Aux'
];

const Configuracion = () => {
  const [tipoCuenta, setTipoCuenta] = useState('');
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo: '',
    celular: '',
    password: '',
    confirmarPassword: ''
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Validación simple
    if (formData.password !== formData.confirmarPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
  
    try {
      const response = await api.post('/crear-cuenta', {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        correo: formData.correo,
        celular: formData.celular,
        password: formData.password,
        rol: tipoCuenta, // mandamos el tipo de cuenta como rol
      });
  
      alert('Cuenta creada exitosamente');
      // Reiniciar el formulario
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
            {opciones.map((opcion, index) => (
              <option key={index} value={opcion}>{opcion}</option>
            ))}
          </select>
        </div>
        
        {/* Mostrar el formulario si se ha elegido un tipo */}
        {tipoCuenta && (
            <form className="formulario-cuenta" onSubmit={handleSubmit}>
                <div className="form-column">
                <label>Apellidos</label>
                <input name="apellidos" value={formData.apellidos} onChange={handleInputChange} />

                <label>Celular</label>
                <input name="celular" value={formData.celular} onChange={handleInputChange} />

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

export default Configuracion;
