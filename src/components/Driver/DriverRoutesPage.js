import React, { useState, useEffect } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import './DriverPages.css';

const DriverRoutesPage = () => {
    const [routes, setRoutes] = useState([]);
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        try {
            const fetchedRoutes = await driverApi.getDriverRoutes();
            setRoutes(fetchedRoutes);
        } catch (error) {
            setFeedback("Failed to load routes.");
        }
    };

    return (
        <div className="page-container">
            <h2 className="page-header">My Routes</h2>

            {feedback && <div className="feedback">{feedback}</div>}

            {routes.length === 0 ? (
                <p>No routes available.</p>
            ) : (
                <ul className="route-list">
                    {routes.map(route => (
                        <li key={route.id}>
                            <div>
                                <strong>{route.start_location}</strong> ➡ <strong>{route.destination}</strong>
                                <br />
                                Departure Time: {route.departure_time || "Not Set"}
                            </div>
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => navigate("/driver-dashboard")}>Back to Dashboard</button>
        </div>
    );
};

export default DriverRoutesPage;
