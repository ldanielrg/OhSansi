import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header";
import Sidebar from "./components/SideBar";
import Footer from "./components/Footer";
import Login from "./pages/login";

//Importaciones para recuperar cuenta
import RecuperarCuenta from './pages/RecuperarCuenta'; // Ajusta según tu estructura
import MetodoRecuperacion from "./pages/MetodoRecuperacion"; // Ajusta según tu estructura
import VerificacionCorreo from "./pages/VerificacionCorreo"; // Ajusta según tu estructura
import VerificacionWhatsapp from "./pages/VerificacionWhatsapp"; // Ajusta según tu estructura
import RestablecerContrasena from './pages/RestablecerContrasena'; // Ajusta según tu estructura
import RecuperacionExitosa from './pages/RecuperacionExitosa'; // Ajusta según tu estructura

import Inscripciones from "./pages/Inscripciones";
import Eventos from "./pages/Eventos";
import Home from "./pages/Home";
import "./styles/App.css";
import ProtectedRoute from "./context/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import CrearEvento from "./components/CrearEvento";
import EditarEvento from "./components/EditarEvento";
import VerEvento from "./components/VerEvento";

import Logout from './pages/logout'
import CrearUE from './pages/CrearUE'; {/* AGREGUE YO*/}
import Configuracion from "./pages/Configuracion";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <div className="content">
            <Sidebar />
            <main>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />

                {/* Rutas de recuperar contraseña */}
                <Route path="/recuperar-contraseña" element={<RecuperarCuenta />} />
                <Route path="/metodo-recuperacion" element={<MetodoRecuperacion />} />
                <Route path="/verificacion-correo" element={<VerificacionCorreo />} />
                <Route path="/verificacion-whatsapp" element={<VerificacionWhatsapp />} />
                <Route path="/restablecer-contrasena" element={<RestablecerContrasena />} />
                <Route path="/recuperacion-exitosa" element={<RecuperacionExitosa />} />

                <Route path="/inscripciones" element={<Inscripciones />} />
                <Route path="/Eventos" element={<Eventos />} />
                <Route path="/crear-evento" element={<CrearEvento />} />
                <Route path="/editar-evento/:id" element={<EditarEvento />} />
                <Route path="/ver-evento/:id" element={<VerEvento />} />
                <Route path="/crear-ue" element={<CrearUE />} /> {/* AGREGUE YO*/}
                <Route path="/logout" element={<Logout />} />
                {/* Ruta de acceso denegado (opcional) 
                                <Route path="/no-autorizado" element={<NoAutorizado />} />*/}

                {/* RUTA PROTEGIDA: solo admin */}
                
                <Route element={<ProtectedRoute allowedRoles={["Admin"]} />}>
                  <Route path="/configuracion" element={<Configuracion />} />
                </Route>
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
export default App;
