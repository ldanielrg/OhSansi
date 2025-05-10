// src/pages/GestionarConvocatoria.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/GestionarConvocatoria.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const GestionarConvocatoria = () => {
  const { id_convocatoria: idConv } = useParams();
  const navigate = useNavigate();

  // Listas globales
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [gradosCat, setGradosCat] = useState([]);

  // Asignaciones actuales
  const [asignaciones, setAsignaciones] = useState([]);

  // Selects
  const [selArea, setSelArea] = useState("");
  const [selCat, setSelCat] = useState("");
  const [selGrIni, setSelGrIni] = useState("");
  const [selGrFin, setSelGrFin] = useState("");

  // Campos de creación/edición de área y categoría
  const [newArea, setNewArea] = useState("");
  const [editArea, setEditArea] = useState({
    id: null,
    nombre: "",
    activo: true,
  });

  const [newCat, setNewCat] = useState("");
  const [editCat, setEditCat] = useState({
    id: null,
    nombre: "",
    descripcion: "",
    activo: true,
  });

  // Convocatoria detalle
  const [convName, setConvName] = useState("");
  const [convDesc, setConvDesc] = useState("");

  // Cámbialo por esto:
  useEffect(() => {
    if (!idConv) return; // si no hay id, no fetches
    const fetchAll = async () => {
      try {
        const [areasRes, catsRes, asgRes] = await Promise.all([
          api.get(`/areas/${idConv}`),
          api.get(`/categorias-grados/${idConv}`),
          api.get(`/areas-categorias-grados/${idConv}`),
        ]);
        setAreas(areasRes.data);
        setCategorias(catsRes.data);
        setAsignaciones(asgRes.data);
      } catch (err) {
        console.error(err);
        toast.error("Error cargando datos iniciales.");
      }
    };
    fetchAll();
  }, [idConv]); // ahora se disparará **solo** cuando idConv deje de ser undefined
  // Crear área
  const handleCreateArea = async () => {
    if (!newArea.trim()) return toast.warn("Escribe un nombre de área.");
    try {
      await api.post(`/area-crear/${idConv}`, {
        nombre: newArea.trim(),
        id_convocatoria: parseInt(idConv),
      });
      toast.success("Área creada.");
      setNewArea("");
      const res = await api.get(`/areas/${idConv}`);
      setAreas(res.data);
    } catch {
      toast.error("Error creando área.");
    }
  };

  // Editar área
  const handleEditArea = async () => {
    if (!editArea.id) return;
    try {
      await api.post("/area-editar", {
        id_area: editArea.id,
        nombre_area: editArea.nombre,
        activo: editArea.activo,
      });
      toast.success("Área actualizada.");
      const res = await api.get(`/areas/${idConv}`);
      setAreas(res.data);
      setEditArea({ id: null, nombre: "", activo: true });
    } catch {
      toast.error("Error editando área.");
    }
  };

  // Eliminar área
  const handleDeleteArea = async (areaId) => {
    if (!window.confirm("Eliminar esta área?")) return;
    try {
      await api.delete(`/area-eliminar/${areaId}`);
      toast.error("Área eliminada.");
      const res = await api.get(`/areas/${idConv}`);
      setAreas(res.data);
    } catch {
      toast.error("Error eliminando área.");
    }
  };

  // Crear categoría
  const handleCreateCat = async () => {
    if (!newCat.trim()) return toast.warn("Escribe un nombre de categoría.");
    try {
      await api.post(`/categoria-crear/${idConv}`, {
        nombre_categoria: newCat.trim(),
        descripcion: "",
      });
      toast.success("Categoría creada.");
      setNewCat("");
      const res = await api.get(`/categorias-grados/${idConv}`);
      setCategorias(res.data);
    } catch {
      toast.error("Error creando categoría.");
    }
  };

  // Editar categoría
  const handleEditCat = async () => {
    if (!editCat.id) return;
    try {
      await api.post("/categoria-editar", {
        id_categoria: editCat.id,
        nombre_categoria: editCat.nombre,
        descripcion: editCat.descripcion,
      });
      toast.success("Categoría actualizada.");
      const res = await api.get(`/categorias-grados/${idConv}`);
      setCategorias(res.data);
      setEditCat({ id: null, nombre: "", descripcion: "", activo: true });
    } catch {
      toast.error("Error editando categoría.");
    }
  };

  // Eliminar categoría
  const handleDeleteCat = async (catId) => {
    if (!window.confirm("Eliminar esta categoría?")) return;
    try {
      await api.delete(`/categoria-eliminar/${catId}`);
      toast.error("Categoría eliminada.");
      const res = await api.get(`/categorias-grados/${idConv}`);
      setCategorias(res.data);
    } catch {
      toast.error("Error eliminando categoría.");
    }
  };

  // Asignar Área-Categoría (con precio y activo)
  const handleAssignAreaCat = async () => {
    if (!selArea || !selCat) return toast.warn("Selecciona área y categoría.");
    try {
      await api.post("/asignar-area-categoria", {
        id_area: parseInt(selArea),
        id_categoria: parseInt(selCat),
        precio: 0,
        activo: true,
      });
      toast.success("Asignación guardada.");
      const acg = await api.get(`/areas-categorias-grados/${idConv}`);
      setAsignaciones(acg.data);
    } catch {
      toast.error("Error asignando área a categoría.");
    }
  };

  // Asignar Grados a Categoría
  const handleAssignGradosCat = async () => {
    if (!selCat || !selGrIni)
      return toast.warn("Selecciona categoría y grado inicial.");
    try {
      await api.post("/asignar-grados-categoria", {
        id_categoria: parseInt(selCat),
        grado_inicial_id: parseInt(selGrIni),
        grado_final_id: selGrFin ? parseInt(selGrFin) : null,
      });
      toast.success("Grados asignados.");
      const cg = await api.get(`/categorias-grados/${idConv}`);
      setCategorias(cg.data);
    } catch {
      toast.error("Error asignando grados.");
    }
  };

  // Limpiar grados de categoría
  const handleClearGrados = async (catId) => {
    if (!window.confirm("Limpiar grados de esta categoría?")) return;
    try {
      await api.post("/limpiar-grados-categoria", { id_categoria: catId });
      toast.success("Grados limpiados.");
      const cg = await api.get(`/categorias-grados/${idConv}`);
      setCategorias(cg.data);
    } catch {
      toast.error("Error limpiando grados.");
    }
  };

  // Eliminar asignación área-cat
  const handleRemoveAsign = async (areaId, catId) => {
    if (!window.confirm("Eliminar asignación?")) return;
    try {
      await api.delete(`/eliminar-area-categoria/${idConv}`, {
        data: { id_area: areaId, id_categoria: catId },
      });
      toast.error("Asignación eliminada.");
      const acg = await api.get(`/areas-categorias-grados/${idConv}`);
      setAsignaciones(acg.data);
    } catch {
      toast.error("Error eliminando asignación.");
    }
  };

  // Guardar datos generales de convocatoria
  const handleSaveConv = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/convocatoria-editar/${idConv}`, {
        nombre_convocatoria: convName,
        descripcion: convDesc,
        activo: true,
      });
      toast.success("Datos de convocatoria guardados.");
    } catch {
      toast.error("Error guardando convocatoria.");
    }
  };

  return (
    <div className="gest-page">
      <div className="gest-container">
        <div className="gest-card">
          <div className="gest-header">
            Gestionar Convocatoria: {convName || "Sin nombre"}
          </div>
          <div className="gest-body">
            {/* Áreas */}
            <div className="subcard">
              <h4>Áreas</h4>
              <div className="subrow">
                <input
                  placeholder="Nueva área"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                />
                <button onClick={handleCreateArea}>Crear</button>
                <button
                  onClick={() => editArea.id && handleDeleteArea(editArea.id)}
                  disabled={!editArea.id}
                >
                  Eliminar
                </button>
              </div>
              <table className="tabla-lista">
                <tbody>
                  {areas.map((a) => (
                    <tr
                      key={a.id_area}
                      onClick={() =>
                        setEditArea({
                          id: a.id_area,
                          nombre: a.nombre_area,
                          activo: a.activo,
                        })
                      }
                      className={
                        editArea.id === a.id_area ? "fila-seleccionada" : ""
                      }
                    >
                      <td>{a.nombre_area}</td>
                      <td>
                        <input type="checkbox" checked={a.activo} readOnly />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editArea.id && (
                <div className="subrow">
                  <input
                    value={editArea.nombre}
                    onChange={(e) =>
                      setEditArea({ ...editArea, nombre: e.target.value })
                    }
                  />
                  <label>
                    Activo
                    <input
                      type="checkbox"
                      checked={editArea.activo}
                      onChange={(e) =>
                        setEditArea({ ...editArea, activo: e.target.checked })
                      }
                    />
                  </label>
                  <button onClick={handleEditArea}>Guardar</button>
                </div>
              )}
            </div>

            {/* Categorías */}
            <div className="subcard">
              <h4>Categorías</h4>
              <div className="subrow">
                <input
                  placeholder="Nueva categoría"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                />
                <button onClick={handleCreateCat}>Crear</button>
                <button
                  onClick={() => editCat.id && handleDeleteCat(editCat.id)}
                  disabled={!editCat.id}
                >
                  Eliminar
                </button>
              </div>
              <table className="tabla-lista">
                <tbody>
                  {categorias.map((c) => (
                    <tr
                      key={c.id_categoria}
                      onClick={() =>
                        setEditCat({
                          id: c.id_categoria,
                          nombre: c.nombre_categoria,
                          descripcion: c.descripcion,
                          activo: c.activo,
                        })
                      }
                      className={
                        editCat.id === c.id_categoria ? "fila-seleccionada" : ""
                      }
                    >
                      <td>{c.nombre_categoria}</td>
                      <td>{c.grado_inicial_nombre || ""}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {editCat.id && (
                <div className="subrow">
                  <input
                    value={editCat.nombre}
                    onChange={(e) =>
                      setEditCat({ ...editCat, nombre: e.target.value })
                    }
                  />
                  <input
                    value={editCat.descripcion}
                    onChange={(e) =>
                      setEditCat({ ...editCat, descripcion: e.target.value })
                    }
                    placeholder="Descripción"
                  />
                  <label>
                    Activo
                    <input
                      type="checkbox"
                      checked={editCat.activo}
                      onChange={(e) =>
                        setEditCat({ ...editCat, activo: e.target.checked })
                      }
                    />
                  </label>
                  <button onClick={handleEditCat}>Guardar</button>
                </div>
              )}
            </div>

            {/* Asignaciones */}
            <div className="subcard">
              <h4>Asignar Área → Categoría</h4>
              <div className="subrow">
                <select
                  value={selArea}
                  onChange={(e) => setSelArea(e.target.value)}
                >
                  <option value="">Área</option>
                  {areas.map((a) => (
                    <option key={a.id_area} value={a.id_area}>
                      {a.nombre_area}
                    </option>
                  ))}
                </select>
                <select
                  value={selCat}
                  onChange={(e) => setSelCat(e.target.value)}
                >
                  <option value="">Categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre_categoria}
                    </option>
                  ))}
                </select>
                <button onClick={handleAssignAreaCat}>Agregar</button>
              </div>
            </div>

            <div className="subcard">
              <h4>Asignaciones Actuales</h4>
              <table className="tabla-asign">
                <thead>
                  <tr>
                    <th>Área</th>
                    <th>Categoría</th>
                    <th>Quitar</th>
                  </tr>
                </thead>
                <tbody>
                  {asignaciones.map((a, i) => (
                    <tr key={i}>
                      <td>{a.nombre_area}</td>
                      <td>
                        {a.categoria?.length > 0
                          ? a.categoria
                              .map((cat) => cat.nombre_categoria)
                              .join(", ")
                          : "Ninguna categoría"}
                      </td>
                      <td>
                        <button
                          onClick={() =>
                            handleRemoveAsign(
                              a.id_area,
                              a.categoria[0].id_categoria
                            )
                          }
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Gestión de grados-categoría */}
            <div className="subcard">
              <h4>Asignar Grados a Categoría</h4>
              <div className="subrow">
                <select
                  value={selCat}
                  onChange={(e) => setSelCat(e.target.value)}
                >
                  <option value="">Categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre_categoria}
                    </option>
                  ))}
                </select>
                <select
                  value={selGrIni}
                  onChange={(e) => setSelGrIni(e.target.value)}
                >
                  <option value="">Grado Inicial</option>
                  {gradosCat.map((g) => (
                    <option key={g.grado_inicial_id} value={g.grado_inicial_id}>
                      {g.grado_inicial_nombre}
                    </option>
                  ))}
                </select>
                <select
                  value={selGrFin}
                  onChange={(e) => setSelGrFin(e.target.value)}
                >
                  <option value="">Grado Final</option>
                  {gradosCat.map(
                    (g) =>
                      g.grado_final_id && (
                        <option key={g.grado_final_id} value={g.grado_final_id}>
                          {g.grado_final_nombre}
                        </option>
                      )
                  )}
                </select>
                <button onClick={handleAssignGradosCat}>Asignar</button>
              </div>
              <button onClick={() => handleClearGrados(selCat)}>
                Limpiar Grados
              </button>
            </div>

            {/* Datos generales convocatoria */}

            <form onSubmit={handleSaveConv}>
              <div className="acciones-ger">
                <button type="submit" className="btn-crear">
                  Guardar
                </button>
                <button
                  type="button"
                  className="btn-eliminar"
                  onClick={() => navigate("/configuracion-convocatoria")}
                >
                  Salir
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default GestionarConvocatoria;
