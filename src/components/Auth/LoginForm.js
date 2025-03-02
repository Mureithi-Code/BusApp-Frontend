import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "./Auth.css";

function LoginForm() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await authApi.login(credentials);
            setMessage("Login successful!");

            localStorage.setItem("token", response.token);
            localStorage.setItem("role", response.role);

            if (response.role === "Driver") {
                localStorage.setItem("driver_id", response.driver_id);   // Save driver_id
                localStorage.setItem("driver_name", response.name);    
            }

            switch (response.role) {
                case "Admin":
                    navigate("/admin-dashboard");
                    break;
                case "Driver":
                    navigate("/driver-dashboard");
                    break;
                case "Customer":
                    navigate("/customer-dashboard");
                    break;
                default:
                    setMessage("Unknown role, please contact support.");
            }
        } catch (error) {
            setMessage(error.message || "Login failed.");
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
            {message && <p className="auth-message">{message}</p>}
            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
    );
}

export default LoginForm;
