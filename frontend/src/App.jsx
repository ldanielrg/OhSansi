// App.jsx
import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/login'
import Layout from './components/Layout'

function App() {
  return (
    <Routes>
      {/* Ruta Home ("/") envuelta en Layout */}
      <Route
        path="/"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      {/* Ruta Login ("/login") también con Layout */}
      <Route
        path="/login"
        element={
          <Layout>
            <Login />
          </Layout>
        }
      />
    </Routes>
  )
}

export default App
