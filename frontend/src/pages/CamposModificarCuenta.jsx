import React, { useState, useEffect } from "react";
import api from '../api/axios';
import '../styles/CamposModificarCuenta.css';
import RegistroForm from '../components/RegistroForm';
import BotonForm from '../components/BotonForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { FaRegUser} from "react-icons/fa";
import { GiPadlock } from "react-icons/gi";
import { MdEmail } from "react-icons/md";

const CamposModificarCuenta = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombreCuenta: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await api.get('/user');
        setFormData({
          nombreCuenta: response.data.name || '',
          email: response.data.email || '',
          password: '',
          confirmarPassword: ''
        });
      } catch (error) {
        console.error('Error al traer datos del usuario', error);
      }
    };

    fetchUsuario();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validar nombre
    if (formData.nombreCuenta.trim() === '') {
        alert("El nombre no puede estar vacío.");
        return;
    }

    // Validar que el nombre solo contenga letras (puede contener espacios también)
    const nombreRegex = /^[a-zA-Z\s]+$/;
    if (!nombreRegex.test(formData.nombreCuenta)) {
        alert("El nombre solo puede contener letras y espacios, no números.");
        return;
    }

    // Validar email
    if (formData.email.trim() === '') {
        alert("El correo no puede estar vacío.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert("Por favor ingresa un correo electrónico válido.");
        return;
    }
  
    // Si intenta cambiar contraseña
    if (formData.password !== '' || formData.confirmarPassword !== '') {
      // Ambas deben estar llenas
        if (formData.password.trim() === '' || formData.confirmarPassword.trim() === '') {
            alert("Debes llenar ambos campos de contraseña.");          
            return;
        }
        
        // La contraseña debe tener al menos 6 caracteres
        if (formData.password.length < 6) {
            alert("La nueva contraseña debe tener al menos 6 caracteres.");
            return;
        }
  
      // Las contraseñas deben coincidir
        if (formData.password !== formData.confirmarPassword) {
            alert("Las contraseñas no coinciden.");
            return;
        }
    }

    const confirmar = window.confirm("¿Estás seguro de que deseas guardar los cambios?");
    if (!confirmar) return;

    try {
      await api.put('/user', {
        name: formData.nombreCuenta,
        email: formData.email,
        password: formData.password !== '' ? formData.password : undefined,
      });

      alert('¡Datos actualizados con éxito!');
      navigate('/');
    } catch (error) {
      console.error('Error al actualizar datos', error);
      alert('Ocurrió un error al actualizar tus datos.');
    }
  };

  return (
    <div className="page-container-modificar-cuenta">
      <section className="seccion-formulario-modificar-cuenta">
        <h2>Modificación de la cuenta</h2>
        <div className="cont-form-mod">
          <p>
            Modifica los campos que desees. Si no quieres cambiar tu contraseña puedes dejar los dos ultimos campos vacios.
          </p>
          <form onSubmit={onSubmit}>
            {/* Nombre */}
            <div className="div-label-input-modificar-cuenta">
              <RegistroForm
                label="Nombre"
                name="nombreCuenta"
                value={formData.nombreCuenta}
                onChange={setFormData}
                type="text"
                icono={FaRegUser}
              />
            </div>

            {/* Email */}
            <div className="div-label-input-modificar-cuenta">
              <RegistroForm
                label="Email"
                name="email"
                value={formData.email}
                onChange={setFormData}
                type="email"
                icono={MdEmail}
              />
            </div>
            {/* Nueva contraseña */}
            <div className="div-label-input-modificar-cuenta">
              <RegistroForm
                label="Nueva contraseña"
                name="password"
                value={formData.password}
                onChange={setFormData}
                type="password"
                icono={GiPadlock}
              />
            </div>

            {/* Confirmar nueva contraseña */}
            <div className="div-label-input-modificar-cuenta">
              <RegistroForm
                label="Confirmar nueva contraseña"
                name="confirmarPassword"
                value={formData.confirmarPassword}
                onChange={setFormData}
                type="password"
                icono={GiPadlock}
              />
            </div>

            {/* Botones */}
            <div className="div-label-input-modificar-cuenta">
              <BotonForm texto="Volver" type="button" onClick={(e) => {e.preventDefault(); navigate('/modificar-cuenta');}} />
              <BotonForm texto="Modificar" type="submit" />
            </div>
          </form>
         
        </div>
      </section>
    </div>
  );
};

export default CamposModificarCuenta;
