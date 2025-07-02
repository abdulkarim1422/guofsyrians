import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8222';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/api/auth/login-json', credentials);
    return response.data;
  },
  
  register: async (userData) => {
    const response = await api.post('/api/auth/register', userData);
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await api.get('/api/auth/me');
    return response.data;
  },
  
  updateProfile: async (userData) => {
    const response = await api.put('/api/auth/me', userData);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const response = await api.put('/api/auth/change-password', passwordData);
    return response.data;
  },
};

// User management API calls (Admin only)
export const userAPI = {
  createUser: async (userData) => {
    const response = await api.post('/api/auth/admin/users', userData);
    return response.data;
  },
  
  getAllUsers: async (skip = 0, limit = 100) => {
    const response = await api.get(`/api/auth/users?skip=${skip}&limit=${limit}`);
    return response.data;
  },
  
  getUserById: async (userId) => {
    const response = await api.get(`/api/auth/users/${userId}`);
    return response.data;
  },
  
  updateUser: async (userId, userData) => {
    const response = await api.put(`/api/auth/users/${userId}`, userData);
    return response.data;
  },
  
  deleteUser: async (userId) => {
    const response = await api.delete(`/api/auth/users/${userId}`);
    return response.data;
  },
  
  verifyUser: async (userId) => {
    const response = await api.put(`/api/auth/users/${userId}/verify`);
    return response.data;
  },
  
  deactivateUser: async (userId) => {
    const response = await api.put(`/api/auth/users/${userId}/deactivate`);
    return response.data;
  },
};

export default api;
