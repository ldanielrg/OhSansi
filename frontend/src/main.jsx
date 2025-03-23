import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App'; // Importa el componente principal
import './index.css'; // Estilos globales opcionales

// Renderiza el componente principal en el elemento con id="root"
ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
