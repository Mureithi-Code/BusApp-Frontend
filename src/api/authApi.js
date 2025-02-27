import axios from 'axios';

const API_BASE_URL = "https://busbookingtest.onrender.com";  

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
