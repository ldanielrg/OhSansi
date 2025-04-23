import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import '../styles/ModificarCuenta.css';

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
        <h2>Configuración de cuenta</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="div-label-input-modificar-cuenta">
            <label>Nombre de cuenta</label>
            <input
              type="text"
              {...register("nombreCuenta", {
                required: "Este campo es obligatorio",
              })}
            />
          </div>
          {errors.nombreCuenta && <p>{errors.nombreCuenta.message}</p>}

          <div className="div-label-input-modificar-cuenta">
            <label>Email</label>
            <input
              type="email"
              {...register("email", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Correo inválido",
                },
              })}
            />
          </div>
          {errors.email && <p>{errors.email.message}</p>}

          <div className="div-label-input-modificar-cuenta">
            <label>Contraseña</label>
            <input
              type="password"
              {...register("password", {
                required: "Este campo es obligatorio",
                minLength: {
                  value: 6,
                  message: "La contraseña debe tener al menos 6 caracteres",
                },
              })}
            />
          </div>
          {errors.password && <p>{errors.password.message}</p>}

          <div className="div-label-input-modificar-cuenta">
            <button type="submit">Guardar Cambios</button>
          </div>
        </form>

        <div style={{ marginTop: "2rem" }}>
          <h4>Datos actuales:</h4>
          <p><strong>Nombre:</strong> {usuario.nombreCuenta}</p>
          <p><strong>Email:</strong> {usuario.email}</p>
          <p><strong>Contraseña:</strong> {usuario.password}</p>
        </div>
      </section>
    </div>
  );
};

export default ModificarCuenta;
