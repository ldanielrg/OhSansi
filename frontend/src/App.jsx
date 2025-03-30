import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/SideBar';
import Footer from './components/Footer';
import Login from './pages/login';
import Home from './pages/Home';
import './styles/App.css';


import { AuthProvider } from './context/AuthContext';

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
