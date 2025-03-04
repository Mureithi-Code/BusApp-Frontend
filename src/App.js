import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import RegisterForm from "./components/Auth/RegisterForm";
import LoginForm from "./components/Auth/LoginForm";
import AdminDashboard from "./components/Dashboards/AdminDashboard";
import DriverDashboard from "./components/Dashboards/DriverDashboard";
import CustomerDashboard from "./components/Dashboards/CustomerDashboard";
import PrivateRoute from "./components/PrivateRoute";

// Import new driver service pages
import AddRoutePage from "./components/Driver/AddRoutePage";
import AddBusPage from "./components/Driver/AddBusPage";
import AssignBusToRoutePage from "./components/Driver/AssignBusToRoutePage";
import SetDepartureTimePage from "./components/Driver/SetDepartureTimePage";
import SetTicketPricePage from "./components/Driver/SetTicketPricePage";
import ViewBusSeatsPage from "./components/Driver/ViewBusSeatsPage";
import DriverRoutesPage from "./components/Driver/DriverRoutesPage";
import DriverBusesPage from "./components/Driver/DriverBusesPage";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/register" element={<RegisterForm />} />

                {/* Role-based protected routes */}
                <Route path="/admin-dashboard" element={
                    <PrivateRoute allowedRoles={["Admin"]}>
                        <AdminDashboard />
                    </PrivateRoute>
                } />
                <Route path="/driver-dashboard" element={
                    <PrivateRoute allowedRoles={["Driver"]}>
                        <DriverDashboard />
                    </PrivateRoute>
                } />
                <Route path="/customer-dashboard" element={
                    <PrivateRoute allowedRoles={["Customer"]}>
                        <CustomerDashboard />
                    </PrivateRoute>
                } />

                {/* Driver Service Pages (Only Drivers can access) */}
                <Route path="/driver/add-route" element={
                    <PrivateRoute allowedRoles={["Driver"]}>
                        <AddRoutePage />
                    </PrivateRoute>
                } />
                <Route path="/driver/add-bus" element={
                    <PrivateRoute allowedRoles={["Driver"]}>
                        <AddBusPage />
                    </PrivateRoute>
                } />
                <Route path="/driver/assign-bus-route" element={
                    <PrivateRoute allowedRoles={["Driver"]}>
                        <AssignBusToRoutePage />
                    </PrivateRoute>
                } />
                <Route path="/driver/set-departure-time" element={
                    <PrivateRoute allowedRoles={["Driver"]}>
                        <SetDepartureTimePage />
                    </PrivateRoute>
                } />
                <Route path="/driver/set-ticket-price" element={
                    <PrivateRoute allowedRoles={["Driver"]}>
                        <SetTicketPricePage />
                    </PrivateRoute>
                } />
                <Route path="/driver/view-bus-seats" element={
                    <PrivateRoute allowedRoles={["Driver"]}>
                        <ViewBusSeatsPage />
                    </PrivateRoute>
                } />
                <Route path="/driver/view-routes" element={
                    <PrivateRoute allowedRoles={["Driver"]}>
                        <DriverRoutesPage />
                    </PrivateRoute>
                } />
                <Route path="/driver/view-buses" element={
                    <PrivateRoute allowedRoles={["Driver"]}>
                        <DriverBusesPage />
                    </PrivateRoute>
                } />

                {/* Catch-all for invalid routes */}
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </Router>
    );
}

export default App;
