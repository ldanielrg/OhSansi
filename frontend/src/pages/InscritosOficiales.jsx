// src/pages/InscritosOficiales.jsx
import React, { useState, useEffect } from "react";
import api from "../api/axios";
import DataTable from "react-data-table-component";
import { FaSearch } from "react-icons/fa";
import "../styles/InscritosOficiales.css";

const InscritosOficiales = () => {
  const [convocatorias, setConvocatorias] = useState([]);
  const [idConv, setIdConv] = useState("");
  const [inscritos, setInscritos] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [unidades, setUnidades] = useState([]);
  const [selAreas, setSelAreas] = useState([]);
  const [selCats, setSelCats] = useState([]);
  const [selUnis, setSelUnis] = useState([]);

  // Carga de convocatorias
  useEffect(() => {
    api.get("/convocatorias")
      .then(res => setConvocatorias(res.data))
      .catch(err => console.error(err));
  }, []);

  // Al cambiar convocatoria, carga inscritos
  useEffect(() => {
    if (!idConv) {
      setInscritos([]);
      return;
    }
    api.get(`/inscritos-oficiales/${idConv}`)
      .then(res => setInscritos(res.data))
      .catch(err => console.error(err));
  }, [idConv]);

  // Derivar opciones de filtros
  useEffect(() => {
    setAreas([...new Set(inscritos.map(i => i.area.nombre))]);
    setCategorias([...new Set(inscritos.map(i => i.categoria.nombre))]);
    setUnidades([...new Set(inscritos.map(i => i.unidad_educativa.nombre))]);
  }, [inscritos]);

  // Aplicar búsqueda + filtros
  useEffect(() => {
    let data = [...inscritos];
    if (selAreas.length) {
      data = data.filter(i => selAreas.includes(i.area.nombre));
    }
    if (selCats.length) {
      data = data.filter(i => selCats.includes(i.categoria.nombre));
    }
    if (selUnis.length) {
      data = data.filter(i => selUnis.includes(i.unidad_educativa.nombre));
    }
    if (searchText) {
      const t = searchText.toLowerCase();
      data = data.filter(i =>
        i.nombre.toLowerCase().includes(t) ||
        i.apellido.toLowerCase().includes(t) ||
        i.ci.toString().includes(t)
      );
    }
    setFiltered(data);
  }, [inscritos, selAreas, selCats, selUnis, searchText]);

  const resetFilters = () => {
    setSelAreas([]);
    setSelCats([]);
    setSelUnis([]);
    setSearchText("");
  };

  const columns = [
    { name: "CI", selector: row => row.ci, sortable: true },
    { name: "Nombre", selector: row => row.nombre, sortable: true },
    { name: "Apellido", selector: row => row.apellido, sortable: true },
    { name: "Unidad Educativa", selector: row => row.unidad_educativa.nombre, sortable: true },
    { name: "Área", selector: row => row.area.nombre, sortable: true },
    { name: "Categoría", selector: row => row.categoria.nombre, sortable: true },
  ];

  return (
    <div className="inscritos-page">
      <div className="inscritos-container">
        <div className="inscritos-header">Inscritos Oficiales</div>

        <div className="top-bar d-flex align-items-center gap-2 mb-3">
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

          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Buscar por nombre o CI..."
              value={searchText}
              onChange={e => setSearchText(e.target.value.slice(0, 70))}
              maxLength={70}
            />
          </div>
        </div>

        <div className="filters d-flex gap-2 mb-3">
          <select
            multiple
            className="form-select"
            value={selAreas}
            onChange={e => setSelAreas(Array.from(e.target.selectedOptions, o => o.value))}
          >
            <option disabled>-- Área --</option>
            {areas.map(a => <option key={a} value={a}>{a}</option>)}
          </select>

          <select
            multiple
            className="form-select"
            value={selCats}
            onChange={e => setSelCats(Array.from(e.target.selectedOptions, o => o.value))}
          >
            <option disabled>-- Categoría --</option>
            {categorias.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select
            multiple
            className="form-select"
            value={selUnis}
            onChange={e => setSelUnis(Array.from(e.target.selectedOptions, o => o.value))}
          >
            <option disabled>-- Unidad Educativa --</option>
            {unidades.map(u => <option key={u} value={u}>{u}</option>)}
          </select>

          <button className="btn-primary" onClick={resetFilters}>
            Reiniciar Filtros
          </button>
        </div>

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
      </div>
    </div>
  );
};

export default InscritosOficiales;
