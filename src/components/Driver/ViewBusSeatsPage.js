import React, { useEffect, useState } from "react";
import driverApi from "../../api/driverApi";
import "./DriverPages.css";

function ViewBusSeatsPage() {
    const [buses, setBuses] = useState([]);
    const [selectedBusId, setSelectedBusId] = useState("");
    const [seatsInfo, setSeatsInfo] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const fetchedBuses = await driverApi.getDriverBuses();
                setBuses(fetchedBuses);
                if (fetchedBuses.length > 0) {
                    setSelectedBusId(fetchedBuses[0].id);
                    fetchSeats(fetchedBuses[0].id);  // Auto-fetch seats for first bus
                }
            } catch (err) {
                setError("Failed to fetch buses: " + err.message);
            }
        };

        fetchBuses();
    }, []);

    const fetchSeats = async (busId) => {
        try {
            const data = await driverApi.getBusSeats(busId);
            setSeatsInfo(data);
        } catch (err) {
            setError("Failed to fetch seat data: " + err.message);
            setSeatsInfo(null);
        }
    };

    const handleBusChange = (e) => {
        const busId = e.target.value;
        setSelectedBusId(busId);
        fetchSeats(busId);
    };

    return (
        <div className="page-container">
            <h2>View Bus Seats</h2>
            {error && <p className="error">{error}</p>}

            {buses.length > 0 ? (
                <>
                    <label>Select Bus:</label>
                    <select value={selectedBusId} onChange={handleBusChange}>
                        {buses.map(bus => (
                            <option key={bus.id} value={bus.id}>
                                {bus.bus_number} (ID: {bus.id})
                            </option>
                        ))}
                    </select>
                    {seatsInfo && (
                        <div>
                            <p><strong>Bus Number:</strong> {seatsInfo.bus_number}</p>
                            <p><strong>Total Seats:</strong> {seatsInfo.total_seats}</p>
                            <p><strong>Available Seats:</strong> {seatsInfo.available_seats}</p>
                            <p><strong>Booked Seats:</strong> {seatsInfo.booked_seats}</p>
                        </div>
                    )}
                </>
            ) : (
                <p>No buses available.</p>
            )}
        </div>
    );
}

export default ViewBusSeatsPage;
