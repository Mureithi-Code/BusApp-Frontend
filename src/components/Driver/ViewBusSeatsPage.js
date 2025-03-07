import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import driverApi from "../../api/driverApi";
import './DriverPages.css';

const ViewBusSeatsPage = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState("");
    const [seats, setSeats] = useState([]);
    const [feedback, setFeedback] = useState(null);
    const [busDetails, setBusDetails] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const busesData = await driverApi.getDriverBuses();
            setBuses(busesData);
        } catch (error) {
            setFeedback({ type: "error", message: "Failed to load buses." });
        }
    };

    const fetchSeats = async (busId) => {
        try {
            const data = await driverApi.getBusSeats(busId);
            setSeats(data?.seats || []);
            setBusDetails({
                busNumber: data?.bus_number,
                totalSeats: data?.total_seats,
                availableSeats: data?.available_seats
            });
            setFeedback({ type: "success", message: "Seats loaded successfully." });
        } catch (error) {
            setFeedback({ type: "error", message: "Failed to fetch seats." });
            setSeats([]);
            setBusDetails(null);
        }
    };

    return (
        <div className="page-container view-bus-seats-page">
            {/* Background Image */}
            <img
                src="https://media.istockphoto.com/id/1265040333/photo/bus-interior.jpg?s=1024x1024&w=is&k=20&c=z1GKQD5_bKWT9cLF6HDi-UTfMIJ0mVHe7RBs6SPSj9E="
                alt="Background"
                className="page-background"
            />

            {/* Top-left Back to Dashboard Icon */}
            <FaHome
                className="back-to-dashboard-icon"
                title="Back to Dashboard"
                onClick={() => navigate("/driver-dashboard")}
            />

            <div className="form-container">
                <h2 className="page-header">View Bus Seats</h2>

                {feedback && (
                    <div className={`feedback ${feedback.type}`}>
                        {feedback.message}
                    </div>
                )}

                <div className="form-group">
                    <label>Select Bus</label>
                    <select
                        value={selectedBus}
                        onChange={(e) => {
                            const busId = e.target.value;
                            setSelectedBus(busId);
                            if (busId) fetchSeats(busId);
                        }}
                    >
                        <option value="">Select Bus</option>
                        {buses.map(bus => (
                            <option key={bus.id} value={bus.id}>
                                Bus {bus.bus_number} ({bus.start_location} ➡ {bus.destination || "No Route Assigned"})
                            </option>
                        ))}
                    </select>
                </div>

                {busDetails && (
                    <div className="bus-info">
                        <h3>Bus {busDetails.busNumber}</h3>
                        <p>Total Seats: {busDetails.totalSeats}</p>
                        <p>Available Seats: {busDetails.availableSeats}</p>
                    </div>
                )}

                <div className="seats-section">
                    <h3>Seats for Bus {busDetails?.busNumber}</h3>
                    {Array.isArray(seats) && seats.length > 0 ? (
                        <ul className="seats-list">
                            {seats.map(seat => (
                                <li
                                    key={seat.seat_number}
                                    className={`seat ${seat.status === "booked" ? "booked" : "available"}`}
                                >
                                    Seat {seat.seat_number} - {seat.status}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No seats available or data failed to load.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ViewBusSeatsPage;
