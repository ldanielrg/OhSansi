// RecuperarCuenta.jsx
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/RecuperarCuenta.css'; // reutiliza estilos si ya están definidos
import Caja from '../components/Caja';
import { useNavigate } from 'react-router-dom';

const RecuperarCuenta = () => {
    const [email, setEmail] = useState('');
    const [mensaje, setMensaje] = useState(null);
    const navigate = useNavigate();

    const handleRecuperar = async (e) => {
        e.preventDefault();
        setMensaje(null);
    
        try {
            const response = await axios.post('http://localhost:8000/api/auth/enviar-codigo', {
                email
            });
            localStorage.setItem('email_recuperacion', email); // para usar en pasos siguientes
            navigate('/metodo-recuperacion');
        } catch (error) {
            setMensaje("No se pudo enviar el código. Verifica tu correo.");
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