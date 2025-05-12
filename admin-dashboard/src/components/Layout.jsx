import React, { useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Layout.css";

export default function Layout() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="layout-container">
      {/* Nút toggle cho sidebar trên màn hình nhỏ */}
      <button
        className="toggle-sidebar-btn"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        ☰ Menu
      </button>

      {/* Overlay mờ khi sidebar mở */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? "show" : ""}`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <h1 className="sidebar-title">Admin Panel</h1>
        <nav className="sidebar-nav">
          <Link to="/" className="sidebar-link" onClick={() => setSidebarOpen(false)}>Thống kê</Link>
          <Link to="/products" className="sidebar-link" onClick={() => setSidebarOpen(false)}>Sản phẩm</Link>
          <Link to="/orders" className="sidebar-link" onClick={() => setSidebarOpen(false)}>Đơn hàng</Link>
          <Link to="/users" className="sidebar-link" onClick={() => setSidebarOpen(false)}>Tài khoản</Link>
          <Link to="/payments" className="sidebar-link" onClick={() => setSidebarOpen(false)}>Thanh toán</Link>
        </nav>
        <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
      </aside>

      {/* Nội dung chính */}
      <main className="main-content">
        <div className="user-greeting">Xin chào, {user?.email}</div>
        <Outlet />
      </main>
    </div>
  );
}
