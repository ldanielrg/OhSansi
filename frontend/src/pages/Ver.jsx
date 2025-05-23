import React, { useState, useEffect } from "react";
import api from "../api/axios"; // asumo que usas axios configurado
import { toast } from "react-toastify";
import "../styles/Ver.css"; // luego agregamos este CSS

const Ver = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [expandedIds, setExpandedIds] = useState([]); // IDs convocatorias desplegadas

  useEffect(() => {
    const cargarConvocatorias = async () => {
      try {
        const { data } = await api.get("/convocatorias"); // endpoint para listar convocatorias
        setConvocatorias(data);
      } catch (error) {
        toast.error("Error cargando convocatorias.");
        console.error(error);
      }
    };
    cargarConvocatorias();
  }, []);

  // Filtrar convocatorias según texto búsqueda (case insensitive)
  const convocatoriasFiltradas = convocatorias.filter((conv) =>
    conv.nombre_convocatoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  // Toggle para expandir/contraer detalles
  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  return (
    <div className="ver-page container">
      <h2 className="ver-title">Olimpiadas Científicas Escolares</h2>

      <input
        type="text"
        placeholder="Buscar convocatoria por nombre..."
        className="buscador-convocatoria"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      <div className="cards-grid">
        {convocatoriasFiltradas.length === 0 && (
          <p className="sin-resultados">No se encontraron convocatorias.</p>
        )}

        {convocatoriasFiltradas.map((conv) => (
          <div key={conv.id_convocatoria} className="card-ver">
            <h3 className="card-nombre">{conv.nombre_convocatoria}</h3>
            <button
              className="btn-ver-mas"
              onClick={() => toggleExpand(conv.id_convocatoria)}
            >
              {expandedIds.includes(conv.id_convocatoria)
                ? "Ver menos"
                : "Ver más"}
            </button>

            {expandedIds.includes(conv.id_convocatoria) && (
              <div className="card-detalles">
                <p className="descripcion">{conv.descripcion}</p>
                <p>
                  <strong>Fecha inicio:</strong>{" "}
                  {conv.fecha_inicio?.split("T")[0] || "Sin fecha"}
                </p>
                <p>
                  <strong>Fecha fin:</strong>{" "}
                  {conv.fecha_final?.split("T")[0] || "Sin fecha"}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ver;
