import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.replace(/\/+$/, '') + '/', // always ends with one /
});

export default api;