// src/pages/EditarConfigurarConvocatoria.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ConfiguracionConvocatoria.css';

const EditarConfigurarConvocatoria = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Obtiene el ID de la URL para saber qué convocatoria editar

  // Lists and inputs for creating/deleting list items (Grados, Categorias, Areas)
  // Consider if managing these lists is needed on the *edit* page or a separate config page
  const [grados, setGrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [newGrado, setNewGrado] = useState('');
  const [newCategoria, setNewCategoria] = useState('');
  const [newArea, setNewArea] = useState('');
  const [selGradoId, setSelGradoId] = useState(null); // Used for selecting rows in Grados table
  const [selCategoriaId, setSelCategoriaId] = useState(null); // Used for selecting rows in Categorias table
  const [selAreaId, setSelAreaId] = useState(null); // Used for selecting rows in Areas table


  // Data for the specific convocatoria being edited
  const [nombreConv, setNombreConv] = useState('');
  const [descConv, setDescConv] = useState('');
  const [convocatoriaAreas, setConvocatoriaAreas] = useState([]); // This will store the areas added to THIS convocatoria

  // State for adding areas to the convocatoria (using distinct names)
  const [selAreaToAddId, setSelAreaToAddId] = useState('');
  const [selCategoriaToAddId, setSelCategoriaToAddId] = useState('');
  const [selGradoInicialToAddId, setSelGradoInicialToAddId] = useState('');
  const [selGradoFinalToAddId, setSelGradoFinalToAddId] = useState('');


  // Load lists (Grados, Categorias, Areas) and the specific Convocatoria data on component mount
  useEffect(() => {
    // Load global lists
    setGrados(JSON.parse(localStorage.getItem('listaGrados')) || []);
    setCategorias(JSON.parse(localStorage.getItem('listaCategorias')) || []);
    setAreas(JSON.parse(localStorage.getItem('listaAreas')) || []);

    // Load the specific convocatoria data for editing
    const existingConvocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];
    // Find the convocatoria with the matching ID (parse ID from URL string)
    const convocatoriaToEdit = existingConvocatorias.find(conv => conv.id === parseInt(id)); // Using parseInt for robustness

    if (convocatoriaToEdit) {
      setNombreConv(convocatoriaToEdit.nombre);
      setDescConv(convocatoriaToEdit.descripcion);
      setConvocatoriaAreas(convocatoriaToEdit.areas || []); // Load the saved areas, default to empty array
    } else {
      // Handle case where ID is invalid or not found (e.g., redirect)
      console.error('Convocatoria not found for editing:', id);
      navigate('/configuracion-convocatoria'); // Redirect back to list if not found
    }
  }, [id, navigate]); // Depend on 'id' and 'navigate'

  // --- Handlers for managing Grados, Categorias, Areas Lists (Consider if needed here) ---
   // (Keeping them as they were in your original code)
  const handleCreateGrado = e => {
    e.preventDefault(); if (!newGrado.trim()) return; // Trim input
    const item = { id: Date.now(), nombre: newGrado.trim() };
    const updated = [...grados, item];
    setGrados(updated);
    localStorage.setItem('listaGrados', JSON.stringify(updated));
    setNewGrado('');
  };
  const handleDeleteGrado = e => {
    e.preventDefault(); if (!selGradoId) return;
    if (window.confirm(`¿Eliminar grado "${grados.find(g => g.id === selGradoId)?.nombre}"?`)) { // Added confirmation text
      const updated = grados.filter(g => g.id !== selGradoId);
      setGrados(updated);
      localStorage.setItem('listaGrados', JSON.stringify(updated));
      setSelGradoId(null);
    }
  };

  const handleCreateCategoria = e => {
    e.preventDefault(); if (!newCategoria.trim()) return; // Trim input
    const item = { id: Date.now(), nombre: newCategoria.trim() };
    const updated = [...categorias, item];
    setCategorias(updated);
    localStorage.setItem('listaCategorias', JSON.stringify(updated));
    setNewCategoria('');
  };
  const handleDeleteCategoria = e => {
    e.preventDefault(); if (!selCategoriaId) return;
    if (window.confirm(`¿Eliminar categoría "${categorias.find(c => c.id === selCategoriaId)?.nombre}"?`)) { // Added confirmation text
      const updated = categorias.filter(c => c.id !== selCategoriaId);
      setCategorias(updated);
      localStorage.setItem('listaCategorias', JSON.stringify(updated));
      setSelCategoriaId(null);
    }
  };

  const handleCreateArea = e => {
    e.preventDefault(); if (!newArea.trim()) return; // Trim input
    const item = { id: Date.now(), nombre: newArea.trim() };
    const updated = [...areas, item];
    setAreas(updated);
    localStorage.setItem('listaAreas', JSON.stringify(updated));
    setNewArea('');
  };
  const handleDeleteArea = e => {
    e.preventDefault(); if (!selAreaId) return;
    if (window.confirm(`¿Eliminar área "${areas.find(a => a.id === selAreaId)?.nombre}"?`)) { // Added confirmation text
      const updated = areas.filter(a => a.id !== selAreaId);
      setAreas(updated);
      localStorage.setItem('listaAreas', JSON.stringify(updated));
      setSelAreaId(null);
    }
  };

  // --- Handlers for managing Areas within the specific Convocatoria ---

  const handleAgregarArea = () => {
    // Check if required fields are selected using the "ToAdd" states
    if (!selAreaToAddId || !selCategoriaToAddId || !selGradoInicialToAddId || !selGradoFinalToAddId) {
        alert('Completa todos los campos para agregar un área a la convocatoria.');
        return;
    }

    // Find the actual names using the selected IDs
    const area = areas.find(a => a.id === parseInt(selAreaToAddId));
    const cat = categorias.find(c => c.id === parseInt(selCategoriaToAddId));
    const gradoI = grados.find(g => g.id === parseInt(selGradoInicialToAddId));
    const gradoF = grados.find(g => g.id === parseInt(selGradoFinalToAddId));

     // Basic validation for grade range
     const gradoInicialIndex = grados.findIndex(g => g.id === parseInt(selGradoInicialToAddId));
     const gradoFinalIndex = grados.findIndex(g => g.id === parseInt(selGradoFinalToAddId));

     if (gradoInicialIndex === -1 || gradoFinalIndex === -1) {
         alert('Error encontrando grados seleccionados. Por favor, recarga la página.');
         return; // Should not happen if lists are loaded, but good check
     }

     if (gradoInicialIndex > gradoFinalIndex) {
         alert('El Grado Inicial no puede ser mayor que el Grado Final.');
         return;
     }


    // Create the new entry for the convocatoriaAreas list
    const entry = {
      area: area.nombre,
      categoria: cat.nombre,
      gradoInicial: gradoI.nombre,
      gradoFinal: gradoF.nombre
      // Optional: Store IDs as well for more robust data integrity, useful if list names change
      // areaId: parseInt(selAreaToAddId),
      // categoriaId: parseInt(selCategoriaToAddId),
      // gradoInicialId: parseInt(selGradoInicialToAddId),
      // gradoFinalId: parseInt(selGradoFinalToAddId)
    };

    // Add the new entry to the convocatoriaAreas state
    setConvocatoriaAreas([...convocatoriaAreas, entry]);

    // Reset the select inputs after adding
    setSelAreaToAddId('');
    setSelCategoriaToAddId('');
    setSelGradoInicialToAddId('');
    setSelGradoFinalToAddId('');
  };

  const handleRemoveArea = (idx) => {
    // Filter out the item by its index
    setConvocatoriaAreas(convocatoriaAreas.filter((_, i) => i !== idx));
  };

  // --- Handler for Saving the updated Convocatoria ---

  const handleActualizarConvocatoria = (e) => {
    e.preventDefault(); // Prevent default form submission (page reload)

    // Basic validation for the convocatoria itself
    if (!nombreConv.trim()) {
      alert('Ingresa el nombre de la convocatoria.');
      return;
    }
    // Optional: Add validation for description and areas if needed
    // if (!descConv.trim()) {
    //     alert('Ingresa la descripción de la convocatoria.');
    //     return;
    // }
     if (convocatoriaAreas.length === 0) {
         alert('Agrega al menos un área a la convocatoria.');
         return;
     }


    const existingConvocatorias = JSON.parse(localStorage.getItem('convocatorias')) || [];

    // Map through existing convocatorias to find and update the target one
    const updatedConvocatorias = existingConvocatorias.map(conv =>
      conv.id === parseInt(id) // Use parseInt for ID comparison
        ? { // Update its properties with current state values
            ...conv,
            nombre: nombreConv.trim(), // Trim input
            descripcion: descConv.trim(), // Trim input
            areas: convocatoriaAreas // Save the current state of convocatoriaAreas
          }
        : conv // Keep other convocatorias as they are
    );

    // Save the updated list back to localStorage
    localStorage.setItem('convocatorias', JSON.stringify(updatedConvocatorias));

    alert('Convocatoria actualizada con éxito!'); // User feedback

    // Navigate back to the main configuration page after saving
    navigate('/configuracion-convocatoria');
  };

   // Handler for the "Salir" button (does not save)
  const handleExit = () => {
    // Simply navigate back without saving
    navigate('/configuracion-convocatoria');
  };


  return (
    <div className="config-page">
      <div className="config-container">
        <div className="config-header">Editar Convocatoria</div> {/* Static header for Edit page */}
        <div className="config-body">

          {/* Secciones para Grados, Categorías, Áreas */}
          {/* Consider moving these list management sections to a separate page if they are not directly part of editing a specific convocatoria */}
          <div className="card">
            <h3>Lista de grados</h3>
            <form className="form-row" onSubmit={handleCreateGrado}>
              <input placeholder="Nombre de grado" value={newGrado} onChange={e => setNewGrado(e.target.value)} />
              <button className="btn-primary" type="submit">Crear</button>
              <button className="btn-primary" onClick={handleDeleteGrado} disabled={!selGradoId}>Eliminar</button>
            </form>
            <div className="tabla-lista-container"> {/* Added container for scroll */}
              <table className="tabla-lista">
                <thead><tr><th>ID</th><th>Nombre</th></tr></thead>
                <tbody>
                  {grados.map(g => (
                    <tr
                      key={g.id}
                      onClick={()=>setSelGradoId(g.id)}
                      className={selGradoId===g.id?'fila-seleccionada':''}
                    >
                      <td>{g.id}</td><td>{g.nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
             </div>
          </div>

          <div className="card">
            <h3>Lista de categorías</h3>
            <form className="form-row" onSubmit={handleCreateCategoria}>
              <input placeholder="Nombre de categoría" value={newCategoria} onChange={e => setNewCategoria(e.target.value)} />
              <button className="btn-primary" type="submit">Crear</button>
              <button className="btn-primary" onClick={handleDeleteCategoria} disabled={!selCategoriaId}>Eliminar</button>
            </form>
             <div className="tabla-lista-container"> {/* Added container for scroll */}
              <table className="tabla-lista">
                <thead><tr><th>ID</th><th>Nombre</th></tr></thead>
                <tbody>
                  {categorias.map(c => (
                    <tr
                      key={c.id}
                      onClick={()=>setSelCategoriaId(c.id)}
                      className={selCategoriaId===c.id?'fila-seleccionada':''}
                    >
                      <td>{c.id}</td><td>{c.nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3>Lista de áreas</h3>
            <form className="form-row" onSubmit={handleCreateArea}>
              <input placeholder="Nombre de área" value={newArea} onChange={e => setNewArea(e.target.value)} />
              <button className="btn-primary" type="submit">Crear</button>
              <button className="btn-primary" onClick={handleDeleteArea} disabled={!selAreaId}>Eliminar</button>
            </form>
             <div className="tabla-lista-container"> {/* Added container for scroll */}
              <table className="tabla-lista">
                <thead><tr><th>ID</th><th>Nombre</th></tr></thead>
                <tbody>
                  {areas.map(a => (
                    <tr
                      key={a.id}
                      onClick={()=>setSelAreaId(a.id)}
                      className={selAreaId===a.id?'fila-seleccionada':''}
                    >
                      <td>{a.id}</td><td>{a.nombre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Sección para configurar la Convocatoria específica (datos cargados para edición) */}
          <div className="card nueva-convocatoria"> {/* Keeping class name for styling */}
            <h3>Datos de la convocatoria</h3> {/* Updated title */}
            {/* Formulario principal que se envía para actualizar la convocatoria */}
            <form onSubmit={handleActualizarConvocatoria}>
              <div className="form-row">
                <label>
                  Nombre convocatoria:
                  <input type="text" value={nombreConv} onChange={e=>setNombreConv(e.target.value)} />
                </label>
                 {/* Descripción ahora está dentro del formulario principal */}
                <label className="descripcion-convocatoria"> {/* Added class for potential styling */}
                  Descripción:
                   {/* La descripción es un campo fijo en el sentido de que siempre está presente */}
                  <textarea rows={4} className="fixed-desc" value={descConv} onChange={e=>setDescConv(e.target.value)} />
                </label>
              </div>

              {/* Selección de áreas para agregar a la convocatoria */}
               <h4>Configurar Áreas de Evaluación para esta Convocatoria:</h4>
              <div className="form-row">
                {/* Using distinct states for selecting areas to ADD to the convocatoria */}
                <select value={selAreaToAddId} onChange={e=>setSelAreaToAddId(e.target.value)}>
                  <option value="" disabled>Selecciona área</option>
                  {areas.map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
                <select value={selCategoriaToAddId} onChange={e=>setSelCategoriaToAddId(e.target.value)}>
                  <option value="" disabled>Selecciona categoría</option>
                  {categorias.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="form-row">
                 {/* Using distinct states for selecting grades to ADD to the convocatoria */}
                <select value={selGradoInicialToAddId} onChange={e=>setSelGradoInicialToAddId(e.target.value)}>
                  <option value="" disabled>Grado inicial</option>
                  {grados.map(g=><option key={g.id} value={g.id}>{g.nombre}</option>)}
                </select>
                <select value={selGradoFinalToAddId} onChange={e=>setSelGradoFinalToAddId(e.target.value)}>
                  <option value="" disabled>Grado final</option>
                  {grados.map(g=><option key={g.id} value={g.id}>{g.nombre}</option>)}
                </select>
              </div>
               {/* Moved "Agregar" button outside the form-row */}
              <button className="btn-primary" type="button" onClick={handleAgregarArea} style={{marginTop:'10px'}}>Agregar Área a Convocatoria</button>


              {/* Tabla que muestra las áreas agregadas a la convocatoria (cargadas de la convocatoria guardada) */}
               {convocatoriaAreas.length > 0 && ( // Only show table if there are areas
                <div className="tabla-convocatoria-areas-container" style={{ marginTop: '20px' }}> {/* Added container for scroll */}
                     <h4>Áreas agregadas a esta Convocatoria:</h4>
                    <table className="tabla-convocatoria-areas">
                      <thead>
                        <tr><th>Área</th><th>Categoría</th><th>Grado</th><th></th></tr>
                      </thead>
                      <tbody>
                        {/* Map over the loaded/modified convocatoriaAreas state */}
                        {convocatoriaAreas.map((item,idx)=>(
                          <tr key={idx}> {/* Using index as key if list order doesn't change drastically */}
                            <td>{item.area}</td>
                            <td>{item.categoria}</td>
                             {/* Display grade range */}
                            <td>{item.gradoInicial===item.gradoFinal?item.gradoInicial:`${item.gradoInicial} - ${item.gradoFinal}`}</td>
                             {/* type="button" to prevent form submission */}
                            <td><button className="btn-remove" type="button" onClick={()=>handleRemoveArea(idx)}>×</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                 </div>
              )}


              {/* Botones de acción para la Convocatoria */}
              <div className="acciones-container" style={{marginTop:'2rem'}}>
                 {/* Submit button for the form */}
                <button className="btn-primary" type="submit">Actualizar convocatoria</button>
                 {/* Salir button does not submit the form */}
                <button className="btn-primary" type="button" onClick={handleExit}>Salir</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarConfigurarConvocatoria;