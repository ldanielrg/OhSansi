import React, { useState, useEffect } from "react";
import api from "../api/axios";
import DataTable from "react-data-table-component";
import { BallTriangle } from "react-loader-spinner";
import "../styles/InscritosOficiales.css";

const Disciplinas = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [idConv, setIdConv] = useState("");
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    api.get("/convocatorias")
      .then((res) => setConvocatorias(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!idConv) {
      setData([]);
      return;
    }

    setCargando(true);
    api.get(`/disciplinas/${idConv}`) // Ajusta el endpoint según tu API
      .then((res) => {
        setData(res.data || []);
      })
      .catch((err) => {
        console.error(err);
        setData([]);
      })
      .finally(() => setCargando(false));
  }, [idConv]);

  const columns = [
    { name: "Área", selector: (row) => row.area, sortable: true },
    { name: "Categoría", selector: (row) => row.categoria, sortable: true },
    { name: "Grados", selector: (row) => row.grados, sortable: true },
    { name: "Participantes", selector: (row) => row.participantes, sortable: true },
    { name: "Precio", selector: (row) => row.precio, sortable: true, right: true },
  ];

  return (
    <div className="inscritos-page">
      <div className="inscritos-container">
        <h2 className="inscritos-header">Disciplinas por Convocatoria</h2>

        <div className="selector-conv">
          <select
            className="form-select"
            value={idConv}
            onChange={(e) => setIdConv(e.target.value)}
          >
            <option value="">-- Selecciona convocatoria --</option>
            {convocatorias.map((c) => (
              <option key={c.id_convocatoria} value={c.id_convocatoria}>
                {c.nombre_convocatoria}
              </option>
            ))}
          </select>
        </div>

        {cargando ? (
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
              ariaLabel="ball-triangle-loading"
              visible={true}
            />
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
