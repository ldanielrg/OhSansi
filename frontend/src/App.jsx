import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/SideBar';
import Footer from './components/Footer';
import Caja from './components/Caja'; // Importación del componente Caja
import Inscripciones from './pages/Inscripciones';
import Eventos from './pages/Eventos';

import Home from './pages/Home';
import './styles/App.css';

function App() {
    return (
        <Router>
            <div className="app-container">
                <Header />
                <div className="content">
                    <Sidebar />
                    <main>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/inscripciones" element={<Inscripciones />} />
                            <Route path='/Eventos' element={<Eventos />}/>
                        </Routes>
                    </main>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
