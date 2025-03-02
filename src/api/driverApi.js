import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:5000';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    console.log('🔐 [getAuthHeaders] Using token:', token);
    return {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};

const handleApiError = (error, context = '') => {
    if (error.response) {
        console.error(`❌ [${context}] Server Error - Status: ${error.response.status}`, error.response.data);
        if (error.response.status === 401) {
            console.warn(`⚠️ [${context}] Unauthorized - Clearing session and redirecting to login.`);
            localStorage.clear();
            window.location.href = "/login";
        }
    } else if (error.request) {
        console.error(`❌ [${context}] No response from server - Possible network issue.`);
    } else {
        console.error(`❌ [${context}] Error setting up request`, error.message);
    }
    throw error;
};

const driverApi = {
    getDriverRoutes: async () => {
        console.log('🟡 [getDriverRoutes] Fetching driver routes...');
        try {
            const response = await axios.get(`${API_BASE_URL}/driver/routes`, { headers: getAuthHeaders() });
            console.log('✅ [getDriverRoutes] Routes fetched:', response.data.routes);
            return response.data.routes;
        } catch (error) {
            handleApiError(error, 'getDriverRoutes');
        }
    },

    getDriverBuses: async () => {
        console.log('🟡 [getDriverBuses] Fetching driver buses...');
        try {
            const response = await axios.get(`${API_BASE_URL}/driver/buses`, { headers: getAuthHeaders() });
            console.log('✅ [getDriverBuses] Buses fetched:', response.data.buses);
            return response.data.buses;
        } catch (error) {
            handleApiError(error, 'getDriverBuses');
        }
    },

    createRoute: async (data) => {
        console.log('🟡 [createRoute] Initiating request to create route', data);
        try {
            const response = await axios.post(`${API_BASE_URL}/driver/routes`, data, {
                headers: getAuthHeaders()
            });
            console.log('✅ [createRoute] Route created successfully:', response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, 'createRoute');
        }
    },

    addBus: async (data) => {
        console.log('🟡 [addBus] Adding new bus...', data);
        try {
            const response = await axios.post(`${API_BASE_URL}/driver/buses`, data, { headers: getAuthHeaders() });
            console.log('✅ [addBus] Bus added:', response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, 'addBus');
        }
    },

    assignRoute: async (busId, routeId) => {
        console.log(`🟡 [assignRoute] Assigning bus ${busId} to route ${routeId}`);
        try {
            const response = await axios.put(`${API_BASE_URL}/driver/bus/${busId}/assign_route`, { route_id: routeId }, { headers: getAuthHeaders() });
            console.log('✅ [assignRoute] Bus assigned to route:', response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, 'assignRoute');
        }
    },

    setDepartureTime: async (busId, time) => {
        console.log(`🟡 [setDepartureTime] Setting departure time for bus ${busId} to ${time}`);
        try {
            const response = await axios.put(`${API_BASE_URL}/driver/bus/${busId}/set_departure_time`, { departure_time: time }, { headers: getAuthHeaders() });
            console.log('✅ [setDepartureTime] Departure time set:', response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, 'setDepartureTime');
        }
    },

    setSeatPrice: async (busId, price) => {
        console.log(`🟡 [setSeatPrice] Setting seat price for bus ${busId} to ${price}`);
        try {
            const response = await axios.put(`${API_BASE_URL}/driver/bus/${busId}/set_ticket_price`, { price }, { headers: getAuthHeaders() });
            console.log('✅ [setSeatPrice] Seat price set:', response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, 'setSeatPrice');
        }
    },

    getBusSeats: async (busId) => {
        console.log(`🟡 [getBusSeats] Fetching seats for bus ${busId}`);
        try {
            const response = await axios.get(`${API_BASE_URL}/driver/bus/${busId}/seats`, { headers: getAuthHeaders() });
            console.log('✅ [getBusSeats] Seats retrieved:', response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, 'getBusSeats');
        }
    },        

    deleteBus: async (busId) => {
        console.log(`🟡 [deleteBus] Deleting bus ${busId}`);
        try {
            const response = await axios.delete(`${API_BASE_URL}/driver/bus/${busId}`, { headers: getAuthHeaders() });
            console.log('✅ [deleteBus] Bus deleted:', response.data);
            return response.data;
        } catch (error) {
            handleApiError(error, 'deleteBus');
        }
    },
};

export default driverApi;
