import axios from 'axios';

const API_URL = 'http://localhost:8000/api/cronogramas';

// Obtener todos los cronogramas
export const obtenerCronogramas = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Crear un nuevo cronograma
export const crearCronograma = async (fecha) => {
  console.log("Enviando a la API:", fecha);
  const res = await axios.post(API_URL, { fecha });
  return res.data;
};

// Actualizar un cronograma existente
export const actualizarCronograma = async (id, datos) => {
  const res = await axios.put(`${API_URL}/${id}`, datos);
  return res.data;
};

// Eliminar un cronograma
export const eliminarCronograma = async (id) => {
  await axios.delete(`${API_URL}/${id}`);
};