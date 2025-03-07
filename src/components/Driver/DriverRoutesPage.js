import React, { useState, useEffect } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
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
        <div className="page-container driver-routes-page">
            {/* Background Image */}
            <img
                src="https://images.pexels.com/photos/18355282/pexels-photo-18355282/free-photo-of-red-new-routemaster-bus-in-london.jpeg?auto=compress&cs=tinysrgb&w=600"
                alt="Background"
                className="page-background"
            />

            {/* Back to Dashboard Icon */}
            <FaHome
                className="back-to-dashboard-icon"
                title="Back to Dashboard"
                onClick={() => navigate("/driver-dashboard")}
            />

            <div className="form-container">
                <h2 className="page-header">My Routes</h2>

                {feedback && <div className="feedback">{feedback}</div>}

                {routes.length === 0 ? (
                    <p>No routes available.</p>
                ) : (
                    <ul className="route-list">
                        {routes.map(route => (
                            <li key={route.id}>
                                <div className="route-details">
                                    <strong>{route.start_location}</strong> ➡ <strong>{route.destination}</strong>
                                    <br />
                                    Departure Time: {route.departure_time || "Not Set"}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default DriverRoutesPage;
