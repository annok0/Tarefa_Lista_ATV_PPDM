import axios from 'axios';

const api = axios.create({
  baseURL: 'https://tarefa-lista-atv-ppdm.onrender.com',
});

export default api;