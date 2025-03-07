import React, { useState, useEffect } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
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
        <div className="page-container driver-buses-page">
            {/* Background Image */}
            <img
                src="https://images.pexels.com/photos/29381892/pexels-photo-29381892/free-photo-of-busan-bus-station-with-mountain-backdrop.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Background"
                className="page-background"
            />

            {/* Top-left Back to Dashboard Icon */}
            <FaHome
                className="back-to-dashboard-icon"
                title="Back to Dashboard"
                onClick={() => navigate("/driver-dashboard")}
            />

            <div className="form-container">
                <h2 className="page-header">My Buses</h2>

                {feedback && <div className="feedback">{feedback}</div>}

                {buses.length === 0 ? (
                    <p>No buses available.</p>
                ) : (
                    <ul className="bus-list">
                        {buses.map(bus => (
                            <li key={bus.id}>
                                <div className="bus-details">
                                    <strong>{bus.bus_number}</strong> - Capacity: {bus.capacity} - Available Seats: {bus.available_seats}
                                    <br />
                                    Route: {bus.start_location || "Unassigned"} ➡ {bus.destination || "Unassigned"}
                                    <br />
                                    Ticket Price: ${bus.ticket_price}
                                    <br />
                                    Departure Time: {bus.departure_time || "Not Set"}
                                </div>
                                <button className="delete-button" onClick={() => handleDeleteBus(bus.id)}>Delete Bus</button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DriverBusesPage;
