import React, { useState, useEffect } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import "./DriverPages.css";

function DriverBusesPage() {
    const [buses, setBuses] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const data = await driverApi.getDriverBuses();
                setBuses(data);
            } catch (err) {
                setError(err.message);
            }
        };
        fetchBuses();
    }, []);

    return (
        <div className="page-container">
            <h2>Your Buses</h2>
            {error && <p className="error">{error}</p>}

            {buses.length === 0 ? (
                <p>No buses available.</p>
            ) : (
                <ul className="item-list">
                    {buses.map((bus) => (
                        <li key={bus.bus_id}>
                            <strong>{bus.bus_number}</strong> - {bus.capacity} seats<br />
                            Ticket Price: ${bus.ticket_price || "Not Set"}<br />
                            Departure Time: {bus.departure_time || "Not Set"}<br />
                            {bus.route_id ? `Assigned to Route ID: ${bus.route_id}` : "Not Assigned to Route"}
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => navigate("/driver-dashboard")} className="back-button">Back to Dashboard</button>
        </div>
    );
}

export default DriverBusesPage;
