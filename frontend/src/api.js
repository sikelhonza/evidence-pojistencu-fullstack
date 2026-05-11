import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000',
  withCredentials: true,
});

let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config;

    if (error.response?.status !== 401 || original._retry) {
      return Promise.reject(error);
    }

    const isAuthEndpoint = original.url?.includes('/api/auth/');
    if (isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject });
      }).then(() => api(original)).catch(() => Promise.reject(error));
    }

    original._retry = true;
    isRefreshing = true;

    try {
      await api.post('/api/auth/refresh/');
      pendingRequests.forEach(p => p.resolve());
      pendingRequests = [];
      return api(original);
    } catch {
      pendingRequests.forEach(p => p.reject());
      pendingRequests = [];
      window.dispatchEvent(new Event('session-expired'));
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
