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
                const response = await driverApi.getBuses();
                setBuses(response.buses);
            } catch (err) {
                setError("Failed to fetch buses.");
            }
        };

        fetchBuses();
    }, []);

    const handleSetTime = async (e) => {
        e.preventDefault();
        if (!selectedBusId) {
            setError("Please select a bus.");
            return;
        }

        try {
            await driverApi.setDepartureTime(selectedBusId, { departure_time: departureTime });
            alert("Departure time set successfully!");
            navigate("/driver-dashboard");
        } catch (err) {
            setError(err.message || "Failed to set departure time.");
        }
    };

    return (
        <div className="page-container">
            <h2>Set Departure Time</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSetTime}>
                <label>Select Bus:</label>
                <select
                    value={selectedBusId}
                    onChange={(e) => setSelectedBusId(e.target.value)}
                    required
                >
                    <option value="">-- Select a Bus --</option>
                    {buses.map((bus) => (
                        <option
                            key={bus.id}
                            value={bus.id}
                            disabled={!bus.route_id}  // 🔴 Disable if bus has no route
                        >
                            {bus.bus_number} 
                            {bus.route_id
                                ? ` (Route: ${bus.start_location} to ${bus.destination})`
                                : " (No route assigned)"}
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
