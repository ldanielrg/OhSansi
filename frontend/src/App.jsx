// App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';    // Tu Layout con la barra de navegación, etc.
import Home from './pages/Home';        // Tu página de inicio
import Login from './pages/Login';      // Página de login (todavía por hacer)
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      {/* Ruta para la Home, usando Layout y Home como children */}
      <Route 
        path="/" 
        element={
          <Layout>
            <Home />
          </Layout>
        } 
      />
      
      {/* Ruta para la página de Login, también con Layout */}
      <Route 
        path="/login" 
        element={
          <Layout>
            <Login />
          </Layout>
        } 
      />
    </Routes>
  );
}

export default App;
