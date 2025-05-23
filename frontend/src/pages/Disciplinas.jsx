import React, { useState, useEffect } from "react";
import api from "../api/axios";
import DataTable from "react-data-table-component";
import { BallTriangle } from "react-loader-spinner";
import "../styles/InscritosOficiales.css";

const Disciplinas = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [idConv, setIdConv] = useState("");
  const [data, setData] = useState([]);
  const [cargandoConv, setCargandoConv] = useState(true);
  const [cargandoDatos, setCargandoDatos] = useState(false);

  useEffect(() => {
    setCargandoConv(true);
    api.get("/convocatorias")
      .then(res => setConvocatorias(res.data))
      .catch(console.error)
      .finally(() => setCargandoConv(false));
  }, []);

  useEffect(() => {
    if (!idConv) {
      setData([]);
      return;
    }
    setCargandoDatos(true);

    // Obtenemos asignaciones con grados y precio desde backend
    api.get(`/areas-categorias-grados/${idConv}`)
      .then(res => {
        // El endpoint debería devolver algo como:
        // [ { id_area, nombre_area, categorias: [ { id_categoria, nombre_categoria, grados: [ {grado_inicial_nombre, grado_final_nombre}], precio, participantes } ] } ]
        const asignaciones = res.data || [];

        // Convertimos datos en arreglo plano para DataTable
        const dataArray = [];
        asignaciones.forEach(area => {
          (area.categorias || []).forEach(cat => {
            const gradosStr = (cat.grados || [])
              .map(g => g.grado_final_nombre && g.grado_final_nombre !== g.grado_inicial_nombre
                ? `${g.grado_inicial_nombre} – ${g.grado_final_nombre}`
                : g.grado_inicial_nombre)
              .join(", ");

            dataArray.push({
              area: area.nombre_area,
              categoria: cat.nombre_categoria,
              grados: gradosStr,
              participantes: cat.participantes || "Pendiente",
              precio: cat.precio != null ? `$${cat.precio}` : "Pendiente",
            });
          });
        });

        setData(dataArray);
      })
      .catch(err => {
        console.error(err);
        setData([]);
      })
      .finally(() => setCargandoDatos(false));
  }, [idConv]);

  const columns = [
    { name: "Área", selector: row => row.area, sortable: true },
    { name: "Categoría", selector: row => row.categoria, sortable: true },
    { name: "Grados", selector: row => row.grados, sortable: false },
    { name: "Participantes", selector: row => row.participantes, sortable: true },
    { name: "Precio", selector: row => row.precio, sortable: true, right: true },
  ];

  if (cargandoConv) {
    return (
      <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "100vh"}}>
        <BallTriangle height={100} width={100} radius={5} color="#003366" ariaLabel="loading" visible={true} />
      </div>
    );
  }

  return (
    <div className="inscritos-page">
      <div className="inscritos-container">
        <h2 className="inscritos-header">Disciplinas por Convocatoria</h2>

        <div className="selector-conv">
          <select
            className="form-select"
            value={idConv}
            onChange={e => setIdConv(e.target.value)}
          >
            <option value="">-- Selecciona convocatoria --</option>
            {convocatorias.map(c => (
              <option key={c.id_convocatoria} value={c.id_convocatoria}>
                {c.nombre_convocatoria}
              </option>
            ))}
          </select>
        </div>

        {cargandoDatos ? (
          <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "60vh"}}>
            <BallTriangle height={100} width={100} radius={5} color="#003366" ariaLabel="loading" visible={true} />
          </div>
        ) : (
          <DataTable
            className="tabla-inscritos"
            columns={columns}
            data={data}
            pagination
            paginationRowsPerPageOptions={[10, 25, 50]}
            highlightOnHover
            pointerOnHover
            persistTableHead
            noDataComponent="No hay datos para mostrar"
          />
        )}
      </div>
    </div>
  );
};

export default Disciplinas;
