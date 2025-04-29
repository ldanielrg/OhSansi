import React, { useState, useEffect } from "react";
import api from '../api/axios';
import '../styles/CamposModificarCuenta.css';
import RegistroForm from '../components/RegistroForm';
import BotonForm from '../components/BotonForm';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { FaRegUser } from "react-icons/fa";
import { GiPadlock } from "react-icons/gi";
import { MdEmail } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// 👉 Agregamos SweetAlert2
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

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
        toast.error('No se pudieron cargar los datos del usuario.');
      }
    };

    fetchUsuario();
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (formData.nombreCuenta.trim() === '') {
      toast.warn("El nombre no puede estar vacío.");
      return;
    }

    const nombreRegex = /^[a-zA-Z\s]+$/;
    if (!nombreRegex.test(formData.nombreCuenta)) {
      toast.warn("El nombre solo puede contener letras y espacios, no números.");
      return;
    }

    if (formData.email.trim() === '') {
      toast.warn("El correo no puede estar vacío.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.warn("Por favor ingresa un correo electrónico válido.");
      return;
    }

    if (formData.password !== '' || formData.confirmarPassword !== '') {
      if (formData.password.trim() === '' || formData.confirmarPassword.trim() === '') {
        toast.warn("Debes llenar ambos campos de contraseña.");
        return;
      }

      if (formData.password.length < 6) {
        toast.warn("La nueva contraseña debe tener al menos 6 caracteres.");
        return;
      }

      if (formData.password !== formData.confirmarPassword) {
        toast.warn("Las contraseñas no coinciden.");
        return;
      }
    }

    // 👉 Aquí cambiamos el window.confirm por SweetAlert
    const result = await MySwal.fire({
      title: '¿Guardar cambios?',
      text: "Esta acción actualizará tus datos.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar'
    });

    if (!result.isConfirmed) {
      return; // El usuario canceló
    }

    try {
      await api.put('/user', {
        name: formData.nombreCuenta,
        email: formData.email,
        password: formData.password !== '' ? formData.password : undefined,
      });

      toast.success('¡Datos actualizados con éxito!');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (error) {
      console.error('Error al actualizar datos', error);
      toast.error('Ocurrió un error al actualizar tus datos.');
    }
  };

  return (
    <>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />
      <div className="page-container-modificar-cuenta">
        <section className="seccion-formulario-modificar-cuenta">
          <h2>Modificación de la cuenta</h2>
          <div className="cont-form-mod">
            <p>
              Modifica los campos que desees. Si no quieres cambiar tu contraseña puedes dejar los dos últimos campos vacíos.
            </p>
            <form onSubmit={onSubmit}>
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

              <div className="div-label-input-modificar-cuenta">
                <BotonForm texto="Volver" type="button" onClick={(e) => { e.preventDefault(); navigate('/modificar-cuenta'); }} />
                <BotonForm texto="Modificar" type="submit" />
              </div>
            </form>
          </div>
        </section>
      </div>
    </>
  );
};

export default CamposModificarCuenta;
