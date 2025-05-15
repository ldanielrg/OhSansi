// src/pages/GestionarConvocatoria.jsx
import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/GestionarConvocatoria.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function GestionarConvocatoria() {
  const { id_convocatoria } = useParams();
  const navigate = useNavigate();

  const [convName, setConvName] = useState("");

  // Listas
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [grados, setGrados] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]); // área→categoría→grados
  const [selectedAssign, setSelectedAssign] = useState({
    area: null,
    categoria: null,
  });
  // Formularios in situ
  const [newArea, setNewArea] = useState("");
  const [editArea, setEditArea] = useState({ id: "", nombre_area: "" });
  const [newCat, setNewCat] = useState("");
  const [editCat, setEditCat] = useState({ id: "", nombre_categoria: "" });

  // Selects para asignar
  const [selArea, setSelArea] = useState("");
  const [selCat, setSelCat] = useState("");
  const [selGrIni, setSelGrIni] = useState("");
  const [selGrFin, setSelGrFin] = useState("");

  const loadAll = useCallback(async () => {
    if (!id_convocatoria) return;
    try {
      // Convocatoria
      const det = await api.get(`/convocatoria-detalle/${id_convocatoria}`);
      setConvName(det.data[0]?.nombre_convocatoria || "");

      // Áreas, categorías, grados
      const [arRes, catRes, grRes, acgRes] = await Promise.all([
        api.get(`/areas/${id_convocatoria}`),
        api.get(`/categorias`, { params: { id_convocatoria } }),
        api.get(`/grados`),
        api.get(`/areas-categorias-grados/${id_convocatoria}`),
      ]);
      setAreas(arRes.data);
      setCategorias(catRes.data);
      setGrados(grRes.data);
      setAsignaciones(acgRes.data);
    } catch (err) {
      console.error(err);
      toast.error("Error cargando datos iniciales.");
    }
  }, [id_convocatoria]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);
  const handleCreateArea = async () => {
    if (!newArea.trim()) return toast.warn("Escribe un nombre de área.");
    try {
      await api.post(`/convocatoria/${id_convocatoria}/area`, {
        nombre: newArea.trim(),
      });

      toast.success("Área creada");
      setNewArea("");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear área.");
    }
  };

  const handleUpdateArea = async () => {
    if (!editArea.id) return;
    try {
      await api.post(`/area-editar`, {
        id_area: editArea.id,
        nombre_area: newArea.trim(), //usa el input
        activo: editArea.activo,
      });
      toast.success("Área actualizada");
      setEditArea({ id: null, nombre_area: "" });
      setNewArea(""); // limpia el input
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al editar área.");
    }
  };

  const handleDeleteArea = async (id) => {
    if (!window.confirm("¿Eliminar esta área?")) return;

    try {
      await api.delete(`/area-eliminar/${id}`);
      toast.error("Área eliminada");

      // Si el área eliminada estaba seleccionada para editar, limpiar
      if (editArea.id === id) {
        setEditArea({ id: null, nombre_area: "" });
        setNewArea("");
      }

      loadAll(); // recargar lista de áreas
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar área.");
    }
  };

  const handleCreateCat = async () => {
    if (!newCat.trim()) return toast.warn("Escribe un nombre de categoría.");
    try {
      await api.post(`/categoria-crear/${id_convocatoria}`, {
        nombre_categoria: newCat.trim(),
        id_convocatoria: Number(id_convocatoria),
      });
      toast.success("Categoría creada");
      setNewCat("");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear categoría.");
    }
  };

  const handleUpdateCat = async () => {
    if (!editCat.id) return;

    try {
      await api.post(`/categoria-editar`, {
        id_categoria: editCat.id,
        nombre_categoria: newCat.trim(), //input actualizado
      });

      toast.success("Categoría actualizada");
      setEditCat({ id: null, nombre_categoria: "" });
      setNewCat(""); // limpia input
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al editar categoría.");
    }
  };

  const handleDeleteCat = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;

    try {
      await api.delete(`/categoria-eliminar/${id}`);
      toast.error("Categoría eliminada");

      // Limpia si era la seleccionada
      if (editCat.id === id) {
        setEditCat({ id: null, nombre_categoria: "" });
        setNewCat("");
      }

      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar categoría.");
    }
  };

  const handleAssignAreaCat = async () => {
    if (!selArea || !selCat) return toast.warn("Selecciona área y categoría.");
    try {
      await api.post(`/asignar-area-categoria`, {
        id_area: Number(selArea),
        id_categoria: Number(selCat),
        precio: 0,
        activo: true,
      });
      toast.success("Área asignada a categoría");
      loadAll();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.warn("Ya existe esa asignación.");
      } else {
        console.error(err);
        toast.error("Error asignando área→categoría");
      }
    }
  };

  const handleAssignGradosCat = async () => {
    if (!selCat || !selGrIni)
      return toast.warn("Selecciona categoría y grado inicial.");

    try {
      await api.post(`/asignar-grados-categoria`, {
        id_categoria: Number(selCat),
        grado_inicial_id: Number(selGrIni),
        grado_final_id: selGrFin ? Number(selGrFin) : null,
      });
      toast.success("Grados asignados a categoría");
      loadAll(); // recargar lista
    } catch (err) {
      if (err.response?.status === 409) {
        toast.warn("Ya se asignaron los grados a esta categoría.");
      } else {
        console.error(err);
        toast.error("Error al asignar grados.");
      }
    }
  };

  const handleUpdateAssignAreaCat = async () => {
    if (!selArea || !selCat) return toast.warn("Selecciona área y categoría.");
    try {
      // mismo endpoint si tu backend hace upsert
      await api.post(`/asignar-area-categoria`, {
        id_area: Number(selArea),
        id_categoria: Number(selCat),
        precio: 0,
        activo: true,
      });
      toast.success("Asignación actualizada");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error guardando edición");
    }
  };
  const handleUpdateAssignGradosCat = async () => {
    if (!selCat || !selGrIni)
      return toast.warn("Selecciona categoría y grado inicial.");
    try {
      await api.post(`/asignar-grados-categoria`, {
        id_categoria: Number(selCat),
        grado_inicial_id: Number(selGrIni),
        grado_final_id: selGrFin ? Number(selGrFin) : null,
      });
      toast.success("Edición guardada");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error guardando edición");
    }
  };

  const handleClearGrades = async (id_categoria, id_area) => {
    if (!window.confirm("¿Eliminar la relación y limpiar grados?")) return;

    try {
      await api.delete("/eliminar-area-categoria", {
        data: {
          id_area,
          id_categoria,
        },
      });

      toast.success("Relación eliminada y grados limpiados.");
      loadAll(); //Refresca la tabla
    } catch (err) {
      console.error(err);
      toast.error("Error al limpiar.");
    }
  };

  return (
    <div className="gest-page">
      <div className="gest-container">
        <div className="gest-card">
          <div className="gest-header">
            Gestionar Convocatoria: <strong>{convName}</strong>
          </div>
          <div className="gest-body">
            <div className="subcard">
              <h4>Áreas</h4>
              <div className="subrow">
                <input
                  placeholder="Nueva área"
                  value={newArea}
                  onChange={(e) => setNewArea(e.target.value)}
                />
                <button onClick={handleCreateArea}>Crear</button>
                <button onClick={handleUpdateArea} disabled={!editArea.id}>
                  Guardar edición
                </button>
              </div>
              <table className="tabla-lista">
                <tbody>
                  {areas.map((a) => (
                    <tr
                      key={a.id_area}
                      onClick={() => {
                        setEditArea({
                          id: a.id_area,
                          nombre_area: a.nombre_area,
                        });
                        setNewArea(a.nombre_area); // Esto llena el input
                      }}
                      className={
                        editArea.id === a.id_area ? "fila-seleccionada" : ""
                      }
                    >
                      <td>{a.nombre_area}</td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation(); // Evita que al hacer clic en el botón se seleccione la fila
                            handleDeleteArea(a.id_area);
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="subcard">
              <h4>Categorías</h4>
              <div className="subrow">
                <input
                  placeholder="Nueva categoría"
                  value={newCat}
                  onChange={(e) => setNewCat(e.target.value)}
                />
                <button onClick={handleCreateCat}>Crear</button>
                <button onClick={handleUpdateCat} disabled={!editCat.id}>
                  Guardar edición
                </button>
              </div>
              <table className="tabla-lista">
                <tbody>
                  {categorias.map((c) => (
                    <tr
                      key={c.id_categoria}
                      onClick={() => {
                        setEditCat({
                          id: c.id_categoria,
                          nombre_categoria: c.nombre_categoria,
                        });
                        setNewCat(c.nombre_categoria); // 👈 actualiza input
                      }}
                      className={
                        editCat.id === c.id_categoria ? "fila-seleccionada" : ""
                      }
                    >
                      <td>{c.nombre_categoria}</td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCat(c.id_categoria);
                          }}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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
                <button onClick={handleAssignAreaCat}>Asignar</button>
                <button
                  onClick={handleUpdateAssignAreaCat}
                  disabled={!selArea || !selCat}
                >
                  Guardar edición
                </button>
              </div>
            </div>

            <div className="subcard">
              <h4>Asignar Grados → Categoría</h4>
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
                  {grados.map((g) => (
                    <option key={g.id_grado} value={g.id_grado}>
                      {g.nombre_grado}
                    </option>
                  ))}
                </select>
                <select
                  value={selGrFin}
                  onChange={(e) => setSelGrFin(e.target.value)}
                >
                  <option value="">Grado Final</option>
                  {grados.map((g) => (
                    <option key={g.id_grado} value={g.id_grado}>
                      {g.nombre_grado}
                    </option>
                  ))}
                </select>
                <button onClick={handleAssignGradosCat}>Asignar</button>
                <button
                  onClick={handleUpdateAssignGradosCat}
                  disabled={!selArea || !selCat}
                >
                  Guardar edición
                </button>
              </div>
            </div>

            <div className="subcard">
              <h4>Asignaciones actuales</h4>
              <table className="tabla-asign">
                <thead>
                  <tr>
                    <th>Área</th>
                    <th>Categoría</th>
                    <th>Grados</th>
                    <th>Limpiar</th>
                  </tr>
                </thead>
                <tbody>
                  {asignaciones.map((a, i) =>
                    (a.categorias || []).map((c, j) => (
                      <tr
                        key={`${i}-${j}`}
                        onClick={() => {
                          setSelArea(a.id_area);
                          setSelCat(c.id_categoria);
                          setSelGrIni(c.grado_inicial_id);
                          setSelGrFin(
                            c.grado_final_id != null
                              ? String(c.grado_final_id)
                              : String(c.grado_inicial_id) // si no hay grado_final, usamos el inicial
                          );
                          // guardamos la selección para el resaltado
                          setSelectedAssign({
                            area: a.id_area,
                            categoria: c.id_categoria,
                          });
                        }}
                        className={
                          selectedAssign.area === a.id_area &&
                          selectedAssign.categoria === c.id_categoria
                            ? "fila-seleccionada"
                            : ""
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <td>{a.nombre_area}</td>
                        <td>{c.nombre_categoria}</td>
                        <td>
                          {c.grado_final_nombre &&
                          c.grado_final_nombre !== c.grado_inicial_nombre
                            ? `${c.grado_inicial_nombre} – ${c.grado_final_nombre}`
                            : c.grado_inicial_nombre}
                        </td>
                        <td>
                          <button
                            onClick={() =>
                              handleClearGrades(c.id_categoria, a.id_area)
                            }
                          >
                            Limpiar
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="acciones-ger">
              <button className="btn-crear" onClick={() => navigate(-1)}>
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
