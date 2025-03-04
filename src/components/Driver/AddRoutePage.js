import React, { useState } from "react";
import driverApi from "../../api/driverApi";
import "./DriverPages.css"; 

const AddRoutePage = () => {
    const [formData, setFormData] = useState({
        start_location: "",
        destination: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await driverApi.createRoute(formData);
            alert("Route created successfully!");
            setFormData({ start_location: "", destination: "" }); // Clear form after success
        } catch (error) {
            console.error("Failed to create route:", error);
            alert("Failed to create route. Please try again.");
        }
    };

    return (
        <div className="driver-page">
            <h2>Add New Route</h2>
            <form onSubmit={handleSubmit} className="driver-form">
                <div className="form-group">
                    <label>Start Location:</label>
                    <input
                        type="text"
                        name="start_location"
                        value={formData.start_location}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Destination:</label>
                    <input
                        type="text"
                        name="destination"
                        value={formData.destination}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button type="submit" className="submit-button">Create Route</button>
            </form>
        </div>
    );
};

export default AddRoutePage;
