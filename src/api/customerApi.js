// src/api/customerApi.js
import apiClient from './apiClient';

// Unified error handling wrapper
const handleRequest = async (apiCall) => {
    try {
        const response = await apiCall();
        return response.data;  // the backend always sends { success, message, data }.
    } catch (error) {
        console.error("API Error:", error);
        throw new Error(error.response?.data?.message || "An unexpected error occurred.");
    }
};

const customerApi = {
    getAllRoutes: async () => {
        return handleRequest(() => apiClient.get('/customer/routes'));
    },

    getAllBuses: async () => {
        return handleRequest(() => apiClient.get('/customer/buses'));
    },

    getAvailableSeats: async (busId) => {
        return handleRequest(() => apiClient.get(`/customer/view_available_seats/${busId}`));
    },

    bookSeat: async (bookingData) => {
        return handleRequest(() => apiClient.post('/customer/book_seat', bookingData));
    },

    cancelBooking: async (bookingId) => {
        return handleRequest(() => apiClient.delete(`/customer/cancel_booking/${bookingId}`));
    },

    sendMessage: async (messageData) => {
        return handleRequest(() => apiClient.post('/customer/send_message', messageData));
    },

    getMyBookings: async (customerId) => {
        return handleRequest(() => apiClient.get(`/customer/my_bookings/${customerId}`));
    },
};

export default customerApi;
