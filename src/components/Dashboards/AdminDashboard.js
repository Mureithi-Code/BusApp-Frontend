import React, { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [drivers, setDrivers] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [messages, setMessages] = useState([]);
    const [feedback, setFeedback] = useState("");

    const [driverId, setDriverId] = useState("");
    const [routeId, setRouteId] = useState("");
    const [messageId, setMessageId] = useState("");
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const driversData = await adminApi.getAllDrivers();
            const routesData = await adminApi.getAllRoutes();
            const messagesData = await adminApi.getAllMessages();
            setDrivers(driversData);
            setRoutes(routesData);
            setMessages(messagesData);
        } catch (error) {
            console.error("Failed to fetch data", error);
        }
    };

    const handleRemoveDriver = async () => {
        try {
            const response = await adminApi.removeDriver(driverId);
            setFeedback(response.message);
            fetchData(); // Refresh data
        } catch (error) {
            setFeedback(error.response?.data?.error || "Failed to remove driver.");
        }
    };

    const handleCancelRoute = async () => {
        try {
            const response = await adminApi.cancelRoute(routeId);
            setFeedback(response.message);
            fetchData(); // Refresh data
        } catch (error) {
            setFeedback(error.response?.data?.error || "Failed to cancel route.");
        }
    };

    const handleReplyMessage = async () => {
        try {
            const response = await adminApi.replyMessage(messageId, replyText);
            setFeedback(response.message);
        } catch (error) {
            setFeedback(error.response?.data?.error || "Failed to reply to message.");
        }
    };

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>

            {/* Remove Driver */}
            <div className="admin-action">
                <h3>Remove Driver</h3>
                <input
                    type="number"
                    placeholder="Driver ID"
                    value={driverId}
                    onChange={(e) => setDriverId(e.target.value)}
                />
                <button onClick={handleRemoveDriver}>Remove Driver</button>
            </div>

            {/* Cancel Route */}
            <div className="admin-action">
                <h3>Cancel Route</h3>
                <input
                    type="number"
                    placeholder="Route ID"
                    value={routeId}
                    onChange={(e) => setRouteId(e.target.value)}
                />
                <button onClick={handleCancelRoute}>Cancel Route</button>
            </div>

            {/* Reply to Message */}
            <div className="admin-action">
                <h3>Reply to Message</h3>
                <input
                    type="number"
                    placeholder="Message ID"
                    value={messageId}
                    onChange={(e) => setMessageId(e.target.value)}
                />
                <textarea
                    placeholder="Reply Text"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                />
                <button onClick={handleReplyMessage}>Send Reply</button>
            </div>

            {/* Feedback */}
            {feedback && <p className="admin-feedback">{feedback}</p>}

            {/* View All Data Sections */}
            <div className="admin-section">
                <h3>All Drivers</h3>
                <ul>
                    {drivers.map(driver => (
                        <li key={driver.id}>{driver.name} ({driver.email})</li>
                    ))}
                </ul>
            </div>

            <div className="admin-section">
                <h3>All Routes</h3>
                <ul>
                    {routes.map(route => (
                        <li key={route.id}>{route.start} to {route.end} at {route.time}</li>
                    ))}
                </ul>
            </div>

            <div className="admin-section">
                <h3>All Messages</h3>
                <ul>
                    {messages.map(message => (
                        <li key={message.id}>From Customer {message.customer_id}: {message.content}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default AdminDashboard;
