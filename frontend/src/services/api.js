import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user_email');
      window.location.assign('/login');
    }
    return Promise.reject(error);
  },
);

export const getErrorMessage = (error, fallback = 'Something went wrong.') => {
  const data = error?.response?.data;
  if (typeof data === 'string') {
    return data;
  }
  if (data?.detail) {
    return typeof data.detail === 'string' ? data.detail : 'Request failed.';
  }
  if (data?.message) {
    return data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return fallback;
};

export const login = async (credentials) => {
  const params = new URLSearchParams({
    username: credentials.username,
    password: credentials.password,
  });

  return api.post('/auth/login', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};

export const signup = async (payload) => api.post('/auth/signup', payload);
export const getProfile = async () => api.get('/auth/me');

export const getEnvironments = async () => api.get('/environments/');
export const createEnvironment = async (payload) => api.post('/environments/', payload);
export const updateEnvironment = async (id, payload) => api.put(`/environments/${id}`, payload);
export const deleteEnvironment = async (id) => api.delete(`/environments/${id}`);

export const getFlags = async () => api.get('/flags/');
export const createFlag = async (payload) => api.post('/flags/', payload);
export const updateFlag = async (id, payload) => api.put(`/flags/${id}`, payload);
export const deleteFlag = async (id) => api.delete(`/flags/${id}`);
export const evaluateFlag = async (payload) => api.post('/flags/evaluate', payload);

export const getOverrides = async () => api.get('/overrides/');
export const createOverride = async (payload) => api.post('/overrides/', payload);
export const updateOverride = async (id, payload) => api.put(`/overrides/${id}`, payload);
export const deleteOverride = async (id) => api.delete(`/overrides/${id}`);

export const getAuditLogs = async () => api.get('/audit-logs/');
export const getRedisStatus = () => api.get("/redis/status");

// =========================
// User Groups APIs
// =========================

export const getGroups = async () => api.get('/groups/');

export const createGroup = async (payload) =>
  api.post('/groups/', payload);

export const updateGroup = async (id, payload) =>
  api.put(`/groups/${id}`, payload);

export const deleteGroup = async (id) =>
  api.delete(`/groups/${id}`);

export const addUserToGroup = async (payload) =>
  api.post('/groups/add-user', payload);

// =========================
// Targeting Rules APIs
// =========================

export const getTargetingRules = async () =>
  api.get('/targeting-rules/');

export const createTargetingRule = async (payload) =>
  api.post('/targeting-rules/', payload);

export const deleteTargetingRule = async (id) =>
  api.delete(`/targeting-rules/${id}`);

export default api;
