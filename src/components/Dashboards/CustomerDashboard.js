import React, { useState, useEffect } from 'react';
import customerApi from "../../api/customerApi";
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const [buses, setBuses] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState('');
    const [feedback, setFeedback] = useState('');
    const [message, setMessage] = useState('');
    const [availableSeats, setAvailableSeats] = useState(0);

    const customerId = localStorage.getItem('user_id');

    // Fetch buses
    const fetchBuses = async () => {
        try {
            const data = await customerApi.getAllBuses();
            setBuses(data);
        } catch (error) {
            setFeedback('Failed to fetch buses.');
        }
    };

    // Fetch customer's bookings
    const fetchBookings = async () => {
        try {
            const data = await customerApi.getMyBookings(customerId);
            setBookings(data);
        } catch (error) {
            setFeedback('Failed to fetch bookings.');
        }
    };

    // Fetch available seats
    const checkAvailableSeats = async (busId) => {
        try {
            const data = await customerApi.getAvailableSeats(busId);
            setAvailableSeats(data.available_seats);
        } catch (error) {
            setAvailableSeats(0);
        }
    };

    useEffect(() => {
        fetchBuses();
        fetchBookings();
    }, []);

    const handleBookSeat = async () => {
        if (!selectedBus || !selectedSeat) {
            setFeedback('Please select a bus and seat number.');
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
            fetchBookings();
            checkAvailableSeats(selectedBus.id);
        } catch (error) {
            setFeedback(error.response?.data?.error || 'Failed to book seat.');
        }
    };

    const handleCancelBooking = async (bookingId) => {
        try {
            const response = await customerApi.cancelBooking(bookingId);
            setFeedback(response.message);
            fetchBookings();
        } catch (error) {
            setFeedback('Failed to cancel booking.');
        }
    };

    const handleSendMessage = async () => {
        if (!message.trim()) {
            setFeedback('Message cannot be empty.');
            return;
        }

        try {
            const response = await customerApi.sendMessage({
                sender_id: parseInt(customerId),
                receiver_id: 1, // Assuming admin ID is 1
                content: message,
            });
            setFeedback(response.message);
            setMessage('');
        } catch (error) {
            setFeedback('Failed to send message.');
        }
    };

    return (
        <div className="customer-dashboard">
            <h1>Customer Dashboard</h1>

            {feedback && <div className="feedback">{feedback}</div>}

            <section className="bus-list">
                <h2>Available Buses</h2>
                <ul>
                    {buses.map((bus) => (
                        <li key={bus.id}>
                            Bus {bus.bus_number} - Seats Available: {bus.available_seats}
                            <button onClick={() => {
                                setSelectedBus(bus);
                                checkAvailableSeats(bus.id);
                            }}>
                                Select
                            </button>
                        </li>
                    ))}
                </ul>
            </section>

            {selectedBus && (
                <section className="seat-booking">
                    <h2>Book Seat on Bus {selectedBus.bus_number}</h2>
                    <p>Available Seats: {availableSeats}</p>
                    <input
                        type="number"
                        placeholder="Enter seat number"
                        value={selectedSeat}
                        onChange={(e) => setSelectedSeat(e.target.value)}
                    />
                    <button onClick={handleBookSeat}>Book Seat</button>
                </section>
            )}

            <section className="my-bookings">
                <h2>My Bookings</h2>
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking.id}>
                            Booking {booking.id} - Bus {booking.bus_number} - Seat {booking.seat_number}
                            <button onClick={() => handleCancelBooking(booking.id)}>Cancel</button>
                        </li>
                    ))}
                </ul>
            </section>

            <section className="contact-admin">
                <h2>Contact Admin</h2>
                <textarea
                    placeholder="Write your message here..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send Message</button>
            </section>
        </div>
    );
};

export default CustomerDashboard;
