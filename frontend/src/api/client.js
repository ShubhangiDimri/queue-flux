import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const api = axios.create({
    baseURL: BASE_URL,
    headers: { 'Content-Type': 'application/json' },
});

// Attach token on every request if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('qf_token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Extract a clean error message from backend response
export function extractError(err) {
    return (
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'Something went wrong'
    );
}

// ---- Auth ----
export const authAPI = {
    register: (data) => api.post('/api/auth/register', data),
    login: (data) => api.post('/api/auth/login', data),
    createUser: (data) => api.post('/api/auth/create-user', data),
};

// ---- Appointments ----
export const appointmentsAPI = {
    book: (data) => api.post('/api/appointments/book', data),
    getQueue: (doctorId) => api.get(`/api/appointments/queue/${doctorId}`),
    complete: (id) => api.put(`/api/appointments/complete/${id}`),
};

export default api;
