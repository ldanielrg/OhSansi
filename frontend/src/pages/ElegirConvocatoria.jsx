import '../styles/ElegirConvocatoria.css';
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Caja from '../components/Caja';
import api from "../api/axios";

const ElegirConvocatoria = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const obtenerConvocatorias = async () => {
      try {
        const res = await api.get('/convocatorias'); // o '/convocatorias/activas' si filtras
        setConvocatorias(res.data.filter(c => c.activo)); // filtra solo activas si lo necesitas
      } catch (error) {
        console.error("Error al obtener convocatorias", error);
      }
    };

    obtenerConvocatorias();
  }, []);

  const seleccionarConvocatoria = (id_convocatoria) => {
    navigate(`/formulario/0?convocatoria=${id_convocatoria}`);
  };

  return (
    <div className="elegir-convocatoria-container">
      <Caja titulo="Selecciona una convocatoria">
        <ul>
          {convocatorias.map((conv) => (
            <li key={conv.id_convocatoria}>
              <button
                className="boton-convocatoria"
                onClick={() => seleccionarConvocatoria(conv.id_convocatoria)}
              >
                {conv.nombre_convocatoria} (ID: {conv.id_convocatoria})
              </button>
            </li>
          ))}
        </ul>
      </Caja>
    </div>
  );
};

export default ElegirConvocatoria;
