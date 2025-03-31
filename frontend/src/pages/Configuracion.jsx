import React, { useState } from 'react';
import Caja from '../components/Caja';
import { useNavigate } from 'react-router-dom';
import '../styles/Configuracion.css';

const opciones = [
  'Director',
  'Docente',
  'Tutor',
  'Adm. Inscripciones',
  'Cajas',
  'Organizador',
  'Auxiliares',
  'Administradores'
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aquí puedes enviar la data al backend o validarla
    console.log('Cuenta creada:', { tipoCuenta, ...formData });
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
