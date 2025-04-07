// CrearEvento.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import EventoForm from '../components/EventoForm';

import { crearCronograma } from '../api/cronogramaApi';
import { crearConvocatoria } from '../api/convocatoriaApi';
import { asignarAreasAConvocatoria } from '../api/convocatoriaApi';

function CrearEvento() {
  const navigate = useNavigate();

  /*const handleCreateSubmit = async (eventoData) => {
    try {
      // 1. Crear cronograma
      const resCronograma = await crearCronograma(eventoData.cronograma.fecha);
      const idCronograma = resCronograma.id_cronog;

      // 2. Crear convocatoria vinculada
      const convocatoriaPayload = {
        descripcion: eventoData.convocatoria.presentacion,
        id_cronog: idCronograma,
        estado: true,
        nombre_convocatoria: 'Convocatoria automática',
      };
  
      const resConvocatoria = await crearConvocatoria(convocatoriaPayload);
  
      console.log('Convocatoria creada:', resConvocatoria);
      alert('Convocatoria y cronograma creados con éxito');
      navigate('/eventos');
  
    } catch (err) {
      console.error('Error al guardar datos:', err);
      alert('Error al guardar datos');
    }
  };*/
  const handleCreateSubmit = async (eventoData) => {
    try {
      // 1. Crear cronograma
      const resCronograma = await crearCronograma(eventoData.cronograma.fecha);
      const idCronograma = resCronograma.id_cronog;
  
      // 2. Crear convocatoria vinculada
      const convocatoriaPayload = {
        descripcion: eventoData.convocatoria.presentacion,
        id_cronog: idCronograma,
        estado: true,
        nombre_convocatoria: 'Convocatoria automática',
      };

      const resConvocatoria = await crearConvocatoria(convocatoriaPayload);
      const idConvocatoria = resConvocatoria.data.id_convocatoria;
  
      // 3. Asignar áreas seleccionadas
      console.log("ID convocatoria:", idConvocatoria);
      console.log("Áreas a asignar:", eventoData.convocatoria.areasSeleccionadas);

      await asignarAreasAConvocatoria(idConvocatoria, eventoData.convocatoria.areasSeleccionadas);
  
      console.log('Convocatoria creada:', resConvocatoria);
      alert('Convocatoria, cronograma y áreas guardados con éxito');
      navigate('/eventos');
  
    } catch (err) {
      console.error('Error al guardar datos:', err);
      alert('Error al guardar los datos');
    }
  };

  const handleCancel = () => {
    navigate('/eventos');
  };

  return (
    <EventoForm
      mode="create"
      onSubmit={handleCreateSubmit}
      onCancel={handleCancel}
    />
  );
}

export default CrearEvento;
