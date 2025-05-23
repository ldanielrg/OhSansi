// src/pages/InscritosOficiales.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import "../styles/InscritosOficiales.css";
import { BallTriangle } from "react-loader-spinner";
const InscritosOficiales = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [idConv, setIdConv] = useState("");
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [selArea, setSelArea] = useState("");
  const [selCat, setSelCat] = useState("");
  const [selUni, setSelUni] = useState("");
  const [cargando, setCargando] = useState(false);
  const [cargandoConvocatorias, setCargandoConvocatorias] = useState(false);
  useEffect(() => {
    api
      .get("/convocatorias")
      .then((res) => setConvocatorias(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!idConv) return setRows([]);
    api
      .get(`/inscritos-oficiales/${idConv}`)
      .then((res) => {
        const flat = res.data.flatMap((stu) =>
          stu.inscripciones.map((ins) => ({
            ci: stu.ci,
            nombre: stu.nombre,
            apellido: stu.apellido,
            unidad_educativa: { nombre: stu.nombre_ue },
            area: { nombre: ins.nombre_area },
            categoria: { nombre: ins.nombre_categoria },
          }))
        );
        const unique = Array.from(
          new Map(flat.map((i) => [JSON.stringify(i), i])).values()
        );
        setRows(unique);
      })
      .catch(console.error);
  }, [idConv]);

  useEffect(() => {
    setAreas([...new Set(rows.map((r) => r.area.nombre))]);
    setCategorias([...new Set(rows.map((r) => r.categoria.nombre))]);
    setUnidades([...new Set(rows.map((r) => r.unidad_educativa.nombre))]);
  }, [rows]);

  useEffect(() => {
    let data = [...rows];
    if (selArea) data = data.filter((r) => r.area.nombre === selArea);
    if (selCat) data = data.filter((r) => r.categoria.nombre === selCat);
    if (selUni) data = data.filter((r) => r.unidad_educativa.nombre === selUni);
    if (searchText) {
      const t = searchText.toLowerCase();
      data = data.filter(
        (r) =>
          r.nombre?.toLowerCase().includes(t) ||
          r.apellido?.toLowerCase().includes(t) ||
          r.ci?.toString().toLowerCase().includes(t)
      );
    }
    setFiltered(data);
  }, [rows, selArea, selCat, selUni, searchText]);

  const resetFilters = () => {
    setSelArea("");
    setSelCat("");
    setSelUni("");
    setSearchText("");
  };

  const columns = [
    { name: "CI", selector: (r) => r.ci, sortable: true },
    { name: "Nombre", selector: (r) => r.nombre, sortable: true },
    { name: "Apellido", selector: (r) => r.apellido, sortable: true },
    {
      name: "Unidad Educativa",
      selector: (r) => r.unidad_educativa.nombre,
      sortable: true,
    },
    { name: "Área", selector: (r) => r.area.nombre, sortable: true },
    { name: "Categoría", selector: (r) => r.categoria.nombre, sortable: true },
  ];
  useEffect(() => {
    if (!idConv) {
      setRows([]);
      return;
    }
    setCargando(true); // activo spinner
    api
      .get(`/inscritos-oficiales/${idConv}`)
      .then((res) => {
        const flat = res.data.flatMap((stu) =>
          stu.inscripciones.map((ins) => ({
            ci: stu.ci,
            nombre: stu.nombre,
            apellido: stu.apellido,
            unidad_educativa: { nombre: stu.nombre_ue },
            area: { nombre: ins.nombre_area },
            categoria: { nombre: ins.nombre_categoria },
          }))
        );
        const unique = Array.from(
          new Map(flat.map((i) => [JSON.stringify(i), i])).values()
        );
        setRows(unique);
      })
      .catch(console.error)
      .finally(() => setCargando(false)); // apago spinner
  }, [idConv]);
  useEffect(() => {
    setCargandoConvocatorias(true);
    api
      .get("/convocatorias")
      .then((res) => setConvocatorias(res.data))
      .catch(console.error)
      .finally(() => setCargandoConvocatorias(false));
  }, []);
  return (
  <div className="inscritos-page">
    <div className="inscritos-container" style={{ minHeight: "60vh", position: "relative" }}>
      <h2 className="inscritos-header">Inscritos Oficiales</h2>

      {/* Spinner que bloquea toda la zona mientras cargan las convocatorias */}
      {cargandoConvocatorias && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "#FFFFFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 10,
            borderRadius: "12px",
          }}
        >
          <BallTriangle
            height={80}
            width={80}
            radius={5}
            color="#003366"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      )}

      {/* Selector convocatorias (se muestra siempre, aunque cargue) */}
      <div className="selector-conv">
        <select
          className="form-select"
          value={idConv}
          onChange={(e) => setIdConv(e.target.value)}
          disabled={cargandoConvocatorias} // opcional para bloquear mientras carga convocatorias
        >
          <option value="">-- Selecciona convocatoria --</option>
          {convocatorias.map((c) => (
            <option key={c.id_convocatoria} value={c.id_convocatoria}>
              {c.nombre_convocatoria}
            </option>
          ))}
        </select>
      </div>

      {/* Search bar */}
      <div className="search-container">
        <FaSearch className="search-icon" />
        <input
          type="text"
          placeholder="Buscar por nombre o CI..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value.slice(0, 70))}
          maxLength={70}
          disabled={cargandoConvocatorias} // opcional
        />
      </div>

      {/* Filters */}
      <div className="filters-container">
        <select
          className="form-select"
          value={selArea}
          onChange={(e) => setSelArea(e.target.value)}
          disabled={cargandoConvocatorias}
        >
          <option value="">-- Área --</option>
          {areas.map((a) => (
            <option key={a} value={a}>
              {a}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={selCat}
          onChange={(e) => setSelCat(e.target.value)}
          disabled={cargandoConvocatorias}
        >
          <option value="">-- Categoría --</option>
          {categorias.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          className="form-select"
          value={selUni}
          onChange={(e) => setSelUni(e.target.value)}
          disabled={cargandoConvocatorias}
        >
          <option value="">-- Unidad Educativa --</option>
          {unidades.map((u) => (
            <option key={u} value={u}>
              {u}
            </option>
          ))}
        </select>

        <button
          className="btn-primary reset-btn"
          onClick={resetFilters}
          disabled={cargandoConvocatorias}
        >
          Reiniciar Filtros
        </button>
      </div>

      {/* Spinner dentro de la tabla mientras carga inscritos */}
      {cargando ? (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <BallTriangle
            height={80}
            width={80}
            radius={5}
            color="#003366"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      ) : (
        <DataTable
          className="tabla-inscritos"
          columns={columns}
          data={filtered}
          pagination
          paginationRowsPerPageOptions={[10, 25, 50]}
          highlightOnHover
          pointerOnHover
          persistTableHead
        />
      )}
    </div>
  </div>
);


};

export default InscritosOficiales;
