import React, { useState, useEffect } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import "./DriverPages.css";

const SetTicketPricePage = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBusId, setSelectedBusId] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBuses = async () => {
            try {
                const buses = await driverApi.getDriverBuses();
                setBuses(buses);
                if (buses.length > 0) setSelectedBusId(buses[0].id);
            } catch (err) {
                setError("Failed to fetch buses: " + err.message);
            }
        };
        fetchBuses();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await driverApi.setTicketPrice(selectedBusId, parseFloat(ticketPrice));
            alert("Ticket price updated successfully!");
            navigate("/driver-dashboard");
        } catch (err) {
            setError("Failed to update ticket price: " + err.message);
        }
    };

    return (
        <div className="driver-page">
            <h2>Set Ticket Price</h2>
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
                <label>Ticket Price:</label>
                <input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} required />

                <button type="submit">Update Price</button>
            </form>
        </div>
    );
};

export default SetTicketPricePage;
