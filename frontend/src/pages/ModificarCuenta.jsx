import React, { useState } from "react";
import axios from "axios";
import '../styles/ModificarCuenta.css';
import RegistroForm from '../components/RegistroForm';
import BotonForm from '../components/BotonForm';
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from 'react-router-dom';

const ModificarCuenta = () => {
  const { token } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: ''
  });


  /*const validarPassword = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/verify-password', {
        password: formData.password
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
  
      return response.data.valid;
    } catch (error) {
      console.error('Error al validar la contraseña', error);
      return false;
    }
  };*/

  const validarPassword = async () => {
    try {
      console.log(formData.password);
      
      const response = await axios.post('api/user/verify-password', {
        password: formData.password
      });
  
      return response.data.valid;
    } catch (error) {
      console.error('Error al validar la contraseña', error);
      return false;
    }
  };
  
  
  

  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password.trim() === '') {
      alert("Por favor, ingresa tu contraseña.");
      return;
    }
  
    const esPasswordCorrecta = await validarPassword();
    if (!esPasswordCorrecta) {
      alert("La contraseña ingresada no es correcta. Intenta nuevamente.");
      return;
    }
  
    alert("Contraseña verificada con éxito.");
    navigate('/modificar-campos');
  };
  

  return (
    <div className="page-container-modificar-cuenta">
      <section className="seccion-formulario-modificar-cuenta">
        <h2>Confirmar Contraseña</h2>
        <div className="cont-form-mod">

          <form onSubmit={onSubmit}>
            <div className="div-label-input-modificar-cuenta">
              <RegistroForm
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
