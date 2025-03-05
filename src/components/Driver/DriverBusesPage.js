import React, { useState, useEffect } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import './DriverPages.css';

const DriverBusesPage = () => {
    const [buses, setBuses] = useState([]);
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
            setFeedback("Failed to load buses.");
        }
    };

    const handleDeleteBus = async (busId) => {
        if (window.confirm("Are you sure you want to delete this bus?")) {
            try {
                await driverApi.deleteBus(busId);
                setBuses(buses.filter(bus => bus.id !== busId));
                setFeedback("Bus deleted successfully.");
            } catch (error) {
                setFeedback("Failed to delete bus.");
            }
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-header">My Buses</h2>

            {feedback && <div className="feedback">{feedback}</div>}

            {buses.length === 0 ? (
                <p>No buses available.</p>
            ) : (
                <ul className="bus-list">
                    {buses.map(bus => (
                        <li key={bus.id}>
                            <div>
                                <strong>{bus.bus_number}</strong> - Capacity: {bus.capacity} - Available Seats: {bus.available_seats}
                                <br />
                                Route: {bus.start_location || "Unassigned"} ➡ {bus.destination || "Unassigned"}
                                <br />
                                Ticket Price: ${bus.ticket_price}
                                <br />
                                Departure Time: {bus.departure_time || "Not Set"}
                            </div>
                            <button onClick={() => handleDeleteBus(bus.id)}>Delete Bus</button>
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => navigate("/driver-dashboard")}>Back to Dashboard</button>
        </div>
    );
};

export default DriverBusesPage;
