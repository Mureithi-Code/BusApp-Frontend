// src/api/adminApi.js
import apiClient from './apiClient';

const adminApi = {
    removeDriver: async (driverId) => {
        const response = await apiClient.delete(`/admin/remove_driver/${driverId}`);
        return response.data;
    },

    cancelRoute: async (routeId) => {
        const response = await apiClient.put(`/admin/cancel_route/${routeId}`);
        return response.data;
    },

    replyMessage: async (messageId, replyText) => {
        const response = await apiClient.post(`/admin/reply_message/${messageId}`, { text: replyText });
        return response.data;
    },

    getAllDrivers: async () => {
        const response = await apiClient.get('/admin/drivers');
        return response.data;
    },

    getAllRoutes: async () => {
        const response = await apiClient.get('/admin/routes');
        return response.data;
    },

    getAllMessages: async () => {
        const response = await apiClient.get('/admin/messages');
        return response.data;
    },
};

export default adminApi;
