// App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home'
import Inscripciones from './pages/Inscripciones'
import Eventos from './pages/Eventos'
import Nosotros from './pages/Nosotros'
import Reclamos from './pages/Reclamos'
import Login from './pages/login'
import 'bootstrap/dist/css/bootstrap.min.css';
import Ver from './pages/Ver'
import Disciplinas from './pages/Disciplinas'
import Ganadores from './pages/Ganadores'
import Premiacion from './pages/Premiacion'

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
        path="/ver"
        element={
          <Layout>
            <Ver />
          </Layout>
        }
      />
      <Route
        path="/disciplinas"
        element={
          <Layout>
            <Disciplinas />
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
        path="/ganadores"
        element={
          <Layout>
            <Ganadores />
          </Layout>
        }
      /><Route
      path="/premiacion"
      element={
        <Layout>
          <Premiacion />
        </Layout>
      }
    />
      <Route
        path="/reclamos"
        element={
          <Layout>
            <Reclamos />
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
      <Route
        path="/nosotros"
        element={
          <Layout>
            <Nosotros />
          </Layout>
        }
      />
      {/* Podrías agregar más rutas si lo requieres */}
    </Routes>
  )
}

export default App
