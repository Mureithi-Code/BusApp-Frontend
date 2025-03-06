import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "./Auth.css";
import { Link } from 'react-router-dom';

function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "Customer"
    });

    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authApi.register(formData);
            setMessage(response.message);
            setTimeout(() => navigate("/"), 2000);
        } catch (error) {
            setMessage(error.response?.data?.error || "Registration failed.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />
                <select name="role" value={formData.role} onChange={handleChange} required>
                    <option value="Customer">Customer</option>
                    <option value="Driver">Driver</option>
                    <option value="Admin">Admin</option>
                </select>
                <button type="submit">Register</button>
            </form>
            {message && <p className="auth-message">{message}</p>}
            <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
    );
}

export default RegisterForm;
