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

            setBuses(fetchedBuses || []);
            setRoutes(fetchedRoutes || []);
            setDrivers(fetchedDrivers || []);
            setMessages(fetchedMessages || []);
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
            await adminApi.replyToMessage(selectedMessage.id, { content: replyContent });
            setFeedback("Reply sent successfully.");
            setReplyContent("");
            fetchData();
        } catch (error) {
            setFeedback(error.message);
        }
    };

    return (
        <div className="admin-dashboard">
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

                {/* View Buses Section */}
                <section id="buses">
                    <h2>All Buses</h2>
                    {buses.length === 0 ? <p>No buses available.</p> : (
                        <ul>
                            {buses.map(bus => (
                                <li key={bus.id}>
                                    <strong>Bus {bus.bus_number}</strong> - 
                                    {bus.route_id ? ` Assigned to Route ${bus.route_id}` : " Unassigned"}
                                    <br />
                                    Ticket Price: ${bus.ticket_price}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* View Routes Section */}
                <section id="routes">
                    <h2>All Routes</h2>
                    {routes.length === 0 ? <p>No routes available.</p> : (
                        <ul>
                            {routes.map(route => (
                                <li key={route.id}>
                                    <strong>{route.start_location} ➡ {route.destination}</strong>
                                    {route.bus_id ? ` - Bus ${route.bus_id} Assigned` : " - No Bus Assigned"}
                                    <br />
                                    <button onClick={() => handleCancelRoute(route.id)}>Cancel Route</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* Manage Drivers Section */}
                <section id="drivers">
                    <h2>Manage Drivers</h2>
                    {drivers.length === 0 ? <p>No drivers available.</p> : (
                        <ul>
                            {drivers.map(driver => (
                                <li key={driver.id}>
                                    <strong>{driver.name}</strong> ({driver.email})
                                    <br />
                                    <button onClick={() => handleRemoveDriver(driver.id)}>Remove Driver</button>
                                </li>
                            ))}
                        </ul>
                    )}
                </section>

                {/* View & Reply to Messages */}
                <section id="messages">
                    <h2>Customer Messages</h2>
                    {messages.length === 0 ? <p>No messages available.</p> : (
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

                            {/* Reply Form */}
                            {selectedMessage && (
                                <div className="reply-box">
                                    <h3>Reply to Message</h3>
                                    <p><strong>Message:</strong> {selectedMessage.content}</p>
                                    <textarea 
                                        placeholder="Write your reply here..." 
                                        value={replyContent} 
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
