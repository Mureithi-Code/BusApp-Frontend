import React, { useState, useEffect } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import "./DriverPages.css";

function SetDepartureTimePage() {
    const [buses, setBuses] = useState([]);
    const [selectedBusId, setSelectedBusId] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const allBuses = await driverApi.getDriverBuses();
                const busesWithRoutes = allBuses.filter(bus => bus.route_id);  // Only buses with assigned routes
                setBuses(busesWithRoutes);

                if (busesWithRoutes.length > 0) {
                    setSelectedBusId(busesWithRoutes[0].id);  // Auto-select first bus
                } else {
                    setError("No buses with assigned routes found.");
                }
            } catch (err) {
                setError("Failed to fetch buses: " + err.message);
            }
        };

        fetchBuses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await driverApi.setDepartureTime(selectedBusId, departureTime);
            alert("Departure time set successfully!");
            navigate("/driver-dashboard");
        } catch (err) {
            setError("Failed to set departure time: " + err.message);
        }
    };

    return (
        <div className="page-container">
            <h2>Set Departure Time</h2>
            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label>Bus:</label>
                <select
                    value={selectedBusId}
                    onChange={(e) => setSelectedBusId(e.target.value)}
                    required
                >
                    {buses.map(bus => (
                        <option key={bus.id} value={bus.id}>
                            {bus.bus_number} ({bus.start_location} to {bus.destination})
                        </option>
                    ))}
                </select>

                <label>Departure Time:</label>
                <input
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                    required
                />

                <button type="submit">Set Departure Time</button>
            </form>

            <button onClick={() => navigate("/driver-dashboard")} className="back-button">
                Back to Dashboard
            </button>
        </div>
    );
}

export default SetDepartureTimePage;
