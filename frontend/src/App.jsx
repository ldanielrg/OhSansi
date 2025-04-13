// App.jsx
import React from 'react';
import Layout from './Layout';
import './App.css'; // Si requieres estilos globales

function App() {
  return (
    <Layout>
      {/* Contenido de la página Home */}
      <section className="home-content">
        <h1>Bienvenido a la Página de Inicio</h1>
        <p>Aquí colocas todo el contenido que deseas mostrar en la Home.</p>
        {/* Agrega aquí el resto de elementos específicos de la Home */}
      </section>
    </Layout>
  );
}

export default App;
