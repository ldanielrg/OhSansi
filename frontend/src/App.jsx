// App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Inscripciones from './pages/Inscripciones'
import Eventos from './pages/Eventos'
import Nosotros from './pages/Nosotros'
import Login from './pages/Login'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />
      <Route
        path="/inscripciones"
        element={
          <Layout>
            <Inscripciones />
          </Layout>
        }
      />
      <Route
        path="/eventos"
        element={
          <Layout>
            <Eventos />
          </Layout>
        }
      />
      <Route
        path="/nosotros"
        element={
          <Layout>
            <Nosotros />
          </Layout>
        }
      />
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
      {/* Podrías agregar más rutas si lo requieres */}
    </Routes>
  )
}

export default App
