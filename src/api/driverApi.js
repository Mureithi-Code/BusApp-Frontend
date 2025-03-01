import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json',
});

const handleApiError = (error) => {
    if (error.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/login";
        throw new Error('Session expired. Please log in again.');
    }
    throw error;
};

const driverApi = {
    getDriverRoutes: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/driver/routes`, { headers: getAuthHeaders() });
            return response.data.routes;  // Extracting 'routes' array here
        } catch (error) {
            handleApiError(error);
        }
    },

    getDriverBuses: async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/driver/buses`, { headers: getAuthHeaders() });
            return response.data.buses;  // Extracting 'buses' array here
        } catch (error) {
            handleApiError(error);
        }
    },

    createRoute: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/driver/routes`, data, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    addBus: async (data) => {
        try {
            const response = await axios.post(`${API_BASE_URL}/driver/buses`, data, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    assignRoute: async (busId, routeId) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/driver/buses/${busId}/assign-route`, { route_id: routeId }, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    setDepartureTime: async (busId, time) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/driver/buses/${busId}/departure-time`, { departure_time: time }, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    setSeatPrice: async (busId, price) => {
        try {
            const response = await axios.put(`${API_BASE_URL}/driver/buses/${busId}/seat-price`, { price }, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    deleteBus: async (busId) => {
        try {
            const response = await axios.delete(`${API_BASE_URL}/driver/buses/${busId}`, { headers: getAuthHeaders() });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
};

export default driverApi;
