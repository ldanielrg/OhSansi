import React from 'react';
import { useNavigate } from 'react-router-dom';
import Caja from '../components/Caja';
import '../styles/RecuperarCuenta.css';
import axios from 'axios';

const MetodoRecuperacion = () => {
    const navigate = useNavigate();

    const handleSeleccion = async (metodo) => {
        const email = localStorage.getItem('email_recuperacion');
    
        if (metodo === 'correo') {
            try {
                await axios.post('http://localhost:8000/api/auth/enviar-codigo-correo', { email });
                // Luego redirigimos
                navigate('/verificacion-correo');
            } catch (error) {
                alert('No se pudo enviar el código al correo');
            }
        } else if (metodo === 'whatsapp') {
            navigate('/verificacion-whatsapp');
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