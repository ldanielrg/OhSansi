// App.jsx
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Footer from "./components/Footer";
import Login from "./pages/Login2";
import Inscripciones from "./pages/Inscripciones";
import Eventos from "./pages/Eventos";
import Home from "./pages/Home";
import "./styles/App.css";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import CrearEvento from "./components/CrearEvento";
import EditarEvento from "./components/EditarEvento";
import VerEvento from "./components/VerEvento";
import Logout from './pages/Logout2'
import CrearUE from './pages/CrearUE'; {/* AGREGUE YO*/}
import CrearCuentas from "./pages/CrearCuentas";
import Layout from "./components/Layout";
import Nosotros from "./pages/Nosotros";
import Reclamos from "./pages/Reclamos";
import "bootstrap/dist/css/bootstrap.min.css";
import Ver from "./pages/Ver";
import Disciplinas from "./pages/Disciplinas";
import Ganadores from "./pages/Ganadores";
import Premiacion from "./pages/Premiacion";
import ProximosEventos from "./pages/ProximosEventos";
import Contactanos from "./pages/Contactanos";
import PreguntasFrecuentes from "./pages/PreguntasFrecuentes";
import ConfiguracionConvocatoria from "./pages/ConfigurarcionConvocatoria";
import CrearConfigurarConvocatoria from "./pages/CrearConfiguracionConvocatoria";
import EditarConfigurarConvocatoria from "./pages/EditarConfiguracionConvocatoria";

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
      />
      <Route
        path="/premiacion"
        element={
          <Layout>
            <Premiacion />
          </Layout>
        }
      />
      <Route
        path="/proximoseventos"
        element={
          <Layout>
            <ProximosEventos />
          </Layout>
        }
      />
      <Route
        path="/contactanos"
        element={
          <Layout>
            <Contactanos />
          </Layout>
        }
      />
      <Route
        path="/preguntasfrecuentes"
        element={
          <Layout>
            <PreguntasFrecuentes />
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
        path="/configuracion-convocatoria"
        element={
          <Layout>
            <ConfiguracionConvocatoria />
          </Layout>
        }
      />
      <Route
        path="/crear-configuracion-convocatoria"
        element={
          <Layout>
            <CrearConfigurarConvocatoria />
          </Layout>
        }
      />
      <Route
        path="/editar-configuracion-convocatoria"
        element={
          <Layout>
            <EditarConfigurarConvocatoria />
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
        path="/crear-evento"
        element={
          <Layout>
            <CrearEvento />
          </Layout>
        }
      />
      <Route
        path="/editar-evento"
        element={
          <Layout>
            <EditarEvento />
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
  );
}

export default App;
