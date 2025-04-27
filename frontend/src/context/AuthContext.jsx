import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as loginAPI, logout as logoutAPI } from './authService';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState(null); // AGREGUE YO PARA USAR EL TOKEN
    
     //Restaurar sesión desde localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRoles = localStorage.getItem('roles');
        const storedToken = localStorage.getItem('token');

        if (storedToken && storedUser && storedRoles) {
            setUser(JSON.parse(storedUser));
            setRoles(JSON.parse(storedRoles));
            setToken(storedToken); // AGREGUE YO
            api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        }
        setLoading(false);
    }, []);

    //Función para iniciar sesión
    const login = async (email, password) => {
        const res = await loginAPI(email, password);
        if (res.success) {
            setUser(res.user);
            setRoles(res.roles);
            setToken(res.access_token);
            localStorage.setItem('token', res.access_token); // GUARDAR TOKEN
            localStorage.setItem('user', JSON.stringify(res.user));
            localStorage.setItem('roles', JSON.stringify(res.roles));
            api.defaults.headers.common['Authorization'] = `Bearer ${res.access_token}`;
        }
        return res;
    };

    //Función para cerrar sesión
    const logout = async () => {
        await logoutAPI();
        setUser(null);
        setRoles([]);
        setToken(null); //AGREGUE YO
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('roles');
    };

    return (
        <AuthContext.Provider value={{ user, roles,token,login, logout, loading }}>
          {children}
        </AuthContext.Provider>
      );
    };

export const useAuth = () => useContext(AuthContext);
