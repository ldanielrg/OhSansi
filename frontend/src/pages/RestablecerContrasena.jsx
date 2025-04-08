import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Caja from '../components/Caja';
import '../styles/login.css';

const RestablecerContrasena = () => {
    const [nuevaContrasena, setNuevaContrasena] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const navigate = useNavigate();

    const handleActualizar = async (e) => {
        e.preventDefault();
        const email = localStorage.getItem('email_recuperacion');
    
        if (nuevaContrasena.length < 8) {
            alert("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
    
        if (nuevaContrasena !== confirmarContrasena) {
            alert("Las contraseñas no coinciden.");
            return;
        }
    
        try {
            await axios.post('http://localhost:8000/api/auth/restablecer-contrasena', {
                email,
                code: '', // puedes guardar también el código si quieres validarlo aquí
                password: nuevaContrasena,
                password_confirmation: confirmarContrasena
            });
    
            localStorage.removeItem('email_recuperacion');
            navigate('/recuperacion-exitosa');
        } catch (error) {
            alert("No se pudo actualizar la contraseña.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-wrapper">
                <Caja titulo="Restablecer contraseña" width='28%'>
                    <p>Crea una nueva contraseña para tu cuenta</p>
                    <form onSubmit={handleActualizar}>
                        <div>
                            <label>Nueva contraseña</label>
                            <input
                                type="password"
                                value={nuevaContrasena}
                                onChange={(e) => setNuevaContrasena(e.target.value)}
                                required
                            />
                            <small>La contraseña debe tener al menos 8 caracteres</small>
                        </div>

                        <div>
                            <label>Confirmar contraseña</label>
                            <input
                                type="password"
                                value={confirmarContrasena}
                                onChange={(e) => setConfirmarContrasena(e.target.value)}
                                required
                            />
                        </div>

                        <div className="boton-login-wrapper">
                            <button type="submit">Actualizar contraseña</button>
                            <button type="button" onClick={() => navigate('/verificacion-correo')}>Volver</button>
                        </div>
                    </form>
                </Caja>
            </div>
        </div>
    );
};

export default RestablecerContrasena;