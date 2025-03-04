// src/api/customerApi.js
import apiClient from './apiClient';

const customerApi = {
    getAllBuses: async () => {
        const response = await apiClient.get('/customer/available_buses');
        return response.data;
    },

    getMyBookings: async (customerId) => {
        const response = await apiClient.get(`/customer/my_bookings/${customerId}`);
        return response.data;
    },

    bookSeat: async (bookingData) => {
        const response = await apiClient.post('/customer/book_seat', bookingData);
        return response.data;
    },

    cancelBooking: async (bookingId) => {
        const response = await apiClient.delete(`/customer/cancel_booking/${bookingId}`);
        return response.data;
    },

    getAvailableSeats: async (busId) => {
        const response = await apiClient.get(`/customer/view_available_seats/${busId}`);
        return response.data;
    },

    sendMessage: async (messageData) => {
        const response = await apiClient.post('/customer/send_message', messageData);
        return response.data;
    }
};

export default customerApi;
