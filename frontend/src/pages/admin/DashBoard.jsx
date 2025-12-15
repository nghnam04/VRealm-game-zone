import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";

import UserManagement from "./UserManagement";
import GameManagement from "./GameManagement";
import RoomManagement from "./RoomManagement";
import FeedbackManagement from "./FeedbackManagement";
import BookingManagement from "./BookingManagement";
import DeviceManagement from "./DeviceManagement";
import DashboardNavLink from "../../components/admin/DashboardNavLink";
import AdminHome from "../../components/admin/AdminHome";
import InfrastructureManagement from "./InfrastructureManagement";

const DashBoard = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col md:flex-row gap-8 max-w-7xl mx-auto py-8"
    >
      {/* Sidebar */}
      <aside className="w-full md:w-1/4 lg:w-1/5 sticky top-20 self-start">
        <div className="card-base p-4 space-y-2">
          <h2 className="text-2xl font-display text-red-400 mb-4 px-2 border-b border-gray-700 pb-2">
            Admin Panel
          </h2>
          <DashboardNavLink to="/dashboard">Tổng quan</DashboardNavLink>
          <hr className="border-t border-gray-700 my-2" />
          <DashboardNavLink to="infrastructure">Quản lý Cơ sở Hạ tầng</DashboardNavLink>
          <DashboardNavLink to="users">Quản lý Người dùng</DashboardNavLink>
          <DashboardNavLink to="games">Quản lý Game</DashboardNavLink>
          <DashboardNavLink to="rooms">Quản lý Phòng</DashboardNavLink>
          <DashboardNavLink to="devices">Quản lý Thiết bị</DashboardNavLink>
          <DashboardNavLink to="bookings">Quản lý Đặt phòng</DashboardNavLink>
          <DashboardNavLink to="feedbacks">Quản lý Phản hồi</DashboardNavLink>
        </div>
      </aside>

      {/* Content Area */}
      <main className="w-full md:w-3/4 lg:w-4/5">
        <div className="card-base min-h-[60vh] p-8">
          <Routes>
            <Route index element={<AdminHome />} />
            <Route path="infrastructure" element={<InfrastructureManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="games" element={<GameManagement />} />
            <Route path="rooms" element={<RoomManagement />} />
            <Route path="devices" element={<DeviceManagement />} />
            <Route path="bookings" element={<BookingManagement />} />
            <Route path="feedbacks" element={<FeedbackManagement />} />
          </Routes>
        </div>
      </main>
    </motion.div>
  );
};

export default DashBoard;
