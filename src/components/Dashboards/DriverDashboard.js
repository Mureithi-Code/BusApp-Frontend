import React, { useState, useEffect } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import "./DriverDashboard.css"; // Optional

function DriverDashboard() {
    const [routes, setRoutes] = useState([]);
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const fetchDashboardData = async () => {
        try {
            const fetchedRoutes = await driverApi.getDriverRoutes();
            setRoutes(fetchedRoutes);  // This now works because driverApi returns array directly

            const fetchedBuses = await driverApi.getDriverBuses();
            setBuses(fetchedBuses);
        } catch (err) {
            setError(err.message);
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
                setBuses(buses.filter(bus => bus.bus_id !== busId));
                setSelectedBus(null);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    return (
        <div className="driver-dashboard">
            <header>
                <h2>Driver Dashboard</h2>
                <nav>
                    <button onClick={() => navigate("/driver/add-route")}>Add Route</button>
                    <button onClick={() => navigate("/driver/add-bus")}>Add Bus</button>
                    <button onClick={handleLogout}>Logout</button>
                </nav>
            </header>

            {error && <p className="error">{error}</p>}

            <div className="dashboard-content">
                <div className="section">
                    <h3>Your Routes</h3>
                    {routes.length === 0 ? (
                        <p>No routes created yet.</p>
                    ) : (
                        <ul>
                            {routes.map(route => (
                                <li key={route.route_id}>
                                    {route.start_location} ➡ {route.destination}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className="section">
                    <h3>Your Buses</h3>
                    {buses.length === 0 ? (
                        <p>No buses added yet.</p>
                    ) : (
                        <ul>
                            {buses.map(bus => (
                                <li key={bus.bus_id} onClick={() => handleBusClick(bus)}>
                                    Bus {bus.bus_number} - {bus.bus_name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {selectedBus && (
                    <div className="section">
                        <h3>Bus Details - {selectedBus.bus_number}</h3>
                        <p><strong>Name:</strong> {selectedBus.bus_name}</p>
                        <p><strong>Seats:</strong> {selectedBus.total_seats}</p>
                        <p><strong>Price per Seat:</strong> {selectedBus.ticket_price}</p>
                        <p><strong>Departure Time:</strong> {selectedBus.departure_time || "Not Set"}</p>
                        <button onClick={() => handleDeleteBus(selectedBus.bus_id)}>Delete Bus</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DriverDashboard;
