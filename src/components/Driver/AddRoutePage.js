import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import driverApi from "../../api/driverApi";
import './DriverPages.css';

const AddRoutePage = () => {
    const [formData, setFormData] = useState({
        start_location: "",
        destination: "",
    });
    const [feedback, setFeedback] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await driverApi.createRoute(formData);
            setFeedback({ type: "success", message: response.message });
        } catch (error) {
            setFeedback({ type: "error", message: error.message || "Failed to create route." });
        }
    };

    return (
        <div className="page-container add-route-page">
            {/* Background Image */}
            <img
                src="https://images.pexels.com/photos/28855804/pexels-photo-28855804/free-photo-of-view-from-london-double-decker-bus-on-busy-street.jpeg?auto=compress&cs=tinysrgb&w=800&lazy=load"
                alt="Background"
                className="page-background"
            />

            <div className="form-container">
                <h2 className="page-header">Add New Route</h2>

                {feedback && (
                    <div className={`feedback ${feedback.type}`}>{feedback.message}</div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Start Location</label>
                        <input type="text" name="start_location" value={formData.start_location} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label>Destination</label>
                        <input type="text" name="destination" value={formData.destination} onChange={handleChange} required />
                    </div>
                    <button type="submit">Create Route</button>
                </form>

                <button className="back-button" onClick={() => navigate("/driver-dashboard")}>Back to Dashboard</button>
            </div>
        </div>
    );
};

export default AddRoutePage;
