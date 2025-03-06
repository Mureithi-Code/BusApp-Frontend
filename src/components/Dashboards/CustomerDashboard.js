import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import customerApi from '../../api/customerApi';
import './CustomerDashboard.css';

const CustomerDashboard = () => {
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [availableSeats, setAvailableSeats] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState('');
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState('');
    const [editingBooking, setEditingBooking] = useState(null);  // Holds booking being edited

    const customerId = localStorage.getItem('customer_id');
    const navigate = useNavigate();

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        const [busesData, routesData, bookingsData] = await Promise.all([
            customerApi.getAllBuses(),
            customerApi.getAllRoutes(),
            customerApi.getMyBookings()
        ]);
        setBuses(busesData);
        setRoutes(routesData);
        setBookings(bookingsData);
    };

    const handleSelectBus = async (bus) => {
        setSelectedBus(bus);
        setSelectedSeat('');
        const seatsData = await customerApi.getAvailableSeats(bus.id);
        setAvailableSeats(seatsData.seats);
    };

    const handleBookSeat = async () => {
        if (!selectedBus || !selectedSeat) {
            setFeedback('Please select a bus and seat.');
            return;
        }

        const bookingData = {
            customer_id: parseInt(customerId),
            bus_id: selectedBus.id,
            seat_number: parseInt(selectedSeat),
        };

        await customerApi.bookSeat(bookingData);
        setFeedback('Seat booked successfully');
        fetchDashboardData();
        handleSelectBus(selectedBus);
    };

    const handleCancelBooking = async (bookingId) => {
        await customerApi.cancelBooking(bookingId);
        setFeedback('Booking cancelled');
        fetchDashboardData();
    };

    const handleSendMessage = async () => {
        if (!message.trim()) return setFeedback('Message cannot be empty');
        await customerApi.sendMessage({
            customer_id: parseInt(customerId),
            admin_id: 1,
            content: message,
        });
        setFeedback('Message sent to admin');
        setMessage('');
    };

    const handleLogout = () => {
        localStorage.removeItem('customer_id');
        navigate('/login');
    };

    const startEditBooking = (booking) => {
        setEditingBooking(booking);
        const currentBus = buses.find(b => b.id === booking.bus_id);
        handleSelectBus(currentBus);
    };

    const handleEditBooking = async () => {
        if (!editingBooking || !selectedBus || !selectedSeat) {
            setFeedback('Please select a new bus and seat.');
            return;
        }

        const updateData = {
            new_bus_id: selectedBus.id,
            new_seat_number: parseInt(selectedSeat),
        };

        await customerApi.editBooking(editingBooking.id, updateData);
        setFeedback('Booking updated successfully');
        setEditingBooking(null);
        fetchDashboardData();
    };

    return (
        <div className="customer-dashboard">
            <nav className="navbar">
                <h1>Customer Dashboard</h1>
                <div>
                    <button onClick={() => setEditingBooking(null)}>Dashboard</button>
                    <button onClick={() => setEditingBooking(null)}>My Bookings</button>
                    <button onClick={() => setMessage('')}>Messages</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            </nav>

            {feedback && <div className="feedback">{feedback}</div>}

            {/* Bus Selection & Seat Booking */}
            {!editingBooking && (
                <section className="bus-selection">
                    <h2>Select a Bus</h2>
                    <ul>
                        {buses.map(bus => {
                            const route = routes.find(r => r.id === bus.route_id);
                            return (
                                <li key={bus.id}>
                                    {bus.bus_number} ({route?.start_location} ➡ {route?.destination}) - Seats Available: {bus.available_seats}
                                    <button onClick={() => handleSelectBus(bus)}>View Seats</button>
                                </li>
                            );
                        })}
                    </ul>

                    {selectedBus && (
                        <section className="seat-booking">
                            <h2>Book Seat on Bus {selectedBus.bus_number}</h2>
                            <div className="seats-grid">
                                {availableSeats.map(seat => (
                                    <div
                                        key={seat.seat_number}
                                        className={`seat ${seat.status === 'booked' ? 'booked' : ''} ${selectedSeat === seat.seat_number ? 'selected' : ''}`}
                                        onClick={() => seat.status === 'available' && setSelectedSeat(seat.seat_number)}
                                    >
                                        {seat.seat_number}
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleBookSeat} disabled={!selectedSeat}>Book Selected Seat</button>
                        </section>
                    )}
                </section>
            )}

            {/* My Bookings + Edit Booking */}
            {!selectedBus && !editingBooking && (
                <section className="my-bookings">
                    <h2>My Bookings</h2>
                    <ul>
                        {bookings.map(booking => (
                            <li key={booking.id}>
                                Booking {booking.id} - Bus {booking.bus_number} - Seat {booking.seat_number}
                                <button onClick={() => startEditBooking(booking)}>Edit</button>
                                <button onClick={() => handleCancelBooking(booking.id)}>Cancel</button>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            {/* Edit Booking - Bus & Seat Picker */}
            {editingBooking && (
                <section className="edit-booking">
                    <h2>Edit Booking #{editingBooking.id}</h2>

                    <h3>Select New Bus</h3>
                    <ul>
                        {buses.map(bus => {
                            const route = routes.find(r => r.id === bus.route_id);
                            return (
                                <li key={bus.id}>
                                    {bus.bus_number} ({route?.start_location} ➡ {route?.destination}) - Seats Available: {bus.available_seats}
                                    <button onClick={() => handleSelectBus(bus)}>Select Bus</button>
                                </li>
                            );
                        })}
                    </ul>

                    {selectedBus && (
                        <>
                            <h3>Select New Seat on Bus {selectedBus.bus_number}</h3>
                            <div className="seats-grid">
                                {availableSeats.map(seat => (
                                    <div
                                        key={seat.seat_number}
                                        className={`seat ${seat.status === 'booked' ? 'booked' : ''} ${selectedSeat === seat.seat_number ? 'selected' : ''}`}
                                        onClick={() => seat.status === 'available' && setSelectedSeat(seat.seat_number)}
                                    >
                                        {seat.seat_number}
                                    </div>
                                ))}
                            </div>
                            <button onClick={handleEditBooking} disabled={!selectedSeat}>Update Booking</button>
                        </>
                    )}
                </section>
            )}

            {/* Message Admin */}
            <section className="message-admin">
                <h2>Message Admin</h2>
                <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message to admin..." />
                <button onClick={handleSendMessage}>Send Message</button>
            </section>
        </div>
    );
};

export default CustomerDashboard;
