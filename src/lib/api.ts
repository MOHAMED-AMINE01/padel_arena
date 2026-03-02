import axios from 'axios';

const api = axios.create({
    baseURL: (import.meta as any).env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true, // Send cookies with requests
});

// Request interceptor to add the token to headers
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

export default api;
