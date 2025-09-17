// Frontend API service for v2 endpoints
import axios from 'axios'

// Create v2 API instance
const v2Api = axios.create({
  baseURL: '/api/v2',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// Add auth interceptor
v2Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
  },
  (error) => Promise.reject(error),
)

// Add response interceptor
v2Api.interceptors.response.use(
  (r) => r,
  (error) => {
    console.error('V2 API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    })
    
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

// V2 Jobs API
export const jobsV2API = {
  list: async (params = {}) => {
    const res = await v2Api.get('/jobs', { params })
    return res.data
  },

  get: async (id) => {
    const res = await v2Api.get(`/jobs/${id}`)
    return res.data
  },

  create: async (jobData) => {
    const res = await v2Api.post('/jobs', jobData)
    return res.data
  },

  update: async (id, jobData) => {
    const res = await v2Api.patch(`/jobs/${id}`, jobData)
    return res.data
  },

  remove: async (id) => {
    const res = await v2Api.delete(`/jobs/${id}`)
    return res.data
  },
}

// V2 Resume API
export const resumeV2API = {
  submit: async (resumeData) => {
    const res = await v2Api.post('/resume/submit', resumeData)
    return res.data
  },

  getByUserId: async (userId) => {
    const res = await v2Api.get(`/resume/by-user-id/${userId}`)
    return res.data
  },

  update: async (memberId, resumeData) => {
    const res = await v2Api.put(`/resume/${memberId}`, resumeData)
    return res.data
  },

  getById: async (memberId) => {
    const res = await v2Api.get(`/resumes/${memberId}`)
    return res.data
  },
}

// V2 Auth API
export const authV2API = {
  login: async (credentials) => {
    const res = await v2Api.post('/auth/login', credentials)
    return res.data
  },

  me: async () => {
    const res = await v2Api.get('/auth/me')
    return res.data
  },
}

export default v2Api
