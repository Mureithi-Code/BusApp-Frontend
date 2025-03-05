import React, { useEffect, useState } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import "./DriverPages.css";

const AssignBusToRoutePage = () => {
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [selectedBusId, setSelectedBusId] = useState("");
    const [selectedRouteId, setSelectedRouteId] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const busData = await driverApi.getDriverBuses();
                const routeData = await driverApi.getDriverRoutes();
                setBuses(busData);
                setRoutes(routeData);
                if (busData.length > 0) setSelectedBusId(busData[0].id);
                if (routeData.length > 0) setSelectedRouteId(routeData[0].id);
            } catch (err) {
                setError("Failed to load data: " + err.message);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await driverApi.assignRoute(selectedBusId, selectedRouteId);
            alert("Bus assigned to route successfully!");
            navigate("/driver-dashboard");
        } catch (err) {
            setError("Failed to assign bus to route: " + err.message);
        }
    };

    return (
        <div className="driver-page">
            <h2>Assign Bus to Route</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit}>
                <label>Bus:</label>
                <select value={selectedBusId} onChange={(e) => setSelectedBusId(e.target.value)}>
                    {buses.map(bus => (
                        <option key={bus.id} value={bus.id}>
                            {bus.bus_number}
                        </option>
                    ))}
                </select>

                <label>Route:</label>
                <select value={selectedRouteId} onChange={(e) => setSelectedRouteId(e.target.value)}>
                    {routes.map(route => (
                        <option key={route.id} value={route.id}>
                            {route.start_location} to {route.destination}
                        </option>
                    ))}
                </select>

                <button type="submit">Assign Bus</button>
            </form>
        </div>
    );
};

export default AssignBusToRoutePage;
