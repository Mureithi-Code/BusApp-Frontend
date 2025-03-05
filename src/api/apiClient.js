import axios from 'axios';

// Use environment variable for baseURL, fallback to default if not provided
const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL || 'https://busbookingtest-1.onrender.com',
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

    // Optional: Log request for debugging
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
    return config;
}, (error) => {
    console.error(`[API Request Error]`, error);
    return Promise.reject(error);
});

// Global error handling (auto-logout on 401 and log errors)
apiClient.interceptors.response.use(
    (response) => {
        // Optional: Log successful response
        console.log(`[API Response]`, response);
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            console.warn('⚠️ Unauthorized! Redirecting to login...');
            localStorage.clear();
            window.location.href = '/login';
        }

        // Optional: Log error response
        console.error(`[API Response Error]`, error.response);
        return Promise.reject(error);
    }
);

export default apiClient;
