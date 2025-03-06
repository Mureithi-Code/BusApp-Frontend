import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import customerApi from '../../api/customerApi';
import './CustomerDashboard.css';
import { FaBars, FaTimes } from 'react-icons/fa';

const CustomerDashboard = () => {
    const [buses, setBuses] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [availableSeats, setAvailableSeats] = useState([]);
    const [selectedBus, setSelectedBus] = useState(null);
    const [selectedSeat, setSelectedSeat] = useState('');
    const [message, setMessage] = useState('');
    const [feedback, setFeedback] = useState('');
    const [editingBooking, setEditingBooking] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const customerId = localStorage.getItem('customer_id');
    const navigate = useNavigate();

    const dashboardRef = useRef(null);
    const bookingsRef = useRef(null);
    const messagesRef = useRef(null);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [busesData, routesData, bookingsData] = await Promise.all([
                customerApi.getAllBuses(),
                customerApi.getAllRoutes(),
                customerApi.getMyBookings()
            ]);

            const busesWithRoutes = busesData.filter(bus => bus.route_id !== null);
            setBuses(busesWithRoutes);
            setRoutes(routesData);
            setBookings(bookingsData);
        } catch (error) {
            setFeedback("Failed to load data");
        }
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

    const scrollToSection = (ref) => {
        if (ref.current) {
            ref.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="customer-dashboard">
            <video autoPlay loop muted className="dashboard-video">
                <source src="https://videos.pexels.com/video-files/2950082/2950082-sd_640_360_30fps.mp4" type="video/mp4" />
            </video>

            <div className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <h2>Dashboard</h2>
                    <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                        {sidebarOpen ? <FaTimes /> : <FaBars />}
                    </button>
                </div>
                <nav className="sidebar-nav">
                    <button onClick={() => scrollToSection(dashboardRef)}>Dashboard</button>
                    <button onClick={() => scrollToSection(bookingsRef)}>My Bookings</button>
                    <button onClick={() => scrollToSection(messagesRef)}>Messages</button>
                    <button onClick={handleLogout}>Logout</button>
                </nav>
            </div>

            <div className="dashboard-content">
                {feedback && <div className="feedback">{feedback}</div>}

                {/* Bus Selection & Seat Booking */}
                {!editingBooking && (
                    <section ref={dashboardRef} className="bus-selection">
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

                {/* My Bookings */}
                {!selectedBus && !editingBooking && (
                    <section ref={bookingsRef} className="my-bookings">
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

                {/* Edit Booking */}
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

                <section ref={messagesRef} className="message-admin">
                    <h2>Message Admin</h2>
                    <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Type your message to admin..." />
                    <button onClick={handleSendMessage}>Send Message</button>
                </section>
            </div>
        </div>
    );
};

export default CustomerDashboard;
