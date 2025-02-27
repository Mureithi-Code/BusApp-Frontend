import axios from "axios";

const API_BASE_URL = "https://busbookingtest.onrender.com";

const adminApi = {
    removeDriver: async (driverId) => {
        const response = await axios.delete(`${API_BASE_URL}/admin/remove_driver/${driverId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    },

    cancelRoute: async (routeId) => {
        const response = await axios.put(`${API_BASE_URL}/admin/cancel_route/${routeId}`, {}, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    },

    replyMessage: async (messageId, replyText) => {
        const response = await axios.post(
            `${API_BASE_URL}/admin/reply_message/${messageId}`,
            { text: replyText },
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );
        return response.data;
    },

    getAllDrivers: async () => {
        const response = await axios.get(`${API_BASE_URL}/admin/drivers`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    },
    
    getAllRoutes: async () => {
        const response = await axios.get(`${API_BASE_URL}/admin/routes`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    },
    
    getAllMessages: async () => {
        const response = await axios.get(`${API_BASE_URL}/admin/messages`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    }
    
};

export default adminApi;