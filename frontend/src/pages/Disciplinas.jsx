// src/pages/Disciplinas.jsx
import React from "react";
import Card from "../components/Card";
import "../styles/Disciplinas.css";

const disciplinas = [
  { id: 1, title: "Astronomía", img: "/images/astronomia.jpg" },
  { id: 2, title: "Biología", img: "/images/biologia.jpg" },
  { id: 3, title: "Física", img: "/images/fisica.jpg" },
  { id: 4, title: "Informática", img: "/images/informatica.jpg" },
  { id: 5, title: "Química", img: "/images/quimica.jpg" },
  { id: 6, title: "Geografía", img: "/images/geografia.jpg" },
  { id: 7, title: "Ciencias de la Vida", img: "/images/cienciasvida.jpg" },
  { id: 8, title: "Matemática", img: "/images/matematica.jpg" },
];

const Disciplinas = () => {
  return (
    <div className="disciplinas-page">
      <h1 className="disciplinas-title">Olimpiadas Científicas Escolares</h1>
      <div className="row row-cols-1 row-cols-md-3 g-4">
        <div className="col-md-4">
          <Card
            image="/src/assets/hd/fondofisica.jpg"
            description=""
            buttonText="Física"
            buttonIcon={
              <img
                src="/src/assets/hd/fisica.png"
                alt="icon"
                className="btn-icon"
              />
            }
          />
        </div>
        <div className="col-md-4">
          <Card
            image="/src/assets/hd/fondobiologia.jpg"
            description=""
            buttonText="Biología"
            buttonIcon={
              <img
                src="/src/assets/hd/Biologia.png"
                alt="icon"
                className="btn-icon"
              />
            }
          />
        </div>
        <div className="col-md-4">
          <Card
            image="/src/assets/hd/fondomatematica.jpg"
            description=""
            buttonText="Matemática"
            buttonIcon={
              <img
                src="/src/assets/hd/matematica.png"
                alt="icon"
                className="btn-icon"
              />
            }
          />
        </div>
        <div className="col-md-4">
          <Card
            image="/src/assets/hd/fondoquimica.jpg"
            description=""
            buttonText="Química"
            buttonIcon={
              <img
                src="/src/assets/hd/Quimica.png"
                alt="icon"
                className="btn-icon"
              />
            }
          />
        </div>
        <div className="col-md-4">
          <Card
            image="/src/assets/hd/fondoinformatica.jpg"
            description=""
            buttonText="Informática"
            buttonIcon={
              <img
                src="/src/assets/hd/informatica.png"
                alt="icon"
                className="btn-icon"
              />
            }
          />
        </div>
        <div className="col-md-4">
          <Card
            image="/src/assets/hd/fondoastrofis.jpg"
            description=""
            buttonText="Astronomía y Astrofísica"
            buttonIcon={
              <img
                src="/src/assets/hd/astro.png"
                alt="icon"
                className="btn-icon"
              />
            }
          />
        </div>
        <div className="col-md-4">
          <Card
            image="/src/assets/hd/fondogeografia.jpg"
            description=""
            buttonText="Geografía"
            buttonIcon={
              <img
                src="/src/assets/hd/geografia.png"
                alt="icon"
                className="btn-icon"
              />
            }
          />
        </div>
        <div className="col-md-4">
          <Card
            image="/src/assets/hd/fondoambiente.jpg"
            description=""
            buttonText="Medio Ambiente"
            buttonIcon={
              <img
                src="/src/assets/hd/ambiente.png"
                alt="icon"
                className="btn-icon"
              />
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Disciplinas;
