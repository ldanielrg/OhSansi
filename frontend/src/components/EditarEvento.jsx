// EditarEvento.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventoForm from './EventoForm';

function EditarEvento() {
  const { id } = useParams(); // ID del evento a editar
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  // Aquí cargarías los datos del evento desde tu API
  useEffect(() => {
    // Ejemplo HARDCODE: supongamos un fetch
    const fakeData = {
      cronograma: {
        nombre: 'Olimpiada de Física',
        fechaInicio: '2023-05-01',
        fechaPreinscripcion: '2023-04-20',
        duracion: '5',
        fechaFin: '2023-05-06',
        fechaInscripcion: '2023-04-25',
      },
      convocatoria: {
        presentacion: 'Texto de la presentación...',
        areas: [
          { 
            nombre: 'Física',
            inicioAno: '1',
            inicioNivel: 'Secundaria',
            finalAno: '6',
            finalNivel: 'Secundaria'
          }
        ],
        requisitos: 'Lista de requisitos...',
        inscripcion: 'Pasos a seguir...',
      },
    };
    // Simulamos que esa data es la que obtenemos del backend:
    setInitialData(fakeData);
  }, [id]);

  // Manejo de submit (PUT/PATCH al backend)
  const handleEditSubmit = (eventoData) => {
    console.log(`Actualizando evento ID=${id}:`, eventoData);
    // PUT o PATCH a la API
    navigate('/eventos');
  };

  // Cancelar
  const handleCancel = () => {
    navigate('/eventos');
  };

  return (
    <div>
      {initialData ? (
        <EventoForm
          mode="edit"
          initialData={initialData}
          onSubmit={handleEditSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default EditarEvento;
