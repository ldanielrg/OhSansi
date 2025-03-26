import React from 'react';
import Caja from '../components/Caja';
import '../styles/login.css';

const Login = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
            <Caja titulo="Iniciar Sesión">
                <form className="login-form">
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
            </Caja>
        </div>
    );
};

export default Login;