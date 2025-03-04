import React, { useState } from "react";
import driverApi from "../../api/driverApi";
import "./DriverPages.css";

function ViewBusSeatsPage() {
    const [busId, setBusId] = useState("");
    const [seatsInfo, setSeatsInfo] = useState(null);
    const [error, setError] = useState("");

    const fetchSeats = async () => {
        try {
            const data = await driverApi.getBusSeats(busId);
            setSeatsInfo(data);
            setError("");
        } catch (err) {
            setError(err.message);
            setSeatsInfo(null);
        }
    };

    return (
        <div className="page-container">
            <h2>View Bus Seats</h2>
            <label>Bus ID:</label>
            <input type="text" value={busId} onChange={(e) => setBusId(e.target.value)} />
            <button onClick={fetchSeats}>View Seats</button>

            {error && <p className="error">{error}</p>}
            {seatsInfo && (
                <div>
                    <p><strong>Bus Number:</strong> {seatsInfo.bus_number}</p>
                    <p><strong>Total Seats:</strong> {seatsInfo.total_seats}</p>
                    <p><strong>Available Seats:</strong> {seatsInfo.available_seats}</p>
                    <p><strong>Booked Seats:</strong> {seatsInfo.booked_seats}</p>
                </div>
            )}
        </div>
    );
}

export default ViewBusSeatsPage;
