// src/api/adminApi.js
import apiClient from './apiClient';

// Unified error handling wrapper
const handleRequest = async (apiCall) => {
    try {
        const response = await apiCall();
        return response.data;  // Backend always sends { success, message, data }
    } catch (error) {
        console.error("❌ API Error:", error);
        throw new Error(error.response?.data?.message || "An unexpected error occurred.");
    }
};

const adminApi = {
    getAllBuses: async () => {
        const response = await handleRequest(() => apiClient.get('/admin/buses'));
        const buses = response.data?.buses || (Array.isArray(response.data) ? response.data : []);
        return Array.isArray(buses) ? buses : []; 
    },

    getAllRoutes: async () => {
        const response = await handleRequest(() => apiClient.get('/admin/routes'));
        const routes = response.data?.routes || (Array.isArray(response.data) ? response.data : []);
        return Array.isArray(routes) ? routes : [];
    },

    getAllDrivers: async () => {
        const response = await handleRequest(() => apiClient.get('/admin/drivers'));
        const drivers = response.data?.drivers || (Array.isArray(response.data) ? response.data : []);
        return Array.isArray(drivers) ? drivers : [];
    },

    getAllMessages: async () => {
        const response = await handleRequest(() => apiClient.get('/admin/messages'));
        const messages = response.data?.messages || (Array.isArray(response.data) ? response.data : []);
        return Array.isArray(messages) ? messages : [];
    },

    removeDriver: async (driverId) => {
        return handleRequest(() => apiClient.delete(`/admin/remove_driver/${driverId}`));
    },

    cancelRoute: async (routeId) => {
        return handleRequest(() => apiClient.delete(`/admin/cancel_route/${routeId}`));
    },

    replyMessage: async (messageId, content) => {
        return handleRequest(() => apiClient.post(`/admin/reply_message/${messageId}`, { content }));
    }
};

export default adminApi;
