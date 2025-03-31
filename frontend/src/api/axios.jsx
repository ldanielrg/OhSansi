import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api', // ajusta si usas otra URL
    withCredentials: true, // si usas cookies/session en Laravel
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});

export default api;