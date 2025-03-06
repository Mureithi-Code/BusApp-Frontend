import React, { useState, useEffect } from "react";
import adminApi from "../../api/adminApi";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [drivers, setDrivers] = useState([]);
    const [messages, setMessages] = useState([]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [feedback, setFeedback] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const fetchedBuses = await adminApi.getAllBuses();
            const fetchedRoutes = await adminApi.getAllRoutes();
            const fetchedDrivers = await adminApi.getAllDrivers();
            const fetchedMessages = await adminApi.getAllMessages();

            console.log("Buses:", fetchedBuses);
            console.log("Routes:", fetchedRoutes);
            console.log("Drivers:", fetchedDrivers);
            console.log("Messages:", fetchedMessages);

            setBuses(Array.isArray(fetchedBuses) ? fetchedBuses : []);
            setRoutes(Array.isArray(fetchedRoutes) ? fetchedRoutes : []);
            setDrivers(Array.isArray(fetchedDrivers) ? fetchedDrivers : []);
            setMessages(Array.isArray(fetchedMessages) ? fetchedMessages : []);
        } catch (error) {
            setFeedback(error.message || "Failed to load data.");
        }
    };

    const handleRemoveDriver = async (driverId) => {
        if (!window.confirm("Are you sure you want to remove this driver?")) return;

        try {
            await adminApi.removeDriver(driverId);
            setFeedback("Driver removed successfully.");
            fetchData();
        } catch (error) {
            setFeedback(error.message);
        }
    };

    const handleCancelRoute = async (routeId) => {
        if (!window.confirm("Are you sure you want to cancel this route?")) return;

        try {
            await adminApi.cancelRoute(routeId);
            setFeedback("Route canceled successfully.");
            fetchData();
        } catch (error) {
            setFeedback(error.message);
        }
    };

    const handleReplyMessage = async () => {
        if (!selectedMessage || !replyContent.trim()) {
            setFeedback("Please select a message and write a reply.");
            return;
        }

        try {
            await adminApi.replyMessage(selectedMessage.id, replyContent);
            setFeedback("Reply sent successfully.");
            setReplyContent("");
            fetchData();
        } catch (error) {
            setFeedback(error.message);
        }
    };

    return (
        <div className="admin-dashboard">
            {/* Sidebar Navigation */}
            <aside className="sidebar">
                <h2>Admin Panel</h2>
                <ul>
                    <li><a href="#buses">View Buses</a></li>
                    <li><a href="#routes">View Routes</a></li>
                    <li><a href="#drivers">Manage Drivers</a></li>
                    <li><a href="#messages">View Messages</a></li>
                </ul>
            </aside>

            <main className="content">
                <h1>Admin Dashboard</h1>

                {feedback && <div className="feedback">{feedback}</div>}

                {/* Buses Section */}
                <section id="buses">
                    <h2>All Buses (Assigned & Unassigned)</h2>
                    {buses.length === 0 ? (
                        <p>No buses available.</p>
                    ) : (
                        <ul>
                            {buses.map(bus => (
                                <li key={bus.id}>
                                    <strong>Bus {bus.bus_number}</strong>
                                    <div>
                                        {bus.route_id
                                            ? `Assigned to Route ID ${bus.route_id}`
                                            : "Unassigned (No Route)"}
                                    </div>
                                    <div>Ticket Price: ${bus.ticket_price}</div>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Routes Section */}
                <section id="routes">
                    <h2>All Routes (With & Without Buses)</h2>
                    {routes.length === 0 ? (
                        <p>No routes available.</p>
                    ) : (
                        <ul>
                            {routes.map(route => (
                                <li key={route.id}>
                                    <strong>{route.start_location} ➡ {route.destination}</strong>
                                    <div>
                                        {route.bus_id
                                            ? `Bus ID ${route.bus_id} Assigned`
                                            : "No Bus Assigned"}
                                    </div>
                                    <button onClick={() => handleCancelRoute(route.id)}>Cancel Route</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Drivers Section */}
                <section id="drivers">
                    <h2>Manage Drivers</h2>
                    {drivers.length === 0 ? (
                        <p>No drivers available.</p>
                    ) : (
                        <ul>
                            {drivers.map(driver => (
                                <li key={driver.id}>
                                    <strong>{driver.name}</strong> ({driver.email})
                                    <button onClick={() => handleRemoveDriver(driver.id)}>Remove Driver</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Messages Section */}
                <section id="messages">
                    <h2>Customer Messages</h2>
                    {messages.length === 0 ? (
                        <p>No messages found.</p>
                    ) : (
                        <div className="messages-container">
                            <ul className="message-list">
                                {messages.map(message => (
                                    <li 
                                        key={message.id} 
                                        className={selectedMessage?.id === message.id ? "selected" : ""}
                                        onClick={() => setSelectedMessage(message)}
                                    >
                                        <strong>From User {message.sender_id}:</strong> {message.content}
                                    </li>
                                ))}
                            </ul>

                            {/* Reply Box */}
                            {selectedMessage && (
                                <div className="reply-box">
                                    <h3>Reply to Message</h3>
                                    <p><strong>Message:</strong> {selectedMessage.content}</p>
                                    <textarea 
                                        value={replyContent}
                                        placeholder="Type your reply here..."
                                        onChange={(e) => setReplyContent(e.target.value)}
                                    />
                                    <button onClick={handleReplyMessage}>Send Reply</button>
                                </div>
                            )}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;
