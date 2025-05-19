import api from '../api/axios'; // ajusta la ruta si tu archivo está en otro lugar

// Obtener todos los cronogramas
export const obtenerCronogramas = async () => {
  const res = await api.get('/cronogramas');
  return res.data;
};

// Crear un nuevo cronograma
export const crearCronograma = async (fecha) => {
  console.log("Enviando a la API:", fecha);
  const res = await api.post('/cronogramas', { fecha });
  return res.data;
};

// Actualizar un cronograma existente
export const actualizarCronograma = async (id, datos) => {
  const res = await api.put(`/cronogramas/${id}`, datos);
  return res.data;
};

// Eliminar un cronograma
export const eliminarCronograma = async (id) => {
  await api.delete(`/cronogramas/${id}`);
};
