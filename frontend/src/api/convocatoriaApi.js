import api from '../api/axios'; // ajusta la ruta si es necesario

export const crearConvocatoria = async (convocatoria) => {
  return await api.post('/convocatorias', convocatoria);
};

export const asignarAreasAConvocatoria = async (idConvocatoria, areas) => {
  return await api.post(`/convocatorias/${idConvocatoria}/areas`, {
    areas: areas
  });
};
