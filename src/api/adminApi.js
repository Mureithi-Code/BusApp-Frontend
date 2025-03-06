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
        const responseData = await handleRequest(() => apiClient.get('/admin/buses'));
        return responseData?.data?.buses || []; 
    },

    getAllRoutes: async () => {
        const responseData = await handleRequest(() => apiClient.get('/admin/routes'));
        return responseData?.data?.routes || [];
    },

    getAllDrivers: async () => {
        const responseData = await handleRequest(() => apiClient.get('/admin/drivers'));
        return responseData?.data?.driver || [];
    },

    getAllMessages: async () => {
        const responseData = await handleRequest(() => apiClient.get('/admin/messages'));
        return responseData?.data?.messages || [];
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
