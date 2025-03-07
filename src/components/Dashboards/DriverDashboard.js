import React, { useState, useEffect } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import "./DriverDashboard.css";
import { FaSignOutAlt } from 'react-icons/fa';

function DriverDashboard() {
    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            const fetchedRoutes = await driverApi.getDriverRoutes();
            setRoutes(fetchedRoutes);

            const fetchedBuses = await driverApi.getDriverBuses();
            setBuses(fetchedBuses);
        } catch (err) {
            setError(err?.message || "Failed to fetch data");
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleBusClick = (bus) => {
        setSelectedBus(bus);
    };

    const handleDeleteBus = async (busId) => {
        if (window.confirm("Are you sure you want to delete this bus?")) {
            try {
                await driverApi.deleteBus(busId);
                setBuses(buses.filter(bus => bus.id !== busId));
                setSelectedBus(null);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="driver-dashboard">

            {/* Background Image */}
            <img
                src="https://images.pexels.com/photos/20152874/pexels-photo-20152874/free-photo-of-red-bus-on-a-street-in-london.jpeg"
                alt="Background"
                className="dashboard-background"
            />

            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-footer">
                    <h2>Driver Dashboard</h2>
                    {/* Logout Icon in Header */}
                    <FaSignOutAlt className="logout-icon" onClick={handleLogout} title="Logout" />
                </div>
                <nav className="sidebar-nav">
                    <button onClick={() => navigate("/driver/add-route")}>Add Route</button>
                    <button onClick={() => navigate("/driver/add-bus")}>Add Bus</button>
                    <button onClick={() => navigate("/driver/assign-bus-route")}>Assign Bus to Route</button>
                    <button onClick={() => navigate("/driver/set-departure-time")}>Set Departure Time</button>
                    <button onClick={() => navigate("/driver/set-ticket-price")}>Set Ticket Price</button>
                    <button onClick={() => navigate("/driver/view-bus-seats")}>View Bus Seats</button>
                    <button onClick={() => navigate("/driver/view-routes")}>View Routes</button>
                    <button onClick={() => navigate("/driver/view-buses")}>View Buses</button>
                </nav>
            </div>

            {/* Main Content */}
            <div className="dashboard-content">
                <header className="dashboard-header">
                    <h2>Driver Dashboard</h2>
                </header>

                {error && <p className="error">{error}</p>}

                {/* Routes Section */}
                <div className="section">
                    <h3>Your Routes</h3>
                    {Array.isArray(routes) && routes.length === 0 ? (
                        <p>No routes created yet.</p>
                    ) : (
                        <ul>
                            {Array.isArray(routes) && routes.map(route => (
                                <li key={route.id}>
                                    {route.start_location} ➡ {route.destination} ({route.departure_time || "No Departure Time Set"})
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Buses Section */}
                <div className="section">
                    <h3>Your Buses</h3>
                    {Array.isArray(buses) && buses.length === 0 ? (
                        <p>No buses added yet.</p>
                    ) : (
                        <ul>
                            {Array.isArray(buses) && buses.map(bus => (
                                <li key={bus.id} onClick={() => handleBusClick(bus)}>
                                    Bus {bus.bus_number} - {bus.start_location || "Unassigned"}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Selected Bus Details */}
                {selectedBus && (
                    <div className="section">
                        <h3>Bus Details - {selectedBus.bus_number}</h3>
                        <p><strong>Capacity:</strong> {selectedBus.capacity}</p>
                        <p><strong>Price per Seat:</strong> ${selectedBus.ticket_price}</p>
                        <p><strong>Departure Time:</strong> {selectedBus.departure_time || "Not Set"}</p>
                        {selectedBus.route_id ? (
                            <p><strong>Route:</strong> {selectedBus.start_location} ➡ {selectedBus.destination}</p>
                        ) : (
                            <p>No Route Assigned</p>
                        )}
                        <button onClick={() => handleDeleteBus(selectedBus.id)}>Delete Bus</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DriverDashboard;
