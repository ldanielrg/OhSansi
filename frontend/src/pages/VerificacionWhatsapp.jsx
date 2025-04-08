import React, { useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Caja from '../components/Caja';
import '../styles/RecuperarCuenta.css';

const VerificacionWhatsapp = () => {
    const [codigo, setCodigo] = useState(['', '', '', '', '', '']);
    const inputsRef = useRef([]);
    const navigate = useNavigate();

    const handleChange = (index, value) => {
        if (/^\d?$/.test(value)) {
            const nuevoCodigo = [...codigo];
            nuevoCodigo[index] = value;
            setCodigo(nuevoCodigo);

            // Ir al siguiente campo si no es el último
            if (value && index < 5) {
                inputsRef.current[index + 1].focus();
            }
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (codigo[index] === '' && index > 0) {
                inputsRef.current[index - 1].focus();
            }
        }
    };

    const handleVerificar = async () => {
        const codigoIngresado = codigo.join('');
        const email = localStorage.getItem('email_recuperacion');
    
        if (codigoIngresado.length !== 6) {
            alert("Por favor ingresa los 6 dígitos del código");
            return;
        }
    
        try {
            const response = await axios.post('http://localhost:8000/api/auth/verificar-codigo', {
                email,
                code: codigoIngresado
            });
            navigate('/restablecer-contrasena');
        } catch (error) {
            alert("Código inválido o expirado.");
        }
    };

    return (
        <div className="login-page">
            <div className="login-form-wrapper">
                <Caja titulo="Verificación de código" width='28%'>
                    <p>Hemos enviado un código de 6 dígitos a tu whatsapp<br /><strong>+591 ******12</strong></p>

                    <div className="codigo-inputs">
                        {codigo.map((num, i) => (
                            <input
                                key={i}
                                type="text"
                                maxLength={1}
                                value={num}
                                ref={(el) => (inputsRef.current[i] = el)}
                                onChange={(e) => handleChange(i, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(e, i)}
                                className="codigo-input"
                            />
                        ))}
                    </div>

                    <p style={{ marginTop: '10px' }}>¿No recibiste el código? <a href="#">Reenviar</a></p>

                    <div className="boton-login-wrapper">
                        <button onClick={handleVerificar}>Verificar código</button>
                        <button onClick={() => navigate('/metodo-recuperacion')}>Volver</button>
                    </div>
                </Caja>
            </div>
        </div>
    );
};

export default VerificacionWhatsapp;