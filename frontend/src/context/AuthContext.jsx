import React, { createContext, useContext, useEffect, useState } from 'react';
import { login as loginAPI, logout as logoutAPI } from './authService';
import api from '../api/axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    
     //Restaurar sesión desde localStorage
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedRoles = localStorage.getItem('roles');
        const token = localStorage.getItem('token');
        if (token && storedUser && storedRoles) {
        setUser(JSON.parse(storedUser));
        setRoles(JSON.parse(storedRoles));
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);

    //Función para iniciar sesión
    const login = async (email, password) => {
        const res = await loginAPI(email, password);
        if (res.success) {
        setUser(res.user);
        setRoles(res.roles);
        }
        return res;
    };

    //Función para cerrar sesión
    const logout = async () => {
        await logoutAPI();
        setUser(null);
        setRoles([]);
    };

    return (
        <AuthContext.Provider value={{ user, roles, login, logout, loading }}>
          {children}
        </AuthContext.Provider>
      );
    };

export const useAuth = () => useContext(AuthContext);