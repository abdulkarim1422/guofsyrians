import axios from 'axios';

// Base API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8222';
const VITE_API_URL_FOR_AUTH = import.meta.env.VITE_API_URL_FOR_AUTH || API_BASE_URL;

// Create axios instance for public form APIs (open to public)
const formApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create axios instance for all other APIs (auth, user, etc.)
const api = axios.create({
  baseURL: VITE_API_URL_FOR_AUTH,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
const addAuthInterceptor = (instance) => {
  instance.interceptors.request.use(
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
};

// Response interceptor to handle errors
const addResponseInterceptor = (instance) => {
  instance.interceptors.response.use(
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
};

// Apply interceptors to all relevant instances
addAuthInterceptor(api);
addResponseInterceptor(api);
// No auth interceptor for formApi (public)
addResponseInterceptor(formApi);

// Auth API calls (use api instance)
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

// User management API calls (Admin only, use api instance)
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

// Export formApi for public form endpoints
export { formApi };

export default api;
