// src/api/customerApi.js
import apiClient from './apiClient';

// Unified error handling wrapper
const handleRequest = async (apiCall) => {
    try {
        const response = await apiCall();
        if (!response.data.success) {
            throw new Error(response.data.message || "Operation failed.");
        }
        return response.data.data || [];  // Ensure return value is an array if applicable
    } catch (error) {
        console.error("❌ API Error:", error?.response?.data || error.message);
        return []; // Prevent UI crashes by returning an empty array on failure
    }
};

const customerApi = {
    getAllRoutes: async () => {
        console.log("📤 Fetching all routes...");
        return handleRequest(() => apiClient.get('/customer/routes'));
    },

    getAllBuses: async () => {
        console.log("📤 Fetching all buses...");
        return handleRequest(() => apiClient.get('/customer/buses'));
    },

    getAvailableSeats: async (busId) => {
        console.log(`📤 Fetching available seats for bus ${busId}...`);
        return handleRequest(() => apiClient.get(`/customer/view_available_seats/${busId}`));
    },

    bookSeat: async (bookingData) => {
        console.log("📤 Booking seat request:", bookingData); // Debugging

        if (!bookingData.customer_id || !bookingData.bus_id || !bookingData.seat_number) {
            console.error("❌ Missing booking details:", bookingData);
            throw new Error("Invalid booking request. Please select a bus and seat.");
        }

        try {
            const response = await apiClient.post('/customer/book_seat', bookingData);
            console.log("✅ Seat booked successfully:", response.data);
            return response.data;
        } catch (error) {
            console.error("❌ Booking error:", error.response ? error.response.data : error.message);
            throw error;
        }
    },

    cancelBooking: async (bookingId) => {
        console.log("📤 Cancel booking request:", bookingId); // Debugging
        return handleRequest(() => apiClient.delete(`/customer/cancel_booking/${bookingId}`));
    },

    sendMessage: async (messageData) => {
        console.log("📤 Sending message:", messageData); // Debugging
        return handleRequest(() => apiClient.post('/customer/send_message', messageData));
    },

    getMyBookings: async () => {
        const customerId = localStorage.getItem('customer_id');

        if (!customerId) {
            console.error("❌ No customer_id found in localStorage!");
            return []; // Ensure an array is returned to prevent .map() errors
        }

        console.log(`🔍 Fetching bookings for customer ${customerId}`);

        try {
            const response = await apiClient.get(`/customer/my_bookings/${customerId}?_=${new Date().getTime()}`);

            console.log("✅ API Bookings Response:", response.data);

            if (!Array.isArray(response.data.data)) {
                console.error("❌ Unexpected bookings format:", response.data);
                return [];
            }

            return response.data.data;
        } catch (error) {
            console.error("❌ Error fetching bookings:", error.response ? error.response.data : error.message);
            return []; // Return an empty array to prevent UI crashes
        }
    },
};

export default customerApi;
