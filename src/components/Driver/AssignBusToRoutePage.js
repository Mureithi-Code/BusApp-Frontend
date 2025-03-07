import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import driverApi from "../../api/driverApi";
import './DriverPages.css';

const AssignBusToRoutePage = () => {
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedBus, setSelectedBus] = useState("");
    const [selectedRoute, setSelectedRoute] = useState("");
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const fetchedBuses = await driverApi.getDriverBuses();
            const fetchedRoutes = await driverApi.getDriverRoutes();
            setBuses(fetchedBuses);
            setRoutes(fetchedRoutes);
        } catch (error) {
            setFeedback({ type: "error", message: "Failed to load data." });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await driverApi.assignRoute(selectedBus, selectedRoute);
            setFeedback({ type: "success", message: response.message });
        } catch (error) {
            setFeedback({ type: "error", message: error.message || "Failed to assign bus to route." });
        }
    };

    return (
        <div className="page-container assign-bus-page">
            {/* Background Image */}
            <img
                src="https://media.istockphoto.com/id/1362859932/photo/blue-location-3d-icon-of-traffic-street-route-map-symbol-or-navigation-gps-pin-point-marker.jpg?s=1024x1024&w=is&k=20&c=dSO5mAOkpvM5HlSYxc2JIUn7gRvBm2NrNCf3tmIgeGs="
                alt="Background"
                className="page-background"
            />

            <div className="form-container">
                <h2 className="page-header">Assign Bus to Route</h2>

                {feedback && (
                    <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Select Bus</label>
                        <select value={selectedBus} onChange={(e) => setSelectedBus(e.target.value)} required>
                            <option value="">Select Bus</option>
                            {buses.map(bus => (
                                <option key={bus.id} value={bus.id}>
                                    {bus.bus_number} (Seats: {bus.capacity})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Select Route</label>
                        <select value={selectedRoute} onChange={(e) => setSelectedRoute(e.target.value)} required>
                            <option value="">Select Route</option>
                            {routes.map(route => (
                                <option key={route.id} value={route.id}>
                                    {route.start_location} ➡ {route.destination}
                                </option>
                            ))}
                        </select>
                    </div>

                    <button type="submit">Assign Bus to Route</button>
                </form>

                <button className="back-button" onClick={() => navigate("/driver-dashboard")}>Back to Dashboard</button>
            </div>
        </div>
    );
};

export default AssignBusToRoutePage;
