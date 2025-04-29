// src/pages/CrearConfigurarConvocatoria.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; // Importa useParams
import "../styles/ConfiguracionConvocatoria.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from '../api/axios';


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
      toast.success("Convocatoria creada con éxito!");
    }

    // Save the updated list back to localStorage
    localStorage.setItem("convocatorias", JSON.stringify(updatedConvocatorias));

    // Navigate back to the main configuration page after saving
    setTimeout(() => {
      navigate('/configuracion-convocatoria');
    }, 1500); // Espera 1.5 segundos antes de navegar
  };

  // Handler for the "Salir" button (does not save)
  const handleExit = () => {
    // Simply navigate back without saving
    toast.info("Cambios descartados.");
    navigate("/configuracion-convocatoria");
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
        {/* Use id to change header based on mode */}
        <div className="config-header">
          {id ? "Editar Convocatoria" : "Crear Nueva Convocatoria"}
        </div>
        <div className="config-body">
          {/* Secciones para Grados, Categorías, Áreas */}
          {/* Estas secciones son para configurar las listas globales, no la convocatoria específica */}
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
              {/* Added container for scroll */}
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
              {/* Added container for scroll */}
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
              {/* Added container for scroll */}
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
                      <th>Acciones</th> {/* <-- NUEVA COLUMNA */}
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
                            {/* Botón Eliminar Relación */}
                            <button
                              className="btn-danger"
                              type="button"
                              onClick={() => handleEliminarAsignacion(area.id_area, categoria.id_categoria)}
                              style={{ marginRight: "0.5rem" }}
                            >
                              Eliminar Relación
                            </button>

                            {/* Botón Limpiar Grados */}
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

                

          {/* Sección para configurar la Convocatoria específica */}
          {/* Esta sección usa los datos de las listas globales para definir el contenido de LA convocatoria */}
          <div className="card nueva-convocatoria">
            <h3>Datos de la convocatoria</h3> {/* Updated title */}
            {/* Formulario principal que se envía para guardar/actualizar la convocatoria */}
            <form onSubmit={handleSaveConvocatoria}>
              <div className="form-row">
                <label>
                  Nombre convocatoria:
                  <input
                    type="text"
                    value={nombreConv}
                    onChange={(e) => setNombreConv(e.target.value)}
                  />
                </label>
                {/* Descripción ahora está dentro del formulario principal */}
                <label className="descripcion-convocatoria">
                  {" "}
                  {/* Added class for potential styling */}
                  Descripción:
                  {/* La descripción es un campo fijo en el sentido de que siempre está presente en el formulario */}
                  <textarea
                    rows={4}
                    value={descConv}
                    onChange={(e) => setDescConv(e.target.value)}
                  />
                </label>
              </div>

              {/* Selección de áreas para agregar a la convocatoria */}
              <h4>Configurar Áreas de Evaluación para esta Convocatoria:</h4>
              <div className="form-row">
                <select
                  value={selAreaToAddId}
                  onChange={(e) => setSelAreaToAddId(e.target.value)}
                >
                  <option value="" disabled>
                    Selecciona área
                  </option>
                  {areas.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.nombre}
                    </option>
                  ))}
                </select>
                <select
                  value={selCategoriaToAddId}
                  onChange={(e) => setSelCategoriaToAddId(e.target.value)}
                >
                  <option value="" disabled>
                    Selecciona categoría
                  </option>
                  {categorias.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre}
                    </option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <select
                  value={selGradoInicialToAddId}
                  onChange={(e) => setSelGradoInicialToAddId(e.target.value)}
                >
                  <option value="" disabled>
                    Grado inicial
                  </option>
                  {grados.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
                <select
                  value={selGradoFinalToAddId}
                  onChange={(e) => setSelGradoFinalToAddId(e.target.value)}
                >
                  <option value="" disabled>
                    Grado final
                  </option>
                  {grados.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.nombre}
                    </option>
                  ))}
                </select>
                {/* Moved "Agregar" button outside the form-row for better layout control if needed */}
              </div>
              <button
                className="btn-primary"
                type="button"
                onClick={handleAgregarArea}
                style={{ marginTop: "10px" }}
              >
                Agregar Área a Convocatoria
              </button>

              {/* Tabla que muestra las áreas agregadas a la convocatoria */}
              {/* Esta tabla muestra el contenido que se guardará con LA convocatoria */}
              {convocatoriaAreas.length > 0 && (
                <div
                  className="tabla-convocatoria-areas-container"
                  style={{ marginTop: "20px" }}
                >
                  {" "}
                  {/* Added container for scroll */}
                  <h4>Áreas agregadas a esta Convocatoria:</h4>
                  <table className="tabla-convocatoria-areas">
                    <thead>
                      <tr>
                        <th>Área</th>
                        <th>Categoría</th>
                        <th>Grado</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {convocatoriaAreas.map((item, idx) => (
                        <tr key={idx}>
                          {" "}
                          {/* Using index as key is acceptable if list order doesn't change drastically */}
                          <td>{item.area}</td>
                          <td>{item.categoria}</td>
                          <td>
                            {item.gradoInicial === item.gradoFinal
                              ? item.gradoInicial
                              : `${item.gradoInicial} - ${item.gradoFinal}`}
                          </td>
                          <td>
                            <button
                              className="btn-remove"
                              type="button"
                              onClick={() => handleRemoveArea(idx)}
                            >
                              ×
                            </button>
                          </td>{" "}
                          {/* type="button" to prevent form submission */}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Botones de acción para la Convocatoria */}
              <div className="acciones-container" style={{ marginTop: "2rem" }}>
                {/* Submit button for the form */}
                <button className="btn-primary" type="submit">
                  {id
                    ? "Guardar cambios de Convocatoria"
                    : "Crear Convocatoria"}{" "}
                  {/* Change button text based on mode */}
                </button>
                {/* Salir button does not submit the form */}
                <button
                  className="btn-primary"
                  type="button"
                  onClick={handleExit}
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

export default CrearConfigurarConvocatoria;
