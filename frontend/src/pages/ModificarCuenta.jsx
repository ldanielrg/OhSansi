import React, { useState } from "react";
import axios from "axios";
import '../styles/ModificarCuenta.css';
import { ToastContainer, toast} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RegistroForm from '../components/RegistroForm';
import BotonForm from '../components/BotonForm';
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { GiPadlock } from "react-icons/gi";

const ModificarCuenta = () => {
  const { token } = useAuth(); 
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: ''
  });

  const onSubmit = async (e) => {
    e.preventDefault();
  
    if (formData.password.trim() === '') {
      toast.warn("Por favor, ingresa tu contraseña."); // <- cambia alert por toast.warn
      return;
    }
  
    try {
      const response = await api.post('/user/verify-password', {
        password: formData.password
      });
  
      if (response.data.valid) {
        toast.success("Contraseña verificada con éxito."); // <- cambia alert por toast.success
        setTimeout(() => {
          navigate('/modificar-campos');
        }, 2000); // para que le dé tiempo de ver el toast antes de redirigir
      } else {
        toast.error("La contraseña es incorrecta. Intenta de nuevo."); // <- cambia alert por toast.error
      }
  
    } catch (error) {
      console.error('Error al validar la contraseña', error);
      toast.error("Ocurrió un error al validar la contraseña."); // <- cambia alert por toast.error
    }
  };
  

  return (
    <div className="page-container-modificar-cuenta">
      <ToastContainer
          position="bottom-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          theme="light" // Puedes usar colored o dark o light
      />


      <section className="seccion-formulario-modificar-cuenta">
        <h2>Confirmar Contraseña</h2>
        <p>
          Para modificar los datos de tu cuenta por favor ingresa primero tu contraseña.
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
                icono={GiPadlock}
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
