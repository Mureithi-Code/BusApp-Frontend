// src/api/apiClient.js
import axios from 'axios';

// Create the axios instance with base config
const apiClient = axios.create({
    baseURL: 'https://busbookingtest-1.onrender.com',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Automatically attach token from localStorage to all requests
apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Global error handling (auto-logout on 401)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.warn('⚠️ Unauthorized! Redirecting to login...');
            localStorage.clear();
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default apiClient;
