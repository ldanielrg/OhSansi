import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Logout2 = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    const cerrarSesion = async () => {
      await logout(); // cerrar sesión
      setMensaje('Has cerrado sesión correctamente.');

      // Redirigir al login después de 2.5 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2500);
    };

    cerrarSesion();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px', fontSize: '1.2rem' }}>
      {mensaje}
    </div>
  );
};

export default Logout2;
