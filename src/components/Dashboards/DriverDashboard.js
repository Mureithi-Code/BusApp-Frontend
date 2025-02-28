import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DriverDashboard.css';

const API_BASE_URL = "https://busbookingtest.onrender.com";

const DriverDashboard = () => {
    const [buses, setBuses] = useState([]);
    const [newBus, setNewBus] = useState({ bus_number: '', capacity: '', ticket_price: '' });
    const [selectedBus, setSelectedBus] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [routeData, setRouteData] = useState({ bus_id: '', route_id: '' });

    const fetchBuses = async () => {
        try {
            const response = await axios.get(`${API_BASE_URL}/driver/my_buses`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setBuses(response.data);
        } catch (error) {
            console.error("Failed to fetch buses", error);
        }
    };

    useEffect(() => {
        fetchBuses();
    }, []);

    const handleAddBus = async () => {
        try {
            const payload = {
                driver_id: localStorage.getItem('user_id'),  // Make sure this is stored at login
                bus_number: newBus.bus_number,
                capacity: parseInt(newBus.capacity),
                ticket_price: parseFloat(newBus.ticket_price)
            };
            const response = await axios.post(`${API_BASE_URL}/driver/add_bus`, payload, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFeedback(response.data.message);
            setNewBus({ bus_number: '', capacity: '', ticket_price: '' });
            fetchBuses();
        } catch (error) {
            setFeedback("Failed to add bus.");
        }
    };

    const handleRemoveBus = async (busId) => {
        try {
            await axios.delete(`${API_BASE_URL}/driver/remove_bus/${busId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFeedback("Bus removed successfully.");
            fetchBuses();
        } catch (error) {
            setFeedback("Failed to remove bus.");
        }
    };

    const handleUpdateBus = async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/driver/update_bus/${selectedBus.id}`, {
                bus_number: selectedBus.bus_number,
                capacity: parseInt(selectedBus.capacity),
                ticket_price: parseFloat(selectedBus.ticket_price)
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFeedback(response.data.message);
            setSelectedBus(null);
            fetchBuses();
        } catch (error) {
            setFeedback("Failed to update bus.");
        }
    };

    const handleAssignRoute = async () => {
        try {
            const response = await axios.put(`${API_BASE_URL}/driver/pick_route`, {
                bus_id: routeData.bus_id,
                route_id: routeData.route_id
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setFeedback(response.data.message);
            setRouteData({ bus_id: '', route_id: '' });
            fetchBuses();
        } catch (error) {
            setFeedback("Failed to assign route.");
        }
    };

    return (
        <div className="driver-dashboard">
            <h1>Driver Dashboard</h1>
            {feedback && <p className="feedback">{feedback}</p>}

            {/* Add Bus Section */}
            <div className="section">
                <h2>Add New Bus</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Bus Number"
                        value={newBus.bus_number}
                        onChange={e => setNewBus({ ...newBus, bus_number: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Capacity"
                        value={newBus.capacity}
                        onChange={e => setNewBus({ ...newBus, capacity: e.target.value })}
                    />
                    <input
                        type="number"
                        placeholder="Ticket Price"
                        value={newBus.ticket_price}
                        onChange={e => setNewBus({ ...newBus, ticket_price: e.target.value })}
                    />
                    <button onClick={handleAddBus}>Add Bus</button>
                </div>
            </div>

            {/* Assign Route Section */}
            <div className="section">
                <h2>Assign Route to Bus</h2>
                <div className="input-group">
                    <input
                        type="text"
                        placeholder="Bus ID"
                        value={routeData.bus_id}
                        onChange={e => setRouteData({ ...routeData, bus_id: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Route ID"
                        value={routeData.route_id}
                        onChange={e => setRouteData({ ...routeData, route_id: e.target.value })}
                    />
                    <button onClick={handleAssignRoute}>Assign Route</button>
                </div>
            </div>

            {/* My Buses Section */}
            <div className="section">
                <h2>My Buses</h2>
                <ul className="bus-list">
                    {buses.map(bus => (
                        <li key={bus.id}>
                            <span>Bus {bus.bus_number} - Seats: {bus.available_seats}/{bus.capacity} - Price: ${bus.ticket_price || 'N/A'}</span>
                            <div>
                                <button onClick={() => handleRemoveBus(bus.id)}>Remove</button>
                                <button onClick={() => setSelectedBus(bus)}>Edit</button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Edit Bus Section (only shows if selectedBus is not null) */}
            {selectedBus && (
                <div className="section edit-section">
                    <h2>Edit Bus - {selectedBus.bus_number}</h2>
                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Bus Number"
                            value={selectedBus.bus_number}
                            onChange={e => setSelectedBus({ ...selectedBus, bus_number: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Capacity"
                            value={selectedBus.capacity}
                            onChange={e => setSelectedBus({ ...selectedBus, capacity: e.target.value })}
                        />
                        <input
                            type="number"
                            placeholder="Ticket Price"
                            value={selectedBus.ticket_price}
                            onChange={e => setSelectedBus({ ...selectedBus, ticket_price: e.target.value })}
                        />
                        <div>
                            <button onClick={handleUpdateBus}>Update Bus</button>
                            <button className="cancel-btn" onClick={() => setSelectedBus(null)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DriverDashboard;
