import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import driverApi from "../../api/driverApi";
import './DriverPages.css';

const ViewBusSeatsPage = () => {
    const [buses, setBuses] = useState([]);
    const [selectedBus, setSelectedBus] = useState("");
    const [seats, setSeats] = useState([]);  // Ensure seats starts as array
    const [feedback, setFeedback] = useState(null);  // { type: "success" | "error", message: string }
    const [busDetails, setBusDetails] = useState(null);  // Stores bus_number, total_seats, etc.
    const navigate = useNavigate();

    useEffect(() => {
        fetchBuses();
    }, []);

    const fetchBuses = async () => {
        try {
            const busesData = await driverApi.getDriverBuses();
            setBuses(busesData);  // Expecting array directly
        } catch (error) {
            setFeedback({ type: "error", message: "Failed to load buses." });
        }
    };

    const fetchSeats = async (busId) => {
        try {
            const data = await driverApi.getBusSeats(busId);
            setSeats(data?.seats || []);  // Ensure seats defaults to empty array
            setBusDetails({
                busNumber: data?.bus_number,
                totalSeats: data?.total_seats,
                availableSeats: data?.available_seats
            });
            setFeedback({ type: "success", message: "Seats loaded successfully." });
        } catch (error) {
            setFeedback({ type: "error", message: "Failed to fetch seats." });
            setSeats([]);  // Reset seats if there's an error
            setBusDetails(null);
        }
    };

    return (
        <div className="page-container">
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
                                className={seat.status === "booked" ? "seat booked" : "seat available"}
                            >
                                Seat {seat.seat_number} - {seat.status}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No seats available or data failed to load.</p>
                )}
            </div>

            <button
                className="back-button"
                onClick={() => navigate("/driver-dashboard")}
            >
                Back to Dashboard
            </button>
        </div>
    );
};

export default ViewBusSeatsPage;
