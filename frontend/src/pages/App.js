// App.js
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Eventos from './pages/Eventos';
import CrearEvento from './pages/CrearEvento';
import EditarEvento from './pages/EditarEvento';
import VerEvento from './pages/VerEvento';

function App() {
  // Aquí mantenemos la lista de eventos en un estado global
  const [eventos, setEventos] = useState([
    {
      id: 1,
      nombre: "Olimpiada de Matemáticas",
      fechaInicio: "2023-04-10",
      fechaFin: "2023-04-15",
      fechaPreinscripcion: "2023-04-01",
      fechaInscripcion: "2023-04-05",
    },
    {
      id: 2,
      nombre: "Olimpiada de Física",
      fechaInicio: "2023-05-01",
      fechaFin: "2023-05-06",
      fechaPreinscripcion: "2023-04-20",
      fechaInscripcion: "2023-04-25",
    },
  ]);

  // Función para agregar un nuevo evento a la lista
  const handleAddEvento = (nuevoEvento) => {
    // Para asignarle un ID único rápido, podrías usar la longitud + 1, o un UUID, etc.
    const newId = eventos.length > 0 ? Math.max(...eventos.map(e => e.id)) + 1 : 1;
    const eventoConId = { id: newId, ...nuevoEvento.resumen };
    // eventoData puede tener cronograma y convocatoria; aquí decides cómo lo resumes en la tabla
    setEventos([...eventos, eventoConId]);
  };

  // Función para actualizar (editar) un evento existente
  const handleUpdateEvento = (id, eventoActualizado) => {
    setEventos(prev =>
      prev.map(ev => ev.id === id 
        ? { ...ev, ...eventoActualizado.resumen } 
        : ev
      )
    );
  };

  // Función para eliminar un evento
  const handleDeleteEvento = (id) => {
    setEventos(prev => prev.filter(ev => ev.id !== id));
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* Página principal (lista de eventos) */}
        <Route 
          path="/eventos" 
          element={
            <Eventos
              eventos={eventos}
              onDeleteEvento={handleDeleteEvento}
            />
          } 
        />

        {/* Crear un nuevo evento */}
        <Route 
          path="/crear-evento" 
          element={
            <CrearEvento 
              onAddEvento={handleAddEvento}
            />
          } 
        />

        {/* Editar un evento existente */}
        <Route 
          path="/editar-evento/:id" 
          element={
            <EditarEvento 
              eventos={eventos}
              onUpdateEvento={handleUpdateEvento}
            />
          } 
        />

        {/* Ver un evento en modo sólo lectura */}
        <Route 
          path="/ver-evento/:id" 
          element={<VerEvento eventos={eventos} />} 
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<div>404 - Not Found</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
