import React from "react";
import { Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

// Components
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import ProtectedRoute from "./components/routes/ProtectedRoute";

// Pages
import Home from "./pages/public/Home";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Games from "./pages/public/Games";
import GameDetail from "./pages/public/GameDetail";
import Rooms from "./pages/public/Rooms";
import RoomDetail from "./pages/public/RoomDetail";
import Devices from "./pages/public/Devices";
import DeviceDetail from "./pages/public/DeviceDetail";
import Feedbacks from "./pages/public/Feedbacks";
import BookingForm from "./pages/customer/BookingForm";
import Bookings from "./pages/customer/Bookings";
import Payment from "./pages/staff/Payment";

// Admin Pages
import DashBoard from "./pages/admin/DashBoard";
import UserManagement from "./pages/admin/UserManagement";
import GameManagement from "./pages/admin/GameManagement";
import RoomManagement from "./pages/admin/RoomManagement";
import BookingManagement from "./pages/admin/BookingManagement";
import FeedbackManagement from "./pages/admin/FeedbackManagement";
import DeviceManagement from "./pages/admin/DeviceManagement";
import UserFeedbacks from "./pages/customer/UserFeedbacks";
import UserFeedbackForm from "./pages/customer/UserFeedbackForm";
import NotFound from "./pages/NotFound";
import InfrastructureManagement from "./pages/admin/InfrastructureManagement";
import ChatBotWidget from "./components/common/ChatBotWidget";

const App = () => (
  <div className="min-h-screen bg-vr-bg font-body">
    <Navbar />
    <main className="container py-8">
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/games" element={<Games />} />
          <Route path="/games/:id" element={<GameDetail />} />
          <Route path="/rooms" element={<Rooms />} />
          <Route path="/rooms/:id" element={<RoomDetail />} />
          <Route path="/devices" element={<Devices />} />
          <Route path="/devices/:id" element={<DeviceDetail />} />
          <Route path="/feedbacks" element={<Feedbacks />} />

          {/* Customer Routes */}
          <Route element={<ProtectedRoute allowedRoles={["CUSTOMER"]} />}>
            <Route path="/booking/game/:gameId" element={<BookingForm />} />
            <Route path="/booking/room/:roomId" element={<BookingForm />} />
            <Route path="/booking/new" element={<BookingForm />} />
            <Route path="/bookings" element={<Bookings />} />
            <Route path="/booking/edit/:bookingId" element={<BookingForm />} />
            <Route path="/user-feedbacks" element={<UserFeedbacks />} />
            <Route path="/user-feedbacks/new" element={<UserFeedbackForm />} />
            <Route
              path="/user-feedbacks/edit/:feedbackId"
              element={<UserFeedbackForm />}
            />
          </Route>

          {/* Staff/Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["STAFF", "ADMIN"]} />}>
            <Route path="/payment" element={<Payment />} />
          </Route>

          {/* Admin Routes */}
          <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
            <Route path="/dashboard" element={<DashBoard />}>
              <Route
                path="infrastructure"
                element={<InfrastructureManagement />}
              />
              <Route path="users" element={<UserManagement />} />
              <Route path="games" element={<GameManagement />} />
              <Route path="rooms" element={<RoomManagement />} />
              <Route path="bookings" element={<BookingManagement />} />
              <Route path="feedbacks" element={<FeedbackManagement />} />
              <Route path="devices" element={<DeviceManagement />} />
            </Route>
          </Route>

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
    </main>
    <ChatBotWidget />
    <Footer />
  </div>
);

export default App;
