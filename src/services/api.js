import axios from 'axios';

// const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


const API_BASE_URL = import.meta.env.VITE_API_URL='https://musify-app-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Request timeout. Please try again.'));
    }
    if (error.response?.status === 401) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
};

export const musicAPI = {
  getAllMusic: async () => {
    const response = await api.get('/music/');
    return response.data.musics || [];
  },

  getAlbums: async () => {
    const response = await api.get('/music/albums');
    return response.data.albums || [];
  },

  getAlbum: async (id) => {
    const response = await api.get(`/music/albums/${id}`);
    return response.data.album;
  },

  uploadMusic: (formData) => api.post('/music/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    timeout: 60000,
  }),

  createAlbum: (albumData) => api.post('/music/album', albumData),

  searchMusic: async (query) => {
    const res = await api.get(`/music/search?q=${encodeURIComponent(query)}`);
    return res.data.musics || [];
  },

  getMyMusic: async () => {
    const response = await api.get('/music/my-music');
    return response.data.musics || [];
  },
};

export default api;