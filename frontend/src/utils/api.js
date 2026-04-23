import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect to login if it's a token-related 401 (not login failure)
    // Check if the request was NOT to login or register endpoints
    const isAuthEndpoint = error.config?.url?.includes('/login') || 
                          error.config?.url?.includes('/register');
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const register = (data) => api.post('/register', data);
export const login = (data) => api.post('/login', data);
export const getProfile = () => api.get('/profile');

// Item APIs
export const addItem = (data) => api.post('/items', data);
export const getAllItems = () => api.get('/items');
export const getItemById = (id) => api.get(`/items/${id}`);
export const updateItem = (id, data) => api.put(`/items/${id}`, data);
export const deleteItem = (id) => api.delete(`/items/${id}`);
export const searchItems = (name) => api.get(`/items/search/query?name=${name}`);

export default api;
