import axios from 'axios';

const API_URL = 'http://localhost:8000/api/convocatorias';

export const crearConvocatoria = async (convocatoria) => {
  return await axios.post(API_URL, convocatoria);
};
