import React, { useState, useEffect } from "react";
import axios from "axios";
import '../styles/ModificarCuenta.css';
import RegistroForm from '../components/RegistroForm';
import BotonForm from '../components/BotonForm';
import { useAuth } from "../context/AuthContext"; 
import { useNavigate } from 'react-router-dom';

const ModificarCuenta = () => {
  const { token } = useAuth(); // PARA TRAER LOS TOKEN
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({});
  
  // Estado para manejar contraseñas
  const [formData, setFormData] = useState({
    password: '',
    confirmarPassword: ''
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setUsuario(response.data);
      } catch (error) {
        console.error('Error al traer datos del usuario', error);
      }
    };

    if (token) {
      fetchUsuario();
    }
  }, [token]);

  const onSubmit = async () => {
    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
  
    const confirmar = window.confirm("¿Estás seguro de que deseas guardar los cambios?");
    if (confirmar) {
      try {
        await axios.put('http://127.0.0.1:8000/api/user', {
          name: usuario.name,
          email: usuario.email,
          username: usuario.username,
          password: formData.password !== '' ? formData.password : undefined,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
  
        alert('¡Datos actualizados con éxito!');
        navigate('/modificar-campos');
      } catch (error) {
        console.error('Error al actualizar datos', error);
      }
    }
  };

  return (
    <div className="page-container-modificar-cuenta">
      <section className="seccion-formulario-modificar-cuenta">
        <h2>Modificación de la cuenta</h2>
        <div className="cont-form-mod">
  
          <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
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
              <RegistroForm
                label="Confirmar contraseña"
                type="password"
                name="confirmarPassword"
                value={formData.confirmarPassword}
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
