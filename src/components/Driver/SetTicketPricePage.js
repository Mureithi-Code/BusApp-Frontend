import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import driverApi from "../../api/driverApi";
import './DriverPages.css';

const SetTicketPricePage = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const fetchedBuses = await driverApi.getDriverBuses();
            setBuses(fetchedBuses);
        } catch (error) {
            setFeedback({ type: "error", message: "Failed to load buses." });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await driverApi.setTicketPrice(selectedBus, ticketPrice);
            setFeedback({ type: "success", message: response.message });
        } catch (error) {
            setFeedback({ type: "error", message: error.message || "Failed to set ticket price." });
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-header">Set Ticket Price</h2>

            {feedback && <div className={`feedback ${feedback.type}`}>{feedback.message}</div>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Select Bus</label>
                    <select value={selectedBus} onChange={(e) => setSelectedBus(e.target.value)} required>
                        <option value="">Select Bus</option>
                        {buses.map(bus => (
                            <option key={bus.id} value={bus.id}>
                                {bus.bus_number} (Current: ${bus.ticket_price})
                            </option>
                        ))}
                    </select>
                </div>
                <div className="form-group">
                    <label>New Ticket Price</label>
                    <input
                        type="number"
                        step="0.01"
                        value={ticketPrice}
                        onChange={(e) => setTicketPrice(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Set Ticket Price</button>
            </form>
            <button onClick={() => navigate("/driver-dashboard")}>Back to Dashboard</button>
        </div>
    );
};

export default SetTicketPricePage;
