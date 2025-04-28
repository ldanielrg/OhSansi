import React, { useState } from "react";
import axios from "axios";
import '../styles/ModificarCuenta.css';
import RegistroForm from '../components/RegistroForm';
import BotonForm from '../components/BotonForm';
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const ModificarCuenta = () => {
  const { token } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: ''
  });

  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password.trim() === '') {
      alert("Por favor, ingresa tu contraseña.");
      return;
    }
  
    try {
      const response = await api.post('/user/verify-password', {
        password: formData.password
      });
  
      if (response.data.valid) {
        alert("Contraseña verificada con éxito.");
        navigate('/modificar-campos');
      } else {
        alert("La contraseña es incorrecta. Intenta de nuevo.")
        ;
      }
  
    } catch (error) {
      console.error('Error al validar la contraseña', error);
      alert("Ocurrió un error al validar la contraseña.");
    }
  };

  return (
    <div className="page-container-modificar-cuenta">
      <section className="seccion-formulario-modificar-cuenta">
        <h2>Confirmar Contraseña</h2>
        <p>
          Para modificar los datos de tu cuenta por favor ingresa tu contraseña.
        </p>
        <div className="cont-form-mod">
          <form onSubmit={onSubmit}>
            <div className="div-label-input-modificar-cuenta">
              <RegistroForm
                className='campo-contraseña-mod-cuenta'
                label="Contraseña"
                type="password"
                name="password"
                value={formData.password}
                onChange={setFormData}
              />
            </div>

            <div className="div-label-input-modificar-cuenta">
              <BotonForm texto="Confirmar" type="submit" />
            </div>
          </form>

        </div>
      </section>
    </div>
  );
};

export default ModificarCuenta;
