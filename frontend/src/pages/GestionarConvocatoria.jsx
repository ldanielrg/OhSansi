import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/GestionarConvocatoria.css";
import { ToastContainer, toast } from "react-toastify";
import { BallTriangle } from "react-loader-spinner";
import "react-toastify/dist/ReactToastify.css";

export default function GestionarConvocatoria() {
  const { id_convocatoria } = useParams();
  const navigate = useNavigate();

  const [cargando, setCargando] = useState(false);

  const [convName, setConvName] = useState("");
  const [precio, setPrecio] = useState("");
  const [participantes, setParticipantes] = useState("");

  // Listas
  const [areas, setAreas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [grados, setGrados] = useState([]);
  const [asignaciones, setAsignaciones] = useState([]);
  const [selectedAssign, setSelectedAssign] = useState({
    area: null,
    categoria: null,
  });

  // Formularios in situ
  const [newArea, setNewArea] = useState("");
  const [editArea, setEditArea] = useState({ id: null, nombre_area: "" });
  const [newCat, setNewCat] = useState("");
  const [editCat, setEditCat] = useState({ id: null, nombre_categoria: "" });

  // Selects para asignar
  const [selArea, setSelArea] = useState("");
  const [selCat, setSelCat] = useState("");
  const [selGrIni, setSelGrIni] = useState("");
  const [selGrFin, setSelGrFin] = useState("");
  const [showDeleteAreaModal, setShowDeleteAreaModal] = useState(false);
  const [areaToDelete, setAreaToDelete] = useState(null);
  const [cargandoDeleteArea, setCargandoDeleteArea] = useState(false);
  const [cargandoArea, setCargandoArea] = useState(false);
  const [cargandoUpdateArea, setCargandoUpdateArea] = useState(false);

  const [cargandoCreateCat, setCargandoCreateCat] = useState(false);
  const [cargandoUpdateCat, setCargandoUpdateCat] = useState(false);
  const [deletingCatId, setDeletingCatId] = useState(null);

  const [showDeleteCatModal, setShowDeleteCatModal] = useState(false);
  const [catToDelete, setCatToDelete] = useState(null);

  const [cargandoAssign, setCargandoAssign] = useState(false);
  const [cargandoAssignGrados, setCargandoAssignGrados] = useState(false);
  const [editAssignGrados, setEditAssignGrados] = useState({ id: null });
  const [cargandoCrearGrados, setCargandoCrearGrados] = useState(false);
  const [cargandoEditarGrados, setCargandoEditarGrados] = useState(false);

  const [showClearModal, setShowClearModal] = useState(false);
  const [clearIds, setClearIds] = useState({
    id_categoria: null,
    id_area: null,
  });
  const [loadingClear, setLoadingClear] = useState(false);
  // 1) Al inicio de tu componente
  const [cargandoCreandoAssign, setCargandoCreandoAssign] = useState(false);
  const [cargandoEditandoAssign, setCargandoEditandoAssign] = useState(false);

  const participantesMap = {
    Individual: 1,
    Duo: 2,
    Trio: 3,
    Cuarteto: 4,
  };

  const loadAll = useCallback(async () => {
    if (!id_convocatoria) return;
    setCargando(true);
    try {
      const det = await api.get(`/convocatoria-detalle/${id_convocatoria}`);
      const conv = det.data[0];
      if (conv && conv.activo === false) {
        toast.error("No puedes gestionar una convocatoria inactiva.");
        navigate("/configuracion-convocatoria");
        return;
      }
      setConvName(det.data[0]?.nombre_convocatoria || "");

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
    } finally {
      setCargando(false);
    }
  }, [id_convocatoria]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // --- Manejo Áreas ---
  const handleCreateArea = async () => {
    const nombreTrim = newArea.trim();

    // Validaciones
    if (newArea.startsWith(" ")) {
      return toast.warn("El nombre no puede iniciar con espacios.");
    }
    if (!nombreTrim) {
      return toast.warn("Escribe un nombre de área.");
    }
    if (nombreTrim.length > 30) {
      return toast.warn("El nombre no puede exceder 30 caracteres.");
    }
    if (
      areas.some(
        (a) => a.nombre_area.trim().toLowerCase() === nombreTrim.toLowerCase()
      )
    ) {
      return toast.warn("Ya existe un área con ese nombre.");
    }
    // Empieza con letra y solo letras/acentos y espacios en el resto
    const regex = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]*$/;
    if (!regex.test(nombreTrim)) {
      return toast.warn(
        "El nombre debe comenzar con letra y solo contener letras y espacios."
      );
    }

    try {
      setCargandoArea(true);
      await api.post(`/convocatoria/${id_convocatoria}/area`, {
        nombre: nombreTrim,
      });
      toast.success("Área creada");
      setNewArea("");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear área.");
    } finally {
      setCargandoArea(false);
    }
  };

  const handleUpdateArea = async () => {
    if (!editArea.id) return;
    const nombreTrim = newArea.trim();

    // Validaciones
    if (newArea.startsWith(" ")) {
      return toast.warn("El nombre no puede iniciar con espacios.");
    }
    if (!nombreTrim) {
      return toast.warn("Escribe un nombre de área.");
    }
    if (nombreTrim.length > 30) {
      return toast.warn("El nombre no puede exceder 30 caracteres.");
    }
    if (
      areas.some(
        (a) => a.nombre_area.trim().toLowerCase() === nombreTrim.toLowerCase()
      )
    ) {
      return toast.warn("Ya existe un área con ese nombre.");
    }
    // Empieza con letra y solo letras/acentos y espacios en el resto
    const regex = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]*$/;
    if (!regex.test(nombreTrim)) {
      return toast.warn(
        "El nombre debe comenzar con letra y solo contener letras y espacios."
      );
    }
    try {
      setCargandoUpdateArea(true);
      await api.post(`/area-editar`, {
        id_area: editArea.id,
        nombre_area: nombreTrim,
        activo: editArea.activo,
      });
      toast.success("Área actualizada");
      setEditArea({ id: null, nombre_area: "" });
      setNewArea("");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al editar área.");
    } finally {
      setCargandoUpdateArea(false);
    }
  };

  const handleDeleteArea = async (id) => {
    try {
      await api.delete(`/area-eliminar/${id}`);
      toast.error("Área eliminada");
      if (editArea.id === id) {
        setEditArea({ id: null, nombre_area: "" });
        setNewArea("");
      }
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al eliminar área.");
    }
  };

  // --- Manejo Categorías ---
  const handleCreateCat = async () => {
    const nombreTrim = newCat.trim();
    // 1) No permitir espacios al inicio
    if (newCat.startsWith(" ")) {
      return toast.warn(
        "El nombre de categoria no puede iniciar con espacios."
      );
    }
    if (
      categorias.some(
        (c) =>
          c.nombre_categoria.trim().toLowerCase() === nombreTrim.toLowerCase()
      )
    ) {
      return toast.warn("Ya existe una categoría con ese nombre.");
    }
    const regex = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]*$/;
    if (!regex.test(nombreTrim)) {
      return toast.warn(
        "El nombre debe comenzar con letra y solo contener letras y espacios."
      );
    }
    // 2) Trim y validación

    if (!nombreTrim) {
      return toast.warn("Escribe un nombre de categoría.");
    }
    if (nombreTrim.length > 30) {
      return toast.warn("Máximo 30 caracteres.");
    }

    try {
      setCargandoCreateCat(true);
      await api.post(`/categoria-crear/${id_convocatoria}`, {
        nombre_categoria: nombreTrim,
        id_convocatoria: Number(id_convocatoria),
      });
      toast.success("Categoría creada");
      setNewCat("");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al crear categoría.");
    } finally {
      setCargandoCreateCat(false);
    }
  };

  const handleUpdateCat = async () => {
    if (!editCat.id) return;

    const nombreTrim = newCat.trim();
    // 1) No permitir espacios al inicio
    if (newCat.startsWith(" ")) {
      return toast.warn(
        "El nombre de categoria no puede iniciar con espacios."
      );
    }
    if (
      categorias.some(
        (c) =>
          c.nombre_categoria.trim().toLowerCase() === nombreTrim.toLowerCase()
      )
    ) {
      return toast.warn("Ya existe una categoría con ese nombre.");
    }
    const regex = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]*$/;
    if (!regex.test(nombreTrim)) {
      return toast.warn(
        "El nombre debe comenzar con letra y solo contener letras y espacios."
      );
    }
    // 2) Trim y validación

    if (!nombreTrim) {
      return toast.warn("Escribe un nombre de categoría.");
    }
    if (nombreTrim.length > 30) {
      return toast.warn("Máximo 30 caracteres.");
    }

    try {
      setCargandoUpdateCat(true);
      await api.post(`/categoria-editar`, {
        id_categoria: editCat.id,
        nombre_categoria: nombreTrim,
      });
      toast.success("Categoría actualizada");
      setEditCat({ id: null, nombre_categoria: "" });
      setNewCat("");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al editar categoría.");
    } finally {
      setCargandoUpdateCat(false);
    }
  };

  const handleDeleteCat = async (id) => {
    setDeletingCatId(id);
    try {
      await api.delete(`/categoria-eliminar/${id}`);
      toast.success("Categoría eliminada");
      loadAll();
    } catch {
      toast.error("Error al eliminar categoría.");
    } finally {
      setDeletingCatId(null);
    }
  };

  // --- Asignar Área → Categoría ---
  const handleAssignAreaCat = async () => {
    if (!selArea || !selCat || !precio || !participantes) {
      return toast.warn("Por favor completa todos los campos.");
    }

    const participantesInt = participantesMap[participantes] || null;
    if (!participantesInt) {
      return toast.warn("Selecciona una modalidad válida.");
    }

    try {
      await api.post(`/asignar-area-categoria`, {
        id_area: Number(selArea),
        id_categoria: Number(selCat),
        precio: Number(precio),
        participantes: participantesInt,
        activo: true,
      });
      toast.success("Área asignada a categoría");
      setPrecio("");
      setParticipantes("");
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

  const handleUpdateAssignAreaCat = async () => {
    if (!selArea || !selCat) return toast.warn("Selecciona área y categoría.");
    const participantesInt = participantesMap[participantes] || null;
    if (!participantesInt) {
      return toast.warn("Selecciona una modalidad válida.");
    }
    try {
      await api.post(`/asignar-area-categoria-edicion`, {
        id_area: Number(selArea),
        id_categoria: Number(selCat),
        precio: Number(precio),
        participantes: participantesInt,
        activo: true,
      });
      toast.success("Asignación actualizada");
      setPrecio("");
      setParticipantes("");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error guardando edición");
    }
  };

  // --- Asignar Grados → Categoría ---
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
      loadAll();
    } catch (err) {
      if (err.response?.status === 409) {
        toast.warn("Ya se asignaron los grados a esta categoría.");
      } else {
        console.error(err);
        toast.error("Error al asignar grados.");
      }
    }
  };

  const handleUpdateAssignGradosCat = async () => {
    if (!selCat || !selGrIni)
      return toast.warn("Selecciona categoría y grado inicial.");
    try {
      await api.post(`/asignar-grados-categoria-edicion`, {
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

  // --- Limpiar grados ---
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
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al limpiar.");
    }
  };

  const confirmClearGrades = async () => {
    const { id_categoria, id_area } = clearIds;
    setLoadingClear(true);
    try {
      await api.delete("/eliminar-area-categoria", {
        data: { id_area, id_categoria },
      });
      toast.success("Relación eliminada y grados limpiados.");
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al limpiar.");
    } finally {
      setLoadingClear(false);
      setShowClearModal(false);
      setClearIds({ id_categoria: null, id_area: null });
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
            {cargando ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: "250px",
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
            ) : (
              <>
                <div className="subcard">
                  <h4>Áreas</h4>
                  <div className="subrow">
                    <input
                      placeholder="Nueva área"
                      value={newArea}
                      onChange={(e) => setNewArea(e.target.value)}
                    />
                    <button
                      onClick={handleCreateArea}
                      disabled={cargandoArea || cargandoUpdateArea}
                      className="btn-crear-area"
                    >
                      {cargandoArea ? (
                        <>
                          <span style={{ marginLeft: 8 }}>Creando...</span>
                        </>
                      ) : (
                        "Crear"
                      )}
                    </button>

                    <button
                      onClick={handleUpdateArea}
                      disabled={!editArea.id || cargandoUpdateArea}
                      className="btn-guardar-edicion-area"
                    >
                      {cargandoUpdateArea
                        ? "Actualizando..."
                        : "Guardar edición"}
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
                            setNewArea(a.nombre_area);
                          }}
                          className={
                            editArea.id === a.id_area ? "fila-seleccionada" : ""
                          }
                        >
                          <td>{a.nombre_area}</td>
                          <td>
                            <button
                              className="btn-eliminar-area"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAreaToDelete(a.id_area);
                                setShowDeleteAreaModal(true);
                              }}
                              disabled={cargandoUpdateArea}
                            >
                              {a.id_area ? "Eliminar" : "Eliminando..."}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {showDeleteAreaModal && (
                  <div className="modal-container">
                    <div className="modal-content">
                      <p>¿Seguro que deseas eliminar esta área?</p>
                      <div className="modal-buttons">
                        <button
                          className="btn-confirm"
                          onClick={async () => {
                            setCargandoDeleteArea(true);
                            await handleDeleteArea(areaToDelete);
                            setCargandoDeleteArea(false);
                            setShowDeleteAreaModal(false);
                            setAreaToDelete(null);
                          }}
                          disabled={cargandoDeleteArea}
                        >
                          {cargandoDeleteArea ? (
                            <>
                              <span style={{ marginLeft: 8 }}>
                                Eliminando...
                              </span>
                            </>
                          ) : (
                            "Sí, eliminar"
                          )}
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => setShowDeleteAreaModal(false)}
                          disabled={cargandoDeleteArea}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="subcard">
                  <h4>Categorías</h4>
                  <div className="subrow">
                    <input
                      placeholder="Nueva categoría"
                      value={newCat}
                      onChange={(e) => setNewCat(e.target.value)}
                    />
                    <button
                      onClick={handleCreateCat}
                      disabled={cargandoCreateCat || cargandoUpdateCat}
                    >
                      {cargandoCreateCat ? "Creando..." : "Crear"}
                    </button>
                    <button
                      onClick={handleUpdateCat}
                      disabled={!editCat.id || cargandoUpdateCat}
                      className="btn-guardar-edicion-cat"
                    >
                      {cargandoUpdateCat ? (
                        <>
                          <span style={{ marginLeft: 8 }}>Actualizando...</span>
                        </>
                      ) : (
                        "Guardar edición"
                      )}
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
                            setNewCat(c.nombre_categoria);
                          }}
                          className={
                            editCat.id === c.id_categoria
                              ? "fila-seleccionada"
                              : ""
                          }
                        >
                          <td>{c.nombre_categoria}</td>
                          <td>
                            <button
                              className="btn-eliminar-area"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCatToDelete(c.id_categoria);
                                setShowDeleteCatModal(true);
                              }}
                              disabled={deletingCatId === c.id_categoria}
                            >
                              {deletingCatId === c.id_categoria ? (
                                <>
                                  <span style={{ marginLeft: 8 }}>
                                    Eliminando...
                                  </span>
                                </>
                              ) : (
                                "Eliminar"
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {showDeleteCatModal && (
                  <div className="modal-container">
                    <div className="modal-content">
                      <p>¿Eliminar esta categoría?</p>
                      <div className="modal-buttons">
                        <button
                          className="btn-confirm"
                          onClick={async () => {
                            await handleDeleteCat(catToDelete);
                            setShowDeleteCatModal(false);
                            setCatToDelete(null);
                          }}
                          disabled={deletingCatId === catToDelete}
                        >
                          {deletingCatId === catToDelete ? (
                            <>
                              <span style={{ marginLeft: 8 }}>
                                Eliminando...
                              </span>
                            </>
                          ) : (
                            "Sí, eliminar"
                          )}
                        </button>
                        <button
                          className="btn-cancel"
                          onClick={() => setShowDeleteCatModal(false)}
                          disabled={deletingCatId === catToDelete}
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
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

                    <input
                      type="number"
                      placeholder="Precio"
                      value={precio}
                      onChange={(e) => setPrecio(e.target.value)}
                      min="0"
                      max={1000}
                    />

                    <select
                      value={participantes}
                      onChange={(e) => setParticipantes(e.target.value)}
                    >
                      <option value="">Participantes</option>
                      <option value="Individual">Individual</option>
                      <option value="Duo">Duo</option>
                      <option value="Trio">Trío</option>
                      <option value="Cuarteto">Cuarteto</option>
                    </select>

                     <button onClick={handleAssignAreaCat}>Asignar</button>
                    <button onClick={handleUpdateAssignAreaCat} disabled={!selArea || !selCat}>
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
                      //disabled={!selArea || !selCat}
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
                        <th>Precio</th>
                        <th>Participantes</th>
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
                                  : String(c.grado_inicial_id)
                              );
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
                            <td>{c.precio ?? "N/A"}</td>
                            <td>{c.participantes ?? "N/A"}</td>
                            <td>
                              <button
                                className="btn-eliminar-area"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setClearIds({
                                    id_categoria: c.id_categoria,
                                    id_area: a.id_area,
                                  });
                                  setShowClearModal(true);
                                }}
                                disabled={loadingClear}
                              >
                                {loadingClear ? "Limpiando..." : "Limpiar"}
                              </button>
                              {showClearModal && (
                                <div className="modal-container">
                                  <div className="modal-content">
                                    <p>
                                      ¿Eliminar la relación y limpiar grados?
                                    </p>
                                    <div className="modal-buttons">
                                      <button
                                        className="btn-confirm"
                                        onClick={confirmClearGrades}
                                        disabled={loadingClear}
                                      >
                                        {loadingClear
                                          ? "Limpiando..."
                                          : "Sí, limpiar"}
                                      </button>
                                      <button
                                        className="btn-cancel"
                                        onClick={() => setShowClearModal(false)}
                                        disabled={loadingClear}
                                      >
                                        Cancelar
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              )}
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
              </>
            )}
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
