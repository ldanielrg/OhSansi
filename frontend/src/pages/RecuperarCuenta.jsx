// RecuperarCuenta.jsx
import React, { useState } from 'react';
import '../styles/RecuperarCuenta.css'; // reutiliza estilos si ya están definidos
import Caja from '../components/Caja';
import { useNavigate } from 'react-router-dom';

const RecuperarCuenta = () => {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState(null);
    const navigate = useNavigate();

    const handleRecuperar = async (e) => {
        e.preventDefault();

        // Aquí deberías hacer una llamada a tu backend para iniciar el proceso de recuperación
        // Por ahora simulamos la acción

        if (email) {
            // Simula verificación de correo y redirige
            navigate('/metodo-recuperacion');
        } else {
            setMensaje("Por favor ingresa un correo válido.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-wrapper">
                <Caja titulo="Recuperación de cuenta" width='28%'>
                    <form className="formulario-login" onSubmit={handleRecuperar}>
                        <div>
                            <p>Ingresa tu correo electrónico para recuperar tu cuenta</p>
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="boton-login-wrapper">
                            <button type="submit">Continuar</button>
                        </div>
                    </form>
                    {mensaje && <p className="mensaje-recuperacion">{mensaje}</p>}
                </Caja>
            </div>
        </div>
    );
};

export default RecuperarCuenta;