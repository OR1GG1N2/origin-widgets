import axios from 'axios';

const api = axios.create({
  baseURL: 'https://www.donationalerts.com/api/v1/token/widget?token=YSZ3kz9qlZK5NGUPBWxI',
  headers: {
    'Content-Type': 'application/json',
  }
});

// Добавляем интерцептор, чтобы токен подставлялся автоматически
api.interceptors.request.use((config) => {
  const token = 'ТВОЙ_TOKEN'; 
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;