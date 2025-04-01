import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/SideBar';
import Footer from './components/Footer';
import Login from './pages/login';
import Inscripciones from './pages/Inscripciones';
import Eventos from './pages/Eventos';
import Home from './pages/Home';
import './styles/App.css';
import ProtectedRoute from './context/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import Configuracion from './pages/Configuracion';

import Logout from './pages/logout'
import CrearUE from './pages/CrearUE'; {/* AGREGUE YO*/}

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
                                <Route path="/inscripciones" element={<Inscripciones />} />
                                <Route path='/Eventos' element={<Eventos />}/>
                                <Route path='/logout' element={<Logout />}/>
                                {/* Ruta de acceso denegado (opcional) 
                                <Route path="/no-autorizado" element={<NoAutorizado />} />*/}

                                {/* RUTA PROTEGIDA: solo admin */}
                                <Route path="/crear-ue" element={<CrearUE />} /> {/* AGREGUE YO*/}
                                <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
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
