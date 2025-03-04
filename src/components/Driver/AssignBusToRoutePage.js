import React, { useState } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import "./DriverPages.css";

function AssignBusToRoutePage() {
    const [busId, setBusId] = useState("");
    const [routeId, setRouteId] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleAssign = async (e) => {
        e.preventDefault();
        try {
            await driverApi.assignBusToRoute(busId, { route_id: parseInt(routeId) });
            alert("Bus assigned to route successfully!");
            navigate("/driver-dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-container">
            <h2>Assign Bus to Route</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleAssign}>
                <label>Bus ID:</label>
                <input type="text" value={busId} onChange={(e) => setBusId(e.target.value)} required />

                <label>Route ID:</label>
                <input type="text" value={routeId} onChange={(e) => setRouteId(e.target.value)} required />

                <button type="submit">Assign Bus</button>
            </form>
            <button onClick={() => navigate("/driver-dashboard")} className="back-button">Back to Dashboard</button>
        </div>
    );
}

export default AssignBusToRoutePage;
