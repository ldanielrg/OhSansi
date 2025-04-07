import React from 'react';
import { useNavigate } from 'react-router-dom';
import Caja from '../components/Caja';
import '../styles/RecuperarCuenta.css';

const RecuperacionExitosa = () => {
    const navigate = useNavigate();

    return (
        <div className="login-page">
            <div className="login-form-wrapper">
                <Caja titulo="¡Recuperación exitosa!" width='28%'>
                    <p style={{ color: '#999' }}>Tu contraseña ha sido actualizada correctamente</p>
                    <p><strong>Ya puedes iniciar sesión con tu nueva contraseña.</strong></p>
                    <div className="boton-login-wrapper">
                        <button onClick={() => navigate('/login')}>Ir al inicio de sesión</button>
                    </div>
                </Caja>
            </div>
        </div>
    );
};

export default RecuperacionExitosa;