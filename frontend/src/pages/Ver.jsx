import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { BallTriangle } from "react-loader-spinner";
import { FaSearch } from "react-icons/fa";
import "../styles/Ver.css";
import { toast } from "react-toastify";

const Ver = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [expandedIds, setExpandedIds] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    setCargando(true);
    api
      .get("/convocatorias")
      .then(({ data }) => setConvocatorias(data))
      .catch((err) => {
        console.error(err);
        toast.error("Error cargando convocatorias.");
      })
      .finally(() => setCargando(false));
  }, []);

  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const convocatoriasFiltradas = convocatorias.filter((conv) =>
    conv.nombre_convocatoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  if (cargando) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "60vh",
      }}
    >
      <BallTriangle
        height={100}
        width={100}
        radius={5}
        color="#003366"
        ariaLabel="loading"
        visible={true}
      />
    </div>
  );
}

  return (
  <div className="inscritos-page">
    <div className="inscritos-container">
      <h2 className="inscritos-header">Olimpiadas Científicas Escolares</h2>

      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar convocatoria por nombre..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value.slice(0, 70))}
        />
      </div>

      {convocatoriasFiltradas.length === 0 && !cargando && (
        <p className="sin-resultados">No se encontraron convocatorias.</p>
      )}

      <div className="cards-grid">
        {convocatoriasFiltradas.map((conv) => (
          <div key={conv.id_convocatoria} className="card-ver">
            <h3 className="card-nombre">{conv.nombre_convocatoria}</h3>

            {cargando ? (
              <div className="card-loader">
                <BallTriangle
                  height={60}
                  width={60}
                  radius={5}
                  color="#003366"
                  ariaLabel="loading"
                  visible={true}
                />
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  </div>
);

};

export default Ver;
