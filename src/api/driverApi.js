import apiClient from './apiClient';

const handleApiError = (error) => {
    console.error("API Error:", error?.response?.data || error.message);
    throw new Error(error?.response?.data?.message || "An unexpected error occurred.");
};

const driverApi = {
    getDriverRoutes: async () => {
        try {
            const response = await apiClient.get('/driver/routes');
            return response.data.data?.routes || [];  // Safely extract routes array
        } catch (error) {
            handleApiError(error);
        }
    },

    getDriverBuses: async () => {
        try {
            const response = await apiClient.get('/driver/buses');
            return response.data.data?.buses || [];   // Safely extract buses array
        } catch (error) {
            handleApiError(error);
        }
    },

    createRoute: async (data) => {
        try {
            const response = await apiClient.post('/driver/routes', data);
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    addBus: async (data) => {
        try {
            const response = await apiClient.post('/driver/buses', data);
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    assignRoute: async (busId, routeId) => {
        try {
            const response = await apiClient.put(`/driver/bus/${busId}/assign_route`, { route_id: routeId });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    setDepartureTime: async (busId, departureTime) => {
        try {
            const response = await apiClient.put(`/driver/bus/${busId}/set_departure_time`, { departure_time: departureTime });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    setTicketPrice: async (busId, ticketPrice) => {
        try {
            const response = await apiClient.put(`/driver/bus/${busId}/set_ticket_price`, { ticket_price: ticketPrice });
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },

    getBusSeats: async (busId) => {
        try {
            const response = await apiClient.get(`/driver/bus/${busId}/seats`);
            return response.data.data;  // Extract seat data directly
        } catch (error) {
            handleApiError(error);
        }
    },

    deleteBus: async (busId) => {
        try {
            const response = await apiClient.delete(`/driver/bus/${busId}`);
            return response.data;
        } catch (error) {
            handleApiError(error);
        }
    },
};

export default driverApi;
