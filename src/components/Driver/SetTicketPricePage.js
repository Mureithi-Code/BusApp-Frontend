import React, { useState } from "react";
import driverApi from "../../api/driverApi";
import { useNavigate } from "react-router-dom";
import "./DriverPages.css";

function SetTicketPricePage() {
    const [busId, setBusId] = useState("");
    const [ticketPrice, setTicketPrice] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSetPrice = async (e) => {
        e.preventDefault();
        try {
            await driverApi.setTicketPrice(busId, { ticket_price: parseFloat(ticketPrice) });
            alert("Ticket price updated successfully!");
            navigate("/driver-dashboard");
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-container">
            <h2>Set Ticket Price</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSetPrice}>
                <label>Bus ID:</label>
                <input type="text" value={busId} onChange={(e) => setBusId(e.target.value)} required />

                <label>Ticket Price:</label>
                <input type="number" value={ticketPrice} onChange={(e) => setTicketPrice(e.target.value)} required />

                <button type="submit">Set Ticket Price</button>
            </form>
            <button onClick={() => navigate("/driver-dashboard")} className="back-button">Back to Dashboard</button>
        </div>
    );
}

export default SetTicketPricePage;
