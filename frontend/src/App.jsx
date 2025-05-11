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
import Logout from "./pages/Logout2";
import CrearUE from "./pages/CrearUE";
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
import ModificarCuenta from "./pages/ModificarCuenta";
import Formulario from './pages/Formulario'; //
import CamposModificarCuenta from './pages/CamposModificarCuenta'; //
import ConfiguracionCuentas from './pages/ConfiguracionCuentas';
import OrdenDePago from './pages/OrdenDePago';
import ElegirConvocatoria from "./pages/ElegirConvocatoria";
import GestionarConvocatoria from "./pages/GestionarConvocatoria";

function App() {
  return (
    <AuthProvider>
    <Routes>
      <Route path="/" element={<Layout><Home /></Layout>}/>
      
      <Route path="/ver" element={<Layout><Ver /></Layout>}/>
      <Route path="/disciplinas" element={<Layout><Disciplinas /></Layout>}/>

      //Eventos
      <Route path="/eventos" element={<Layout><Eventos /></Layout>}/>
      <Route path="/crear-evento" element={<Layout><CrearEvento /></Layout>}/>
      <Route path="/editar-evento/:id" element={ <Layout><EditarEvento /></Layout>}/>
    
     
      <Route path="/ganadores" element={<Layout><Ganadores /></Layout>}/>
      <Route path="/premiacion" element={<Layout><Premiacion /></Layout>}/>
      <Route path="/proximoseventos" element={<Layout><ProximosEventos /></Layout>}/>
      <Route path="/contactanos" element={<Layout><Contactanos /></Layout>} />
      <Route path="/preguntasfrecuentes" element={ <Layout><PreguntasFrecuentes /></Layout>}/>
      <Route path="/reclamos" element={<Layout><Reclamos /></Layout>}/>
      
      
      <Route path="/editar-configuracion-convocatoria" element={<Layout><EditarConfigurarConvocatoria /></Layout>}/>
      <Route path="/nosotros" element={<Layout><Nosotros /></Layout>}/>
      <Route path="/login" element={<Layout><Login /></Layout>}/>
      <Route path="/logout" element={<Layout><Logout /></Layout>}/>
      <Route path="/modificar-cuenta" element={<Layout><ModificarCuenta /></Layout>}/>
      <Route path="/formulario/:id" element={<Layout><Formulario /></Layout>} /> 
      <Route path="/modificar-campos" element={<Layout><CamposModificarCuenta /></Layout>} />
      <Route path="/orden-de-pago/:id" element={<Layout><OrdenDePago /></Layout>} />
      <Route path="/elegir-convocatoria" element={<Layout><ElegirConvocatoria /></Layout>} />

      

     
      <Route path="/configuracion-cuentas" element={<Layout><ConfiguracionCuentas /></Layout>}/>
      

      {/* Rutas protegidas solo para Admin/Director/Adm.Inscripción */}
      <Route element={<ProtectedRoute allowedRoles={['Admin', 'Director', 'Adm. Inscripcion']} />}>
          <Route path="/crear-cuentas" element={<Layout><CrearCuentas /></Layout>} />
          <Route path="/inscripciones" element={<Layout><Inscripciones /></Layout>}/> 
          <Route path="/crear-ue" element={<Layout><CrearUE /></Layout>}/>
          <Route path="/crear-configuracion-convocatoria" element={<Layout><CrearConfigurarConvocatoria /></Layout>}/>
          <Route path="/editar-configuracion-convocatoria/:id" element={<Layout><EditarConfigurarConvocatoria /></Layout>}/>
          <Route path="/configuracion-convocatoria" element={<Layout><ConfiguracionConvocatoria/></Layout>}/>
          <Route path="/configuracion-convocatoria/gestionar/:id_convocatoria" element={<Layout><GestionarConvocatoria/></Layout>}/>
      </Route>
    </Routes>
    </AuthProvider>
  );
}

export default App;