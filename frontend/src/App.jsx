// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Login from "./pages/Login";

import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Routes>
      {/* Ruta para la Home, usando Layout y Home como children */}
      <Route
        path="/Home"
        element={
          <Layout>
            <Home />
          </Layout>
        }
      />

      {/* Ruta para la página de Login, también con Layout */}
      <Route
        path="/Login"
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
