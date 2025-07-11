/*import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.0.106:8000/api', // Cambia aquí tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;*/
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.227.137:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token automáticamente
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

