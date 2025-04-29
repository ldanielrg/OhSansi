import React, { useState } from 'react';
import Caja from '../components/Caja';
import '../styles/login.css';

import FormGeneral from '../components/formularios/FormGeneral';
import RoleTabs from '../components/RoleTabs';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RegistroForm from '../components/RegistroForm';
import { MdEmail } from "react-icons/md";
import { GiPadlock } from "react-icons/gi";

const Login2 = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        const res = await login(email, password);
        if (res.success) {
          alert('Bienvenido');
          navigate('/');
        } else {
          alert(res.message);
        }
    };


    const renderContenidoPorRol = () => {
        
                return (
                    <form className="formulario-login" onSubmit={handleLogin}>
                        <div>
                            <RegistroForm
                                label='Correo'
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                icono={MdEmail}
                                usarEvento={true}
                            />
                        </div>
                        <div>
                            <RegistroForm
                                label='Contraseña'
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                icono={GiPadlock}
                                usarEvento={true}
                                />
                        </div>
                        <div className="boton-login-wrapper">
                            <button type="submit">Ingresar</button>
                        </div>
                    </form>
                );
    };

    return (
        <div className="login-page">
            <div className="login-form-wrapper">
                <Caja titulo="Iniciar Sesión" width='28%'>
                    {renderContenidoPorRol()}
                </Caja>
            </div>
        </div>
    );
};

export default Login2;