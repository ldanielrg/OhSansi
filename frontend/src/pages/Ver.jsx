// src/pages/Ver.jsx
import React from 'react';
import '../styles/Ver.css';

const Ver = () => {
  return (
    <div className="ver-page">
      <div className="ver-container">
        <h1>Acerca de las Olimpiadas Científicas Escolares</h1>
        <p>
          La <strong>Olimpiada Científica Escolar</strong> es una iniciativa de la 
          <strong> Universidad Mayor de San Simón (UMSS)</strong> destinada a despertar 
          y fortalecer el interés por la ciencia y la tecnología en estudiantes 
          en transición de primaria a secundaria.
        </p>
        <p>
          Aprovechamos la inclinación natural de los niños por los juegos y los retos 
          para fomentar el pensamiento científico. Así como el deporte promueve la 
          actividad física, las Olimpiadas Cientificas Escolares busca que los estudiantes descubran su pasión 
          por el conocimiento y construyan habilidades que trasciendan la competencia.
        </p>
        <h2>Áreas de competencia</h2>
        <ul>
          <li>Astronomía y Astrofísica</li>
          <li>Biología</li>
          <li>Física</li>
          <li>Informática</li>
          <li>Química</li>
          <li>Geografía</li>
          <li>Ciencias de la Vida</li>
          <li>Matemática</li>
        </ul>
        <h2>Objetivos</h2>
        <ul>
          <li>Estimular y promover el estudio de las ciencias.</li>
          <li>Desarrollar la creatividad y el pensamiento crítico.</li>
          <li>Mejorar la calidad de la educación básica con recursos elaborados por investigadores.</li>
          <li>Acercar la Universidad Mayor de San Simón a los niveles de enseñanza básica y media.</li>
          <li>Fomentar la inclusión social a través del acceso al conocimiento científico.</li>
        </ul>
      </div>
    </div>
  );
};

export default Ver;