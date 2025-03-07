import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import driverApi from "../../api/driverApi";
import './DriverPages.css';

const SetDepartureTimePage = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState("");
    const [departureTime, setDepartureTime] = useState("");
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const fetchedBuses = await driverApi.getDriverBuses();
            setBuses(fetchedBuses.filter(bus => bus.route_id));  // Only buses with routes
        } catch (error) {
            setFeedback({ type: "error", message: "Failed to load buses." });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await driverApi.setDepartureTime(selectedBus, departureTime);
            setFeedback({ type: "success", message: response.message });
        } catch (error) {
            setFeedback({ type: "error", message: error.message || "Failed to set departure time." });
        }
    };

    return (
        <div className="page-container set-departure-time-page">
            {/* Background Image */}
            <img
                src="https://media.istockphoto.com/id/1433545168/photo/red-sand-running-through-bulbs-of-hourglass-on-december-calendar-countdown-to-christmas-and.jpg?s=1024x1024&w=is&k=20&c=XjIKBKPKsZ7Bask0OC4MPlOYKfziZf4_IHCjw7_tCTY="
                alt="Background"
                className="page-background"
            />

            <div className="form-container">
                <h2 className="page-header">Set Departure Time</h2>

                {feedback && <div className={`feedback ${feedback.type}`}>{feedback.message}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Bus (only buses with routes)</label>
                        <select value={selectedBus} onChange={(e) => setSelectedBus(e.target.value)} required>
                            <option value="">Select Bus</option>
                            {buses.map(bus => (
                                <option key={bus.id} value={bus.id}>
                                    {bus.bus_number} ({bus.start_location} ➡ {bus.destination})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Departure Time</label>
                        <input
                            type="datetime-local"
                            value={departureTime}
                            onChange={(e) => setDepartureTime(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit">Set Departure Time</button>
                </form>

                <button className="back-button" onClick={() => navigate("/driver-dashboard")}>Back to Dashboard</button>
            </div>
        </div>
    );
};

export default SetDepartureTimePage;
