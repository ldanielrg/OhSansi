// src/pages/Nosotros.jsx
import React from 'react';
import '../styles/Nosotros.css';

const Nosotros = () => (
  <div className="nosotros-page">
    <div className="nosotros-container">
      <h1 className="nosotros-title">Conócenos - ByteSoft</h1>
      <p className="nosotros-description">
        ByteSoft es una empresa líder en desarrollo de software dedicada a transformar ideas en soluciones digitales de alta calidad.
        Ofrecemos servicios integrales que abarcan desde aplicaciones web y móviles hasta consultoría tecnológica y mantenimiento de sistemas.
      </p>

      <h2 className="nosotros-subtitle">Nuestros servicios</h2>
      <ul className="nosotros-services">
        <li>Desarrollo de aplicaciones web</li>
        <li>Desarrollo de aplicaciones móviles</li>
        <li>Consultoría y arquitectura de software</li>
        <li>Mantenimiento y soporte técnico</li>
      </ul>

      <h2 className="nosotros-subtitle">Contáctanos</h2>
      <ul className="nosotros-info">
        <li><strong>Email:</strong> <a href="mailto:bytesoft258@gmail.com">bytesoft258@gmail.com</a></li>
        <li><strong>Teléfono:</strong> <a href="tel:+59177450520">+591 77450520</a></li>
      </ul>
    </div>
  </div>
);

export default Nosotros;
