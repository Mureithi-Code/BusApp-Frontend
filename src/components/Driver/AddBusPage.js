import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import driverApi from "../../api/driverApi";
import './DriverPages.css';

const AddBusPage = () => {
    const [formData, setFormData] = useState({
        bus_number: "",
        capacity: "",
        ticket_price: "",
    });
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await driverApi.addBus(formData);
            setFeedback({ type: "success", message: response.message });
        } catch (error) {
            setFeedback({ type: "error", message: error.message || "Failed to add bus." });
        }
    };

    return (
        <div className="page-container add-bus-page">
            {/* Background Image */}
            <img
                src="https://images.pexels.com/photos/9828257/pexels-photo-9828257.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                alt="Bus Background"
                className="page-background"
            />

            <div className="form-container">
                <h2 className="page-header">Add New Bus</h2>

                {feedback && (
                    <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Bus Number</label>
                        <input type="text" name="bus_number" value={formData.bus_number} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Capacity</label>
                        <input type="number" name="capacity" value={formData.capacity} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Ticket Price</label>
                        <input type="number" step="0.01" name="ticket_price" value={formData.ticket_price} onChange={handleChange} required />
                    </div>
                    <button type="submit">Add Bus</button>
                </form>

                <button className="back-button" onClick={() => navigate("/driver-dashboard")}>Back to Dashboard</button>
            </div>
        </div>
    );
};

export default AddBusPage;
