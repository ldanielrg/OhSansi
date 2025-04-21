// src/pages/EditarConfigurarConvocatoria.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ConfiguracionConvocatoria.css';

const EditarConfigurarConvocatoria = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  // Lists and inputs
  const [grados, setGrados] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [areas, setAreas] = useState([]);
  const [newGrado, setNewGrado] = useState('');
  const [newCategoria, setNewCategoria] = useState('');
  const [newArea, setNewArea] = useState('');
  const [selGradoId, setSelGradoId] = useState(null);
  const [selCategoriaId, setSelCategoriaId] = useState(null);
  const [selAreaId, setSelAreaId] = useState(null);
  const [selGradoInicial, setSelGradoInicial] = useState('');
  const [selGradoFinal, setSelGradoFinal] = useState('');

  // Convocatoria data
  const [nombreConv, setNombreConv] = useState('');
  const [descConv, setDescConv] = useState('');
  const [convocatoriaAreas, setConvocatoriaAreas] = useState([]);

  // Load lists & convocatoria
  useEffect(() => {
    setGrados(JSON.parse(localStorage.getItem('listaGrados')) || []);
    setCategorias(JSON.parse(localStorage.getItem('listaCategorias')) || []);
    setAreas(JSON.parse(localStorage.getItem('listaAreas')) || []);
    const arr = JSON.parse(localStorage.getItem('convocatorias')) || [];
    const conv = arr.find(c => c.id === +id);
    if (conv) {
      setNombreConv(conv.nombre);
      setDescConv(conv.descripcion);
      setConvocatoriaAreas(conv.areas);
    }
  }, [id]);

  // Handlers for lists (same as Crear)
  const handleCreateGrado = e => {
    e.preventDefault(); if (!newGrado) return;
    const item = { id: Date.now(), nombre: newGrado };
    const updated = [...grados, item];
    setGrados(updated);
    localStorage.setItem('listaGrados', JSON.stringify(updated));
    setNewGrado('');
  };
  const handleDeleteGrado = e => {
    e.preventDefault(); if (!selGradoId) return;
    if (window.confirm('Eliminar grado?')) {
      const updated = grados.filter(g => g.id !== selGradoId);
      setGrados(updated);
      localStorage.setItem('listaGrados', JSON.stringify(updated));
      setSelGradoId(null);
    }
  };

  const handleCreateCategoria = e => {
    e.preventDefault(); if (!newCategoria) return;
    const item = { id: Date.now(), nombre: newCategoria };
    const updated = [...categorias, item];
    setCategorias(updated);
    localStorage.setItem('listaCategorias', JSON.stringify(updated));
    setNewCategoria('');
  };
  const handleDeleteCategoria = e => {
    e.preventDefault(); if (!selCategoriaId) return;
    if (window.confirm('Eliminar categoría?')) {
      const updated = categorias.filter(c => c.id !== selCategoriaId);
      setCategorias(updated);
      localStorage.setItem('listaCategorias', JSON.stringify(updated));
      setSelCategoriaId(null);
    }
  };

  const handleCreateArea = e => {
    e.preventDefault(); if (!newArea) return;
    const item = { id: Date.now(), nombre: newArea };
    const updated = [...areas, item];
    setAreas(updated);
    localStorage.setItem('listaAreas', JSON.stringify(updated));
    setNewArea('');
  };
  const handleDeleteArea = e => {
    e.preventDefault(); if (!selAreaId) return;
    if (window.confirm('Eliminar área?')) {
      const updated = areas.filter(a => a.id !== selAreaId);
      setAreas(updated);
      localStorage.setItem('listaAreas', JSON.stringify(updated));
      setSelAreaId(null);
    }
  };

  // Add area to convocatoria
  const handleAgregarArea = () => {
    if (!selAreaId || !selCategoriaId || !selGradoInicial || !selGradoFinal) return;
    const area = areas.find(a => a.id === parseInt(selAreaId)).nombre;
    const cat = categorias.find(c => c.id === parseInt(selCategoriaId)).nombre;
    const gIni = grados.find(g => g.id === parseInt(selGradoInicial)).nombre;
    const gFin = grados.find(g => g.id === parseInt(selGradoFinal)).nombre;
    const entry = { area, categoria: cat, gradoInicial: gIni, gradoFinal: gFin };
    setConvocatoriaAreas([...convocatoriaAreas, entry]);
    setSelAreaId(''); setSelCategoriaId(''); setSelGradoInicial(''); setSelGradoFinal('');
  };
  const handleRemoveArea = idx => {
    setConvocatoriaAreas(convocatoriaAreas.filter((_, i) => i !== idx));
  };

  // Update convocatoria
  const handleActualizarConvocatoria = e => {
    e.preventDefault();
    const arr = JSON.parse(localStorage.getItem('convocatorias')) || [];
    const updated = arr.map(c =>
      c.id === +id
        ? { ...c, nombre: nombreConv, descripcion: descConv, areas: convocatoriaAreas }
        : c
    );
    localStorage.setItem('convocatorias', JSON.stringify(updated));
    navigate('/configuracion-convocatoria');
  };

  return (
    <div className="config-page">
      <div className="config-container">
        <div className="config-header">Editar / Configurar Convocatoria</div>
        <div className="config-body">
          {/* Grados */}
          <div className="card">
            <h3>Lista de grados</h3>
            <form className="form-row" onSubmit={handleCreateGrado}>
              <input placeholder="Nombre de grado" value={newGrado} onChange={e => setNewGrado(e.target.value)} />
              <button className="btn-primary" type="submit">Crear</button>
              <button className="btn-primary" onClick={handleDeleteGrado} disabled={!selGradoId}>Eliminar</button>
            </form>
            <table className="tabla-lista">
              <thead><tr><th>ID</th><th>Nombre</th></tr></thead>
              <tbody>
                {grados.map(g => (
                  <tr key={g.id} onClick={()=>setSelGradoId(g.id)} className={selGradoId===g.id?'fila-seleccionada':''}>
                    <td>{g.id}</td><td>{g.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Categorías */}
          <div className="card">
            <h3>Lista de categorías</h3>
            <form className="form-row" onSubmit={handleCreateCategoria}>
              <input placeholder="Nombre de categoría" value={newCategoria} onChange={e => setNewCategoria(e.target.value)} />
              <button className="btn-primary" type="submit">Crear</button>
              <button className="btn-primary" onClick={handleDeleteCategoria} disabled={!selCategoriaId}>Eliminar</button>
            </form>
            <table className="tabla-lista">
              <thead><tr><th>ID</th><th>Nombre</th></tr></thead>
              <tbody>
                {categorias.map(c => (
                  <tr key={c.id} onClick={()=>setSelCategoriaId(c.id)} className={selCategoriaId===c.id?'fila-seleccionada':''}>
                    <td>{c.id}</td><td>{c.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Áreas */}
          <div className="card">
            <h3>Lista de áreas</h3>
            <form className="form-row" onSubmit={handleCreateArea}>
              <input placeholder="Nombre de área" value={newArea} onChange={e => setNewArea(e.target.value)} />
              <button className="btn-primary" type="submit">Crear</button>
              <button className="btn-primary" onClick={handleDeleteArea} disabled={!selAreaId}>Eliminar</button>
            </form>
            <table className="tabla-lista">
              <thead><tr><th>ID</th><th>Nombre</th></tr></thead>
              <tbody>
                {areas.map(a => (
                  <tr key={a.id} onClick={()=>setSelAreaId(a.id)} className={selAreaId===a.id?'fila-seleccionada':''}>
                    <td>{a.id}</td><td>{a.nombre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Nueva convocatoria */}
          <div className="card nueva-convocatoria">
            <h3>Editar convocatoria</h3>
            <form onSubmit={handleActualizarConvocatoria}>
              <div className="form-row">
                <label>
                  Nombre convocatoria
                  <input type="text" value={nombreConv} onChange={e=>setNombreConv(e.target.value)} />
                </label>
                <label>
                  Descripción
                  <textarea rows={2} className="fixed-desc" value={descConv} onChange={e=>setDescConv(e.target.value)} />
                </label>
              </div>
              <h4>Área de convocatoria</h4>
              <div className="form-row">
                <select value={selAreaId||''} onChange={e=>setSelAreaId(e.target.value)}>
                  <option value="" disabled>Selecciona área</option>
                  {areas.map(a=><option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
                <select value={selCategoriaId||''} onChange={e=>setSelCategoriaId(e.target.value)}>
                  <option value="" disabled>Selecciona categoría</option>
                  {categorias.map(c=><option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>
              <div className="form-row">
                <select value={selGradoInicial||''} onChange={e=>setSelGradoInicial(e.target.value)}>
                  <option value="" disabled>Grado inicial</option>
                  {grados.map(g=><option key={g.id} value={g.id}>{g.nombre}</option>)}
                </select>
                <select value={selGradoFinal||''} onChange={e=>setSelGradoFinal(e.target.value)}>
                  <option value="" disabled>Grado final</option>
                  {grados.map(g=><option key={g.id} value={g.id}>{g.nombre}</option>)}
                </select>
              </div>
              <button className="btn-primary" type="button" onClick={handleAgregarArea}>Agregar a convocatoria</button>

              {convocatoriaAreas.length>0&&( 
                <table className="tabla-convocatoria-areas">
                  <thead><tr><th>Área</th><th>Categoría</th><th>Grado</th><th></th></tr></thead>
                  <tbody>
                    {convocatoriaAreas.map((item,idx)=>(
                      <tr key={idx}>
                        <td>{item.area}</td>
                        <td>{item.categoria}</td>
                        <td>{item.gradoInicial===item.gradoFinal?item.gradoInicial:`${item.gradoInicial} - ${item.gradoFinal}`}</td>
                        <td><button className="btn-remove" onClick={()=>handleRemoveArea(idx)}>×</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              <div className="acciones-container" style={{marginTop:'2rem'}}>
                <button className="btn-primary" type="submit">Actualizar convocatoria</button>
                <button className="btn-primary" type="button" onClick={()=>navigate('/configuracion-convocatoria')}>Salir</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditarConfigurarConvocatoria;
