import React, { useState } from 'react';
import Caja from '../components/Caja';
import '../styles/login.css';

import FormGeneral from '../components/formularios/formGeneral';
import RoleTabs from '../components/RoleTabs';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';


const Login = () => {
    //Esto es para ver qué tipo de rol está activo (según RoleTabs) y mostrar formulario que le corresponde
    const [rolActivo, setRolActivo] = useState('administrador');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const roles = [
        { clave: 'tutor', nombre: 'Tutor' },
        { clave: 'director', nombre: 'Director' },
        { clave: 'docentes', nombre: 'Docentes' },
        { clave: 'administrador', nombre: 'Administradores' },
        { clave: 'cajas', nombre: 'Cajas' },
        { clave: 'inscripciones', nombre: 'Adm. de inscripción' },
        { clave: 'organizadores', nombre: 'Organizadores' }
    ];

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
        switch (rolActivo) {
            case 'administrador':
                return (
                    <form className="formulario-login" onSubmit={handleLogin}>
                        <div>
                            <label>Usuario</label>
                            <input type="text" name="usuario" />
                        </div>
                        <div>
                            <label>Correo</label>
                            <input
                            type="email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label>Contraseña</label>
                            <input
                                type="password"
                                name="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                />
                        </div>
                        <div className="boton-login-wrapper">
                            <button type="submit">Ingresar</button>
                        </div>
                    </form>
                );
            default:
                return <FormGeneral onSubmit={() => {
                    login(rolActivo);
                    navigate('/');
                }} />;
                
        }
    };

    return (
        <div className="login-page">
            {/* Barra de roles debajo del header */}
            <div className="barra-roles-wrapper">
                <RoleTabs
                    roles={roles}
                    activeRole={rolActivo}
                    onSelect={setRolActivo}
                />
            </div>

            <div className="login-form-wrapper">
                <Caja titulo="Iniciar Sesión" width='28%'>
                    {renderContenidoPorRol()}
                </Caja>
            </div>
        </div>
    );
};

export default Login;