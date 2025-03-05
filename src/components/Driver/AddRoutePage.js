import React, { useState } from "react";
import driverApi from "../../api/driverApi";
import "./DriverPages.css";

const AddRoutePage = () => {
    const [formData, setFormData] = useState({
        start_location: "",
        destination: ""
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await driverApi.createRoute(formData);
            alert("Route created successfully!");
            setFormData({ start_location: "", destination: "" });
        } catch (err) {
            setError("Failed to create route: " + err.message);
        }
    };

    return (
        <div className="driver-page">
            <h2>Add New Route</h2>
            {error && <p className="error">{error}</p>}
            <form onSubmit={handleSubmit} className="driver-form">
                <label>Start Location:</label>
                <input type="text" name="start_location" value={formData.start_location} onChange={handleChange} required />

                <label>Destination:</label>
                <input type="text" name="destination" value={formData.destination} onChange={handleChange} required />

                <button type="submit">Create Route</button>
            </form>
        </div>
    );
};

export default AddRoutePage;
