import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:5000";  

const authApi = {
    login: async (credentials) => {
        const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
        return response.data;
    },
    register: async (formData) => {
        const response = await axios.post(`${API_BASE_URL}/auth/register`, formData);
        return response.data;
    }
};

export default authApi;
