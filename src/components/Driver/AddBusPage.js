import React, { useState } from "react";
import driverApi from "../../api/driverApi";
import "./DriverPages.css";

const AddBusPage = () => {
    const [formData, setFormData] = useState({
        bus_number: "",
        capacity: "",
        ticket_price: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await driverApi.addBus({
                ...formData,
                capacity: parseInt(formData.capacity),
                ticket_price: parseFloat(formData.ticket_price || 0)
            });
            alert("Bus added successfully!");
            setFormData({ bus_number: "", capacity: "", ticket_price: "" });
        } catch (err) {
            setError("Failed to add bus: " + err.message);
        }
    };

    return (
        <div className="driver-page">
            <h2>Add New Bus</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="driver-form">
                <label>Bus Number:</label>
                <input type="text" name="bus_number" value={formData.bus_number} onChange={handleChange} required />

                <label>Capacity:</label>
                <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />

                <label>Ticket Price (optional):</label>
                <input type="number" name="ticket_price" value={formData.ticket_price} onChange={handleChange} step="0.01" />

                <button type="submit">Add Bus</button>
            </form>
        </div>
    );
};

export default AddBusPage;
