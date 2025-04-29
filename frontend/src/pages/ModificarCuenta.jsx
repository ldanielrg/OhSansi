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

  const [loading, setLoading] = useState(false); // Agregado para manejar el estado de carga


  const onSubmit = async (e) => {
    e.preventDefault();

    if (loading) return; // Evitar que se vuelva a enviar si ya está procesando
    setLoading(true); // Comienza la carga
  
    if (formData.password.trim() === '') {
      alert("Por favor, ingresa tu contraseña.");
      setLoading(false); // Resetear carga si hay error
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
