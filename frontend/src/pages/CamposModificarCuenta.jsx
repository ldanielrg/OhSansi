import React, { useState, useEffect } from "react";
import api from '../api/axios';
import '../styles/CamposModificarCuenta.css';
import RegistroForm from '../components/RegistroForm';
import BotonForm from '../components/BotonForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";

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

    if (formData.password !== formData.confirmarPassword) {
      alert("Las contraseñas no coinciden.");
      return;
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
          <form onSubmit={onSubmit}>
            {/* Nombre */}
            <div className="div-label-input-modificar-cuenta">
              <RegistroForm
                label="Nombre"
                name="nombreCuenta"
                value={formData.nombreCuenta}
                onChange={setFormData}
                type="text"
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
              />
            </div>

            {/* Botones */}
            <div className="div-label-input-modificar-cuenta">
              <BotonForm texto="Volver" type="button" onClick={() => navigate('/modificar-cuenta')} />
              <BotonForm texto="Modificar" type="submit" />
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CamposModificarCuenta;
