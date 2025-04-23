import React from "react";
import { useForm } from "react-hook-form";
import '../styles/ModificarCuenta.css';

const ModificarCuenta = () => {
    const {
    register,
    handleSubmit,
    formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        console.log("Datos del formulario:", data);
        // Aquí puedes hacer la lógica para actualizar los datos
    };

    return (
        <div className="page-container-modificar-cuenta">
        <section className="seccion-formulario-modificar-cuenta">
            <h2>Configuracion de cuenta</h2>
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
        </section>
        </div>
    );
};

export default ModificarCuenta;
