import React from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Layout.css"; // Import CSS của bạn

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h1 className="sidebar-title">Admin Panel</h1>
        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link">Thống kê</Link>
          <Link to="/products" className="sidebar-link">Sản phẩm</Link>
          <Link to="/orders" className="sidebar-link">Đơn hàng</Link>
          <Link to="/users" className="sidebar-link">Tài khoản</Link>
          <Link to="/payments" className="sidebar-link">Thanh toán</Link>
        </nav>
        <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <div className="user-greeting">Xin chào, {user?.email}</div>
        <Outlet />
      </main>
    </div>
  );
}
