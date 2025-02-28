import axios from 'axios';

const API_BASE_URL = "https://busbookingtest.onrender.com";

const driverApi = {
    getBuses: async (driverId) => {
        const response = await axios.get(`${API_BASE_URL}/driver/buses/${driverId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    },
    addBus: async (busData) => {
        const response = await axios.post(`${API_BASE_URL}/driver/add_bus`, busData, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    },
    removeBus: async (busId) => {
        const response = await axios.delete(`${API_BASE_URL}/driver/remove_bus/${busId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    },
    assignRoute: async (data) => {
        const response = await axios.put(`${API_BASE_URL}/driver/pick_route`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    },
    assignCost: async (busId, data) => {
        const response = await axios.put(`${API_BASE_URL}/driver/assign_cost/${busId}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    },
    updateBus: async (busId, data) => {
        const response = await axios.put(`${API_BASE_URL}/driver/update_bus/${busId}`, data, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        });
        return response.data;
    },
};

export default driverApi;
