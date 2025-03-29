import React, { useState } from 'react';
import Caja from '../components/Caja';
import '../styles/login.css';

import FormGeneral from '../components/formularios/formGeneral';
import RoleTabs from '../components/RoleTabs';

const Login = () => {

    //Esto es para ver qué tipo de rol está activo y mostrar formulario que le corresponde
    const [rolActivo, setRolActivo] = useState('administrador');
    const roles = [
        { clave: 'tutor', nombre: 'Tutor' },
        { clave: 'director', nombre: 'Director' },
        { clave: 'docentes', nombre: 'Docentes' },
        { clave: 'administrador', nombre: 'Administradores' },
        { clave: 'cajas', nombre: 'Cajas' },
        { clave: 'inscripciones', nombre: 'Adm. de inscripción' },
        { clave: 'organizadores', nombre: 'Organizadores' }
    ];
    const renderContenidoPorRol = () => {
        switch (rolActivo) {
            case 'administrador':
                return <form className="login-form">
                <div>
                    <label>Usuario</label>
                    <input type="text" name="usuario" />
                </div>
                <div>
                    <label>Correo</label>
                    <input type="email" name="correo" />
                </div>
                <div>
                    <label>Contraseña</label>
                    <input type="password" name="password" />
                </div>
                <button type="submit">Ingresar</button>
            </form>
            default:
                return <FormGeneral />;
                
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px' }}>
            <RoleTabs
                roles={roles}
                activeRole={rolActivo}
                onSelect={setRolActivo}
            />

            {/* Contenido principal */}
            <Caja titulo="Iniciar Sesión">
                {renderContenidoPorRol()}
            </Caja>
        </div>
    );
};

export default Login;