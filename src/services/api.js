import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  timeout: 30000,
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
  // User endpoints - accessible to both roles but with different behavior
  getAllMusic: async () => {
    try {
      const response = await api.get('/music/');
      return response.data.musics || [];
    } catch (error) {
      if (error.response?.status === 403) {
        return [];
      }
      throw error;
    }
  },
  
  // Albums should be visible to everyone (both users and artists)
  getAlbums: async () => {
    try {
      const response = await api.get('/music/albums');
      console.log('Albums API response:', response.data); // Debug log
      return response.data.albums || [];
    } catch (error) {
      console.error('Error fetching albums:', error);
      if (error.response?.status === 403) {
        // If forbidden, return empty array
        return [];
      }
      throw error;
    }
  },
  
  getAlbum: async (id) => {
    try {
      const response = await api.get(`/music/albums/${id}`);
      return response.data.album;
    } catch (error) {
      console.error('Error fetching album:', error);
      throw error;
    }
  },
  
  // Artist endpoints
  uploadMusic: (formData) => {
    return api.post('/music/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    });
  },
  
  createAlbum: (albumData) => api.post('/music/album', albumData),
  
  // Get artist's own music
  getMyMusic: async () => {
    try {
      const response = await api.get('/music/my-music');
      console.log('My music API response:', response.data); // Debug log
      return response.data.musics || [];
    } catch (error) {
      console.error('Error fetching your music:', error);
      return [];
    }
  }
};

export default api;