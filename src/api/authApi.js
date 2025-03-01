import axios from 'axios';

const API_BASE_URL = "http://127.0.0.1:5000";

const handleError = (error) => {
    if (error.response) {
        throw new Error(error.response.data?.error || "An error occurred. Please try again.");
    } else {
        throw new Error("Network error or server is unavailable.");
    }
};

const authApi = {
    login: async (credentials) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },

    register: async (formData) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/auth/register`, formData);
            return response.data;
        } catch (error) {
            handleError(error);
        }
    },
};

export default authApi;
