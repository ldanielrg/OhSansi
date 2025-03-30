// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [rol, setRol] = useState(null); // 'administrador', 'tutor', etc.

    const login = (rolSeleccionado) => {
        setIsAuthenticated(true);
        setRol(rolSeleccionado);
    };

    const logout = () => {
        setIsAuthenticated(false);
        setRol(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, rol, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
