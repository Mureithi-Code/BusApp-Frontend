// src/api/driverApi.js
import apiClient from './apiClient';

const driverApi = {
    // Fetch all routes for the logged-in driver
    getDriverRoutes: async () => {
        const response = await apiClient.get('/driver/routes');
        return response.data.routes;  // Keep this if your backend returns { routes: [...] }
    },

    // Fetch all buses for the logged-in driver
    getDriverBuses: async () => {
        const response = await apiClient.get('/driver/buses');

        // Transform the buses to include route details (if present)
        const enrichedBuses = response.data.buses.map(bus => ({
            ...bus,
            start_location: bus.start_location || "Unknown",  // default if not provided
            destination: bus.destination || "Unknown",        // default if not provided
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
        const response = await apiClient.put(`/driver/bus/${busId}/assign_bus_to_route`, { route_id: routeId });
        return response.data;
    },

    // Set departure time for a bus
    setDepartureTime: async (busId, departureTime) => {
        const response = await apiClient.put(`/driver/bus/${busId}/set_departure_time`, { departure_time: departureTime });
        return response.data;
    },

    // Set ticket price for a bus
    setSeatPrice: async (busId, ticketPrice) => {
        const response = await apiClient.put(`/driver/bus/${busId}/set_ticket_price`, { ticket_price: ticketPrice });
        return response.data;
    },

    // Get seat information for a specific bus
    getBusSeats: async (busId) => {
        const response = await apiClient.get(`/driver/bus/${busId}/seats`);
        return response.data;
    },

    // Delete a bus
    deleteBus: async (busId) => {
        const response = await apiClient.delete(`/driver/bus/${busId}`);
        return response.data;
    },
};

export default driverApi;
