import React, { useState, useEffect } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import "./DriverPages.css";

function DriverRoutesPage() {
    const [routes, setRoutes] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRoutes = async () => {
            try {
                const data = await driverApi.getDriverRoutes();
                setRoutes(data);
            } catch (err) {
                setError("Failed to fetch routes: " + err.message);
            }
        };
        fetchRoutes();
    }, []);

    return (
        <div className="page-container">
            <h2>Your Routes</h2>
            {error && <p className="error">{error}</p>}

            {routes.length === 0 ? (
                <p>No routes available.</p>
            ) : (
                <ul className="item-list">
                    {routes.map(route => (
                        <li key={route.id}>
                            <strong>{route.start_location} ➡ {route.destination}</strong><br />
                            Departure Time: {route.departure_time || "Not Set"}
                        </li>
                    ))}
                </ul>
            )}

            <button onClick={() => navigate("/driver-dashboard")} className="back-button">Back to Dashboard</button>
        </div>
    );
}

export default DriverRoutesPage;
