import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authApi from "../../api/authApi";
import "./Auth.css";  // This stays the same — updated CSS will handle the new styles.

function LoginForm() {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        try {
            const response = await authApi.login(credentials);
            console.log("Login response:", response);

            setMessage("✅ Login successful!");

            localStorage.setItem("token", response.token);
            localStorage.setItem("role", response.role);

            if (response.role === "Driver") {
                localStorage.setItem("driver_id", response.driver_id);
                localStorage.setItem("driver_name", response.name);
            } else if (response.role === "Customer") {
                localStorage.setItem("customer_id", response.customer_id);
                console.log("Stored customer_id:", localStorage.getItem("customer_id"));
                localStorage.setItem("customer_name", response.name);
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
                    setMessage("❓ Unknown role, please contact support.");
            }
        } catch (error) {
            setMessage(`❌ Login failed: ${error.message || "Please check your credentials."}`);
        }
    };

    return (
        <div className="auth-container">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={credentials.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={credentials.password}
                    onChange={handleChange}
                    required
                />
                <button type="submit">Login</button>
            </form>
            {message && (
                <p className={`auth-message ${message.startsWith("✅") ? "success" : "error"}`}>
                    {message}
                </p>
            )}
            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
    );
}

export default LoginForm;
