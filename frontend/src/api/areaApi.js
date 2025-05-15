import api from '../api/axios'; // o la ruta correcta según dónde esté este archivo

export const obtenerAreas = async () => {
  const res = await api.get('/areas');
  return res.data;
};
