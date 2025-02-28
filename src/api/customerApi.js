import axios from 'axios';

const API_BASE_URL = 'https://busbookingtest.onrender.com';

const getAuthHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem('token')}`
});

const customerApi = {
    getAllBuses: async () => {
        const response = await axios.get(`${API_BASE_URL}/customer/available_buses`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getMyBookings: async (customerId) => {
        const response = await axios.get(`${API_BASE_URL}/customer/my_bookings/${customerId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    bookSeat: async (bookingData) => {
        const response = await axios.post(`${API_BASE_URL}/customer/book_seat`, bookingData, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    cancelBooking: async (bookingId) => {
        const response = await axios.delete(`${API_BASE_URL}/customer/cancel_booking/${bookingId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    getAvailableSeats: async (busId) => {
        const response = await axios.get(`${API_BASE_URL}/customer/view_available_seats/${busId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    },

    sendMessage: async (messageData) => {
        const response = await axios.post(`${API_BASE_URL}/customer/send_message`, messageData, {
            headers: getAuthHeaders()
        });
        return response.data;
    }
};

export default customerApi;
