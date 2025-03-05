// src/api/driverApi.js
import apiClient from './apiClient';

const driverApi = {
    // Fetch all routes for the logged-in driver
    getDriverRoutes: async () => {
        const response = await apiClient.get('/driver/routes');
        return response.data.data.routes;  // Updated for new structure
    },

    // Fetch all buses for the logged-in driver
    getDriverBuses: async () => {
        const response = await apiClient.get('/driver/buses');

        const enrichedBuses = response.data.data.buses.map(bus => ({  // Updated
            ...bus,
            start_location: bus.start_location || "Unknown",
            destination: bus.destination || "Unknown",
        }));

        return enrichedBuses;
    },

    // Create a new route
    createRoute: async (data) => {
        const response = await apiClient.post('/driver/routes', data);
        return response.data;
    },

    // Add a new bus
    addBus: async (data) => {
        const response = await apiClient.post('/driver/buses', data);
        return response.data;
    },

    // Assign a bus to a route
    assignRoute: async (busId, routeId) => {
        const response = await apiClient.put(`/driver/bus/${busId}/assign_route`, { route_id: routeId });
        return response.data;
    },

    // Set departure time for a bus
    setDepartureTime: async (busId, departureTime) => {
        const response = await apiClient.put(`/driver/bus/${busId}/set_departure_time`, { departure_time: departureTime });
        return response.data;
    },

    // Set ticket price for a bus
    setTicketPrice: async (busId, ticketPrice) => {
        const response = await apiClient.put(`/driver/bus/${busId}/set_ticket_price`, { ticket_price: ticketPrice });
        return response.data;
    },

    // Get seat information for a specific bus
    getBusSeats: async (busId) => {
        const response = await apiClient.get(`/driver/bus/${busId}/seats`);
        return response.data.data;  // Updated for new structure
    },

    // Delete a bus
    deleteBus: async (busId) => {
        const response = await apiClient.delete(`/driver/bus/${busId}`);
        return response.data;
    },
};

export default driverApi;
