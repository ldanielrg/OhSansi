// VerEvento.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import EventoForm from './EventoForm';

function VerEvento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    // Aquí GET al backend para cargar los datos del evento
    const fakeData = {
      cronograma: {
        nombre: 'Olimpiada de Matemáticas',
        fechaInicio: '2023-04-10',
        fechaPreinscripcion: '2023-03-28',
        duracion: '5',
        fechaFin: '2023-04-15',
        fechaInscripcion: '2023-04-01',
      },
      convocatoria: {
        presentacion: 'Texto de presentación...',
        areas: [
          { 
            nombre: 'Matemáticas',
            inicioAno: '1',
            inicioNivel: 'Secundaria',
            finalAno: '6',
            finalNivel: 'Secundaria'
          }
        ],
        requisitos: 'Requisitos de ejemplo...',
        inscripcion: 'Pasos a seguir...',
      },
    };
    setInitialData(fakeData);
  }, [id]);

  const handleCancel = () => {
    // Al “Salir” volvemos a la lista
    navigate('/eventos');
  };

  return (
    <div>
      {initialData ? (
        <EventoForm
          mode="view"
          initialData={initialData}
          onCancel={handleCancel}
          // onSubmit no se usa en 'view', pero React se quejaría si no lo pasamos. Lo podemos dejar vacío.
          onSubmit={() => {}}
        />
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
}

export default VerEvento;
