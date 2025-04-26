import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import '../styles/ModificarCuenta.css';
import RegistroForm from '../components/RegistroForm';
import BotonForm from '../components/BotonForm';
import { useAuth } from "../context/AuthContext"; 


const ModificarCuenta = () => {
  const { token } = useAuth(); //PARA TRAER LOS TOKEN

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user', {
          headers: {
            Authorization: `Bearer ${token}` // <- Aquí debes poner la variable que tengas del token de autenticación
          }
        });
        setUsuario(response.data);
        setValue("nombreCuenta", response.data.name);
        setValue("email", response.data.email);
        // Contrasenia no se debe mostrar por seguridad
      } catch (error) {
        console.error('Error al traer datos del usuario', error);
      }
    };

    if (token) {
      fetchUsuario();
    }
  
  }, [token, setValue]);



  const onSubmit = async (data) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas guardar los cambios?");
    if (confirmar) {
      try {
        await axios.put('http://127.0.0.1:8000/api/user', {
          name: data.nombreCuenta,
          email: data.email,
          username: usuario.username, // importante mantener username original
          password: data.password !== '' ? data.password : undefined, // solo si quiere cambiar contraseña
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
  
        alert('¡Datos actualizados con éxito!');
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
  
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Nombre */}
            <div className="div-label-input-modificar-cuenta">
              <RegistroForm
                label="Nombre"
                type="text"
                {...register('nombreCuenta', { required: 'El nombre es obligatorio' })}
              />
            </div>
            {errors.nombreCuenta && <p>{errors.nombreCuenta.message}</p>}
  
            {/* Email */}
            <div className="div-label-input-modificar-cuenta">
              <RegistroForm
                label="Email"
                type="email"
                {...register('email', { required: 'El email es obligatorio' })}
              />
            </div>
            {errors.email && <p>{errors.email.message}</p>}
  
            {/* Contraseña */}
            <div className="div-label-input-modificar-cuenta">
              <RegistroForm
                label="Contraseña"
                type="password"
                {...register('password')}
              />
            </div>
            {errors.password && <p>{errors.password.message}</p>}
  
            {/* Confirmar contraseña */}
            <div className="div-label-input-modificar-cuenta">
              <RegistroForm
                label="Confirmar contraseña"
                type="password"
                {...register('confirmarPassword')}
              />
            </div>
  
            {/* Botones */}
            <div className="div-label-input-modificar-cuenta">
              <BotonForm className="ddddddd" texto="Volver" type="button" />
              <BotonForm texto="Confirmar" type="submit" />
            </div>
          </form>
  
        </div>
      </section>
    </div>
  );
  
};

export default ModificarCuenta;
