import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import '../styles/CamposModificarCuenta.css';
import RegistroForm from '../components/RegistroForm';
import BotonForm from '../components/BotonForm';
import { useAuth } from "../context/AuthContext"; 

const ModificarCuenta = () => {
  const [usuario, setUsuario] = useState({
    nombreCuenta: "Juan Pérez",
    email: "juan@example.com",
    password: "123456",
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setValue("nombreCuenta", usuario.nombreCuenta);
    setValue("email", usuario.email);
    setValue("password", usuario.password);
  }, [usuario, setValue]);

  const onSubmit = (data) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas guardar los cambios?");
    if (confirmar) {
      setUsuario(data);
      alert("¡Datos actualizados con éxito!");
    }
  };

  return (
    <div className="page-container-modificar-cuenta">
      <section className="seccion-formulario-modificar-cuenta">
        <h2>Modificacion de la cuenta</h2>
        <div className="cont-form-mod">

        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="div-label-input-modificar-cuenta">
            <RegistroForm label='Nombre'>

            </RegistroForm>
          </div>
          {errors.nombreCuenta && <p>{errors.nombreCuenta.message}</p>}

          <div className="div-label-input-modificar-cuenta">
          <RegistroForm label='email'>

            </RegistroForm>
          </div>
          {errors.email && <p>{errors.email.message}</p>}

          <div className="div-label-input-modificar-cuenta">
          <RegistroForm label='contraseña'>

          </RegistroForm>
          </div>
          {errors.password && <p>{errors.password.message}</p>}

          <div className="div-label-input-modificar-cuenta">
          <RegistroForm label='Confirmar contraseña'>

          </RegistroForm>
          </div>
          <div className="div-label-input-modificar-cuenta">
            <BotonForm className='ddddddd' texto= 'Volver'type="submit"></BotonForm>
            <BotonForm texto= 'Confirmar'type="submit"></BotonForm>
          </div>
        </form>
        </div>

      </section>
    </div>
  );
};

export default ModificarCuenta;
