import React, { useState } from "react";
import driverApi from "../../api/driverApi";
import "./DriverPages.css";

const AddBusPage = () => {
    const [formData, setFormData] = useState({
        bus_number: "",
        capacity: "",
        ticket_price: ""
    });

    const [errors, setErrors] = useState({
        bus_number: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === "bus_number") {
            const alphanumericRegex = /^[a-zA-Z0-9]*$/;

            if (!alphanumericRegex.test(value)) {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    bus_number: "Bus number can only contain letters and numbers."
                }));
                return; // Don't update formData if invalid
            } else {
                setErrors((prevErrors) => ({
                    ...prevErrors,
                    bus_number: "" // Clear error if valid
                }));
            }
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const busData = {
            ...formData,
            capacity: parseInt(formData.capacity, 10),
            ticket_price: parseFloat(formData.ticket_price || 0)
        };

        try {
            await driverApi.addBus(busData);
            alert("Bus added successfully!");
            setFormData({
                bus_number: "",
                capacity: "",
                ticket_price: ""
            });
        } catch (error) {
            console.error("Failed to add bus:", error);
            alert("Failed to add bus. Please try again.");
        }
    };

    return (
        <div className="driver-page">
            <h2>Add New Bus</h2>
            <form onSubmit={handleSubmit} className="driver-form">
                <div className="form-group">
                    <label>Bus Number:</label>
                    <input
                        type="text"
                        name="bus_number"
                        value={formData.bus_number}
                        onChange={handleChange}
                        required
                    />
                    {errors.bus_number && (
                        <span className="error-message">{errors.bus_number}</span>
                    )}
                </div>

                <div className="form-group">
                    <label>Capacity:</label>
                    <input
                        type="number"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Ticket Price (optional):</label>
                    <input
                        type="number"
                        name="ticket_price"
                        value={formData.ticket_price}
                        onChange={handleChange}
                        step="0.01"
                    />
                </div>

                <button type="submit" className="submit-button">Add Bus</button>
            </form>
        </div>
    );
};

export default AddBusPage;
