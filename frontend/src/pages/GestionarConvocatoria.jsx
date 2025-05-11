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
      await api.post(`/area-crear/${id_convocatoria}`, {
        nombre: newArea.trim(),
        id_convocatoria: Number(id_convocatoria),
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
        nombre_area: editArea.nombre_area,
        activo: editArea.activo,
      });
      toast.success("Área actualizada");
      setEditArea({ id: null, nombre_area: "" });
      loadAll();
    } catch (err) {
      console.error(err);
      toast.error("Error al editar área.");
    }
  };

  const handleDeleteArea = async (id) => {
    if (!window.confirm("¿Eliminar esta área?")) return;
    await api.delete(`/area-eliminar/${id}`);
    toast.error("Área eliminada");
    loadAll();
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
    await api.post(`/categoria-editar`, {
      id_categoria: editCat.id,
      nombre_categoria: editCat.nombre_categoria,
    });
    toast.success("Categoría actualizada");
    setEditCat({ id: null, nombre_categoria: "" });
    loadAll();
  };

  const handleDeleteCat = async (id) => {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    await api.delete(`/categoria-eliminar/${id}`);
    toast.error("Categoría eliminada");
    loadAll();
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
    await api.post(`/asignar-grados-categoria`, {
      id_categoria: Number(selCat),
      grado_inicial_id: Number(selGrIni),
      grado_final_id: selGrFin ? Number(selGrFin) : null,
    });
    toast.success("Grados asignados a categoría");
    loadAll();
  };

  const handleClearGrades = async (catId) => {
    if (!window.confirm("¿Limpiar grados de esta categoría?")) return;
    await api.post("/limpiar-grados-categoria", { id_categoria: catId });
    toast.success("Grados limpiados");
    loadAll();
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
                      onClick={() =>
                        setEditArea({
                          id: a.id_area,
                          nombre_area: a.nombre_area,
                        })
                      }
                      className={
                        editArea.id === a.id_area ? "fila-seleccionada" : ""
                      }
                    >
                      <td>{a.nombre_area}</td>
                      <td>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
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
                      onClick={() =>
                        setEditCat({
                          id: c.id_categoria,
                          nombre_categoria: c.nombre_categoria,
                        })
                      }
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
                    (a.categoria || []).map((c, j) => (
                      <tr key={`${i}-${j}`}>
                        <td>{a.nombre_area}</td>
                        <td>{c.nombre_categoria}</td>
                        <td>
                          {c.grado_final_nombre &&
                          c.grado_final_nombre !== c.grado_inicial_nombre
                            ? `${c.grado_inicial_nombre} – ${c.grado_final_nombre}`
                            : c.grado_inicial_nombre}
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
/*
const CrearConfigurarConvocatoria = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID de la URL para modo edición

  // Lists and inputs for creating/deleting list items (Grados, Categorias, Areas)
  const [grados, setGrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [newGrado, setNewGrado] = useState("");
  const [newCategoria, setNewCategoria] = useState("");
  const [newArea, setNewArea] = useState("");
  const [selGradoId, setSelGradoId] = useState(null);
  const [selCategoriaId, setSelCategoriaId] = useState(null);
  const [selAreaId, setSelAreaId] = useState(null);

  // Data for the specific convocatoria being created/edited
  const [nombreConv, setNombreConv] = useState("");
  const [descConv, setDescConv] = useState("");
  const [convocatoriaAreas, setConvocatoriaAreas] = useState([]); // This will store the areas added to THIS convocatoria

  // State for adding areas to the convocatoria
  const [selAreaToAddId, setSelAreaToAddId] = useState("");
  const [selCategoriaToAddId, setSelCategoriaToAddId] = useState("");
  const [selGradoInicialToAddId, setSelGradoInicialToAddId] = useState("");
  const [selGradoFinalToAddId, setSelGradoFinalToAddId] = useState("");
  const [areasCategoriasGrados, setAreasCategoriasGrados] = useState([]);

  // Para asignar Área con Categoría
  const [selectedAreaId, setSelectedAreaId] = useState('');
  const [selectedCategoriaIdArea, setSelectedCategoriaIdArea] = useState('');
 // Para asignar Grados a Categoría
  const [selectedCategoriaIdGrado, setSelectedCategoriaIdGrado] = useState('');
  const [selectedGradoIniId, setSelectedGradoIniId] = useState('');
  const [selectedGradoFinId, setSelectedGradoFinId] = useState('');
  

  const fetchDatos = async () => {
    try {
      const [gradosRes, categoriasRes, areasRes, areasCategoriasGradosRes] = await Promise.all([
        api.get('/grados'),
        api.get('/categorias'),
        api.get('/areas'),
        api.get('/areas-categorias-grados'), // NUEVO ENDPOINT
      ]);
  
      setGrados(gradosRes.data);
      setCategorias(categoriasRes.data);
      setAreas(areasRes.data);
      setAreasCategoriasGrados(areasCategoriasGradosRes.data); // Guarda la nueva estructura
    } catch (error) {
      console.error('Error recargando datos:', error);
      toast.error('Error recargando datos.');
    }
  };
  
  

  useEffect(() => {
    fetchDatos();
  }, []);

  
  const handleCreateGrado = async (e) => {
    e.preventDefault();
    if (!newGrado.trim()) return;
    try {
      const res = await api.post('/grado-crear', { nombre: newGrado.trim() });
      toast.success('Grado creado exitosamente.');
      setGrados([...grados, res.data.grado]);
      setNewGrado("");
      fetchDatos(); //recarga la lista
    } catch (error) {
      console.error(error);
      toast.error('Error al crear grado.');
    }
  };
  

  const handleDeleteGrado = async (e) => {
    e.preventDefault();
    if (!selGradoId) return;
  
    if (window.confirm(`¿Eliminar grado seleccionado?`)) {
      try {
        await api.delete(`/grado-eliminar/${selGradoId}`);
        toast.success('Grado eliminado exitosamente.');
        setGrados(grados.filter((g) => g.id_grado !== selGradoId));
        setSelGradoId(null);
        fetchDatos(); //recarga la lista
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar grado.');
      }
    }
  };
  
  const handleCreateCategoria = async (e) => {
    e.preventDefault();
    if (!newCategoria.trim()) return;
  
    try {
      const res = await api.post('/categoria-crear', { nombre_categoria: newCategoria.trim() });
      toast.success('Categoría creada exitosamente.');
      setCategorias([...categorias, res.data.categoria]);
      setNewCategoria("");
      fetchDatos(); //recarga la lista
    } catch (error) {
      console.error(error);
      toast.error('Error al crear categoría.');
    }
  };
  

  const handleDeleteCategoria = async (e) => {
    e.preventDefault();
    if (!selCategoriaId) return;
  
    if (window.confirm(`¿Eliminar categoría seleccionada?`)) {
      try {
        await api.delete(`/categoria-eliminar/${selCategoriaId}`);
        toast.success('Categoría eliminada exitosamente.');
        setCategorias(categorias.filter((c) => c.id_categoria !== selCategoriaId));
        setSelCategoriaId(null);
        fetchDatos(); //recarga la lista
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar categoría.');
      }
    }
  };
  
  const handleCreateArea = async (e) => {
    e.preventDefault();
    if (!newArea.trim()) return;
  
    try {
      const res = await api.post('/area-crear', { nombre: newArea.trim() });
      toast.success('Área creada exitosamente.');
      setAreas([...areas, res.data.area]);
      setNewArea("");
      fetchDatos(); //recarga la lista
    } catch (error) {
      console.error(error);
      toast.error('Error al crear área.');
    }
  };
  
  const handleDeleteArea = async (e) => {
    e.preventDefault();
    if (!selAreaId) return;
  
    if (window.confirm(`¿Eliminar área seleccionada?`)) {
      try {
        await api.delete(`/area-eliminar/${selAreaId}`);
        toast.success('Área eliminada exitosamente.');
        setAreas(areas.filter((a) => a.id_area !== selAreaId));
        setSelAreaId(null);
        fetchDatos(); //recarga la lista
      } catch (error) {
        console.error(error);
        toast.error('Error al eliminar área.');
      }
    }
  };
  
  const handleAsignarAreaCategoria = async () => {
    if (!selectedAreaId || !selectedCategoriaIdArea) {
      toast.warn('Selecciona un área y una categoría.');
      return;
    }
  
    try {
      await api.post('/asignar-area-categoria', {
        id_area: parseInt(selectedAreaId),
        id_categoria: parseInt(selectedCategoriaIdArea),
      });
      toast.success('Área y Categoría asignadas correctamente.');
      fetchDatos();
      setSelectedAreaId('');
      setSelectedCategoriaIdArea('');
    } catch (error) {
      console.error(error);
      toast.error('Error al asignar área a categoría.');
    }
  };
  
  const handleAsignarGradosCategoria = async () => {
    if (!selectedCategoriaIdGrado || !selectedGradoIniId || !selectedGradoFinId) {
      toast.warn('Selecciona categoría, grado inicial y grado final.');
      return;
    }
  
    try {
      await api.post('/asignar-grados-categoria', {
        id_categoria: parseInt(selectedCategoriaIdGrado),
        grado_inicial_id: parseInt(selectedGradoIniId),
        grado_final_id: parseInt(selectedGradoFinId),
      });
      toast.success('Grados asignados a Categoría correctamente.');
      fetchDatos();
      setSelectedCategoriaIdGrado('');
      setSelectedGradoIniId('');
      setSelectedGradoFinId('');
    } catch (error) {
      console.error(error);
      toast.error('Error al asignar grados a categoría.');
    }
  };
  
  


  // --- Handlers for managing Areas within the specific Convocatoria ---

  const handleAgregarArea = () => {
    // Check if required fields are selected
    if (
      !selAreaToAddId ||
      !selCategoriaToAddId ||
      !selGradoInicialToAddId ||
      !selGradoFinalToAddId
    ) {
      toast.warn('Completa todos los campos para agregar un área a la convocatoria.');

      return;
    }

    // Find the actual names using the selected IDs
    const area = areas.find((a) => a.id === parseInt(selAreaToAddId));
    const cat = categorias.find((c) => c.id === parseInt(selCategoriaToAddId));
    const gradoI = grados.find(
      (g) => g.id === parseInt(selGradoInicialToAddId)
    );
    const gradoF = grados.find((g) => g.id === parseInt(selGradoFinalToAddId));

    // Basic validation for grade range
    const gradoInicialIndex = grados.findIndex(
      (g) => g.id === parseInt(selGradoInicialToAddId)
    );
    const gradoFinalIndex = grados.findIndex(
      (g) => g.id === parseInt(selGradoFinalToAddId)
    );

    if (gradoInicialIndex > gradoFinalIndex) {
      toast.warn('El Grado Inicial no puede ser mayor que el Grado Final.');
      return;
    }

    // Create the new entry for the convocatoriaAreas list
    const entry = {
      area: area.nombre,
      categoria: cat.nombre,
      gradoInicial: gradoI.nombre,
      gradoFinal: gradoF.nombre,
      // Optional: Store IDs as well for more robust data integrity
      // areaId: parseInt(selAreaToAddId),
      // categoriaId: parseInt(selCategoriaToAddId),
      // gradoInicialId: parseInt(selGradoInicialToAddId),
      // gradoFinalId: parseInt(selGradoFinalToAddId)
    };

    // Add the new entry to the convocatoriaAreas state
    setConvocatoriaAreas([...convocatoriaAreas, entry]);

    // Reset the select inputs after adding
    setSelAreaToAddId("");
    setSelCategoriaToAddId("");
    setSelGradoInicialToAddId("");
    setSelGradoFinalToAddId("");
    toast.success('Área agregada correctamente.');
  };

  const handleRemoveArea = (idx) => {
    // Filter out the item by its index
    setConvocatoriaAreas(convocatoriaAreas.filter((_, i) => i !== idx));
  };

  // --- Handler for Saving the entire Convocatoria ---

  const handleSaveConvocatoria = (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    // Basic validation for the convocatoria itself
    if (!nombreConv.trim()) {
      toast.warn('Ingresa el nombre de la convocatoria.');
      return;
    }
    // Optional: Add validation for description and areas if needed
    // if (!descConv.trim()) {
    //     alert('Ingresa la descripción de la convocatoria.');
    //     return;
    // }
    // if (convocatoriaAreas.length === 0) {
    //      alert('Agrega al menos un área a la convocatoria.');
    //      return;
    // }

    const existingConvocatorias =
      JSON.parse(localStorage.getItem("convocatorias")) || [];
    let updatedConvocatorias;

    if (id) {
      // --- Edit Mode ---
      updatedConvocatorias = existingConvocatorias.map(
        (conv) =>
          // Find the convocatoria being edited by its ID
          conv.id === parseInt(id)
            ? {
                // Update its properties
                ...conv,
                nombre: nombreConv.trim(),
                descripcion: descConv.trim(),
                areas: convocatoriaAreas, // Save the current state of convocatoriaAreas
              }
            : conv // Keep other convocatorias as they are
      );
      toast.success("Convocatoria actualizada con éxito!");
    } else {
      // --- Create Mode ---

      // Check if a convocatoria already exists (the one-convocatoria restriction)
      if (existingConvocatorias.length > 0) {
        alert(
          "Ya existe una convocatoria. Debes eliminar la convocatoria existente para crear una nueva."
        );
        return; // Stop the creation process
      }

      // Create a new convocatoria object
      const newConvocatoria = {
        id: Date.now(), // Use timestamp for a simple unique ID
        nombre: nombreConv.trim(),
        descripcion: descConv.trim(),
        areas: convocatoriaAreas, // Save the added areas with the new convocatoria
      };
      // Add the new convocatoria to the list
      updatedConvocatorias = [...existingConvocatorias, newConvocatoria];
      
    }

    // Save the updated list back to localStorage
    localStorage.setItem("convocatorias", JSON.stringify(updatedConvocatorias));

    navigate('/configuracion-convocatoria', { state: { message: 'Convocatoria creado con éxito.', type: 'success' } });

  };

  // Handler for the "Salir" button (does not save)
  const handleExit = () => {
    // Simply navigate back without saving
    toast.info("Cambios descartados.");
    navigate("/");
  };
  const handleEliminarAsignacion = async (idArea, idCategoria) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta relación Área-Categoría?')) return;
  
    try {
      await api.delete('/eliminar-area-categoria', {
        data: {
          id_area: idArea,
          id_categoria: idCategoria,
        },
      });
      toast.success('Relación eliminada correctamente.');
      fetchDatos();
    } catch (error) {
      console.error(error);
      toast.error('Error al eliminar la relación.');
    }
  };
  const handleLimpiarGrados = async (idCategoria) => {
    if (!window.confirm('¿Seguro que deseas limpiar los grados de esta categoría?')) return;
  
    try {
      await api.post('/limpiar-grados-categoria', {
        id_categoria: idCategoria,
      });
      toast.success('Grados limpiados correctamente.');
      fetchDatos();
    } catch (error) {
      console.error(error);
      toast.error('Error al limpiar grados.');
    }
  };
    


  return (
    <div className="config-page">
      <div className="config-container">
         Use id to change header based on mode 
        <div className="config-header">
          {id ? "Editar Convocatoria" : "Crear Nueva Convocatoria"}
        </div>
        <div className="config-body">
           <div className="card">
            <h3>Lista de grados</h3>
            <form className="form-row" onSubmit={handleCreateGrado}>
              <input
                placeholder="Nombre de grado"
                value={newGrado}
                onChange={(e) => setNewGrado(e.target.value)}
              />
              <button className="btn-primary" type="submit">
                Crear
              </button>
              <button
                className="btn-primary"
                onClick={handleDeleteGrado}
                disabled={!selGradoId}
              >
                Eliminar
              </button>
            </form>
            <div className="tabla-lista-container">
              {" "}
              <table className="tabla-lista">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {grados.map((g) => (
                    <tr
                      key={g.id_grado}
                      onClick={() => setSelGradoId(g.id_grado)}
                      className={selGradoId === g.id_grado ? "fila-seleccionada" : ""}
                    >
                      <td>{g.id_grado}</td>
                      <td>{g.nombre_grado}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3>Lista de categorías</h3>
            <form className="form-row" onSubmit={handleCreateCategoria}>
              <input
                placeholder="Nombre de categoría"
                value={newCategoria}
                onChange={(e) => setNewCategoria(e.target.value)}
              />
              <button className="btn-primary" type="submit">
                Crear
              </button>
              <button
                className="btn-primary"
                onClick={handleDeleteCategoria}
                disabled={!selCategoriaId}
              >
                Eliminar
              </button>
            </form>
            <div className="tabla-lista-container">
              {" "}
              <table className="tabla-lista">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {categorias.map((c) => (
                    <tr
                      key={c.id_categoria}
                      onClick={() => setSelCategoriaId(c.id_categoria)}
                      className={
                        selCategoriaId === c.id_categoria ? "fila-seleccionada" : ""
                      }
                    >
                      <td>{c.id_categoria}</td>
                      <td>{c.nombre_categoria}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3>Lista de áreas</h3>
            <form className="form-row" onSubmit={handleCreateArea}>
              <input
                placeholder="Nombre de área"
                value={newArea}
                onChange={(e) => setNewArea(e.target.value)}
              />
              <button className="btn-primary" type="submit">
                Crear
              </button>
              <button
                className="btn-primary"
                onClick={handleDeleteArea}
                disabled={!selAreaId}
              >
                Eliminar
              </button>
            </form>
            <div className="tabla-lista-container">
              {" "}
              <table className="tabla-lista">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                  </tr>
                </thead>
                <tbody>
                  {areas.map((a) => (
                    <tr
                      key={a.id_area}
                      onClick={() => setSelAreaId(a.id_area)}
                      className={selAreaId === a.id_area ? "fila-seleccionada" : ""}
                    >
                      <td>{a.id_area}</td>
                      <td>{a.nombre_area}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

           <div className="card">
              <h3>Áreas, Categorías y Grados</h3>
              <div className="tabla-lista-container">
                <table className="tabla-lista">
                  <thead>
                    <tr>
                      <th>Área</th>
                      <th>Categoría</th>
                      <th>Grado(s)</th>
                      <th>Acciones</th> 
                    </tr>
                  </thead>
                  <tbody>
                    {areasCategoriasGrados.map((area) =>
                      area.categorias.map((categoria, idx) => (
                        <tr key={`${area.id_area}-${categoria.id_categoria}-${idx}`}>
                          <td>{area.nombre_area}</td>
                          <td>{categoria.nombre_categoria}</td>
                          <td>
                            {categoria.grado_inicial_nombre
                              ? categoria.grado_final_nombre
                                ? `${categoria.grado_inicial_nombre} - ${categoria.grado_final_nombre}`
                                : categoria.grado_inicial_nombre
                              : 'No asignado'}
                          </td>
                          <td>
                            <button
                              className="btn-danger"
                              type="button"
                              onClick={() => handleEliminarAsignacion(area.id_area, categoria.id_categoria)}
                              style={{ marginRight: "0.5rem" }}
                            >
                              Eliminar Relación
                            </button>

                            <button
                              className="btn-warning"
                              type="button"
                              onClick={() => handleLimpiarGrados(categoria.id_categoria)}
                            >
                              Limpiar Grados
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          
          

            <div style={{ marginTop: '2rem' }}>
              <h4>Asignar Área a Categoría:</h4>
              <div className="form-row">
                <select value={selectedAreaId} onChange={(e) => setSelectedAreaId(e.target.value)}>
                  <option value="">Selecciona Área</option>
                  {areas.map((a) => (
                    <option key={a.id_area} value={a.id_area}>
                      {a.nombre_area}
                    </option>
                  ))}
                </select>

                <select value={selectedCategoriaIdArea} onChange={(e) => setSelectedCategoriaIdArea(e.target.value)}>
                  <option value="">Selecciona Categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>

              <button className="btn-primary" type="button" onClick={handleAsignarAreaCategoria} style={{ marginTop: '10px' }}>
                Asignar Área a Categoría
              </button>
            </div>

            <div style={{ marginTop: '3rem' }}>
              <h4>Asignar Grados a Categoría:</h4>
              <div className="form-row">
                <select value={selectedCategoriaIdGrado} onChange={(e) => setSelectedCategoriaIdGrado(e.target.value)}>
                  <option value="">Selecciona Categoría</option>
                  {categorias.map((c) => (
                    <option key={c.id_categoria} value={c.id_categoria}>
                      {c.nombre_categoria}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <select value={selectedGradoIniId} onChange={(e) => setSelectedGradoIniId(e.target.value)}>
                  <option value="">Grado Inicial</option>
                  {grados.map((g) => (
                    <option key={g.id_grado} value={g.id_grado}>
                      {g.nombre_grado}
                    </option>
                  ))}
                </select>

                <select value={selectedGradoFinId} onChange={(e) => setSelectedGradoFinId(e.target.value)}>
                  <option value="">Grado Final</option>
                  {grados.map((g) => (
                    <option key={g.id_grado} value={g.id_grado}>
                      {g.nombre_grado}
                    </option>
                  ))}
                </select>
              </div>

              <button className="btn-primary" type="button" onClick={handleAsignarGradosCategoria} style={{ marginTop: '10px' }}>
                Asignar Grados a Categoría
              </button>
            </div>
            <div className="acciones-container" style={{ marginTop: "2rem" }}>
                <button
                  className="btn-primary"
                  type="button"
                  onClick={handleExit}
                >
                  Salir
                </button>
              </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};
*/