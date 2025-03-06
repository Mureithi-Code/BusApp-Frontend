import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Assuming you're using React Router
import customerApi from '../../api/customerApi';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const [buses, setBuses] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState('');
    const [feedback, setFeedback] = useState('');
    const [availableSeats, setAvailableSeats] = useState([]);
    const [routes, setRoutes] = useState([]);
    const navigate = useNavigate();  // For navigation

    const customerId = localStorage.getItem('customer_id');

    const fetchDashboardData = async () => {
        try {
            const [fetchedBuses, fetchedRoutes] = await Promise.all([
                customerApi.getAllBuses(),
                customerApi.getAllRoutes(),
            ]);

            const busesWithRoutes = fetchedBuses.filter(bus => bus.route_id);
            setBuses(busesWithRoutes);
            setRoutes(fetchedRoutes);

            if (customerId) {
                const fetchedBookings = await customerApi.getMyBookings();
                if (!Array.isArray(fetchedBookings)) {
                    setBookings([]);
                } else {
                    setBookings(fetchedBookings);
                }
            } else {
                setBookings([]);
                setFeedback("⚠️ Customer ID not found. Please log in again.");
            }
        } catch (error) {
            setFeedback(error.message || "Failed to fetch dashboard data.");
        }
    };

    const fetchAvailableSeats = async (busId) => {
        try {
            const response = await customerApi.getAvailableSeats(busId);
            setAvailableSeats(response.seats || []);
        } catch (error) {
            setFeedback(error.message || "Failed to fetch available seats.");
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const handleBookSeat = async () => {
        if (!selectedBus || !selectedSeat) {
            setFeedback('Please select a bus and seat number.');
            return;
        }

        if (!customerId) {
            setFeedback("⚠️ Error: Customer ID not found. Please log in again.");
            return;
        }

        try {
            const bookingData = {
                customer_id: parseInt(customerId),
                bus_id: selectedBus.id,
                seat_number: parseInt(selectedSeat),
            };

            const response = await customerApi.bookSeat(bookingData);
            setFeedback(response.message);

            setSelectedSeat('');
            await fetchDashboardData();
            fetchAvailableSeats(selectedBus.id);
        } catch (error) {
            setFeedback(error.message);
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await customerApi.cancelBooking(bookingId);
            setFeedback(response.message);
            fetchDashboardData();
        } catch (error) {
            setFeedback(error.message);
        }
    };

    const handleSelectBus = (bus) => {
        setSelectedBus(bus);
        setSelectedSeat('');
        fetchAvailableSeats(bus.id);
    };

    const handleLogout = () => {
        localStorage.removeItem('customer_id'); // Clear stored customer ID
        navigate('/login');  // Redirect to login page (adjust route as needed)
    };

    return (
        <div className="customer-dashboard">
            <header className="dashboard-header">
                <h1>Customer Dashboard</h1>
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </header>

            {feedback && <div className="feedback">{feedback}</div>}

            <section className="bus-list">
                <h2>Available Buses (With Routes)</h2>
                {buses.length === 0 ? (
                    <p>No buses available.</p>
                ) : (
                    <ul>
                        {buses.map((bus) => {
                            const route = routes.find(route => route.id === bus.route_id);
                            return (
                                <li key={bus.id}>
                                    <div>
                                        Bus {bus.bus_number} - Seats Available: {bus.available_seats}
                                        <br />
                                        <small>
                                            {route ? `${route.start_location} ➡ ${route.destination}` : "No Route Info"}
                                        </small>
                                    </div>
                                    <button onClick={() => handleSelectBus(bus)}>Select</button>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </section>

            {selectedBus && (
                <section className="seat-booking">
                    <h2>Book Seat on Bus {selectedBus.bus_number}</h2>
                    <p>Available Seats:</p>
                    <ul className="seats-grid">
                        {availableSeats.map(seat => (
                            <li
                                key={seat.seat_number}
                                className={seat.status === "booked" ? "booked" : ""}
                                onClick={() => seat.status === "available" && setSelectedSeat(seat.seat_number)}
                            >
                                {seat.seat_number}
                            </li>
                        ))}
                    </ul>
                    <p>Selected Seat: {selectedSeat || "None"}</p>
                    <button onClick={handleBookSeat} disabled={!selectedSeat}>Book Seat</button>
                </section>
            )}

            <section className="my-bookings">
                <h2>My Bookings</h2>
                {bookings.length === 0 ? (
                    <p>No bookings found.</p>
                ) : (
                    <ul>
                        {bookings.map(booking => (
                            <li key={booking.id}>
                                Booking {booking.id} - Bus {booking.bus_number} - Seat {booking.seat_number}
                                <button onClick={() => handleCancelBooking(booking.id)}>Cancel</button>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
};

export default CustomerDashboard;
