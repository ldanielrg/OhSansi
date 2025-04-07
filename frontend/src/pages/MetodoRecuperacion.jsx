import React from 'react';
import { useNavigate } from 'react-router-dom';
import Caja from '../components/Caja';
import '../styles/RecuperarCuenta.css';

const MetodoRecuperacion = () => {
    const navigate = useNavigate();

    const handleSeleccion = (metodo) => {
        if (metodo === 'correo') {
            navigate('/verificacion-correo'); // lleva al formulario de código
        }  else if (metodo === 'whatsapp') {
            navigate('/verificacion-whatsapp'); // lleva al formulario de código
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-wrapper">
                <Caja titulo="Método de recuperación" width='28%'>
                    <p>Selecciona cómo quieres recibir el código de verificación</p>

                    <div className="boton-login-wrapper">
                        <button onClick={() => handleSeleccion('correo')}>Correo electrónico</button>
                    </div>

                    <div className="boton-login-wrapper">
                        <button onClick={() => handleSeleccion('whatsapp')}>Whatsapp</button>
                    </div>

                    <div className="boton-login-wrapper">
                    <button className="boton-volver" onClick={() => navigate('/recuperar-contraseña')}>Volver</button>
                    </div>
                </Caja>
            </div>
        </div>
    );
};

export default MetodoRecuperacion;