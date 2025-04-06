import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Orders from "./pages/Orders";
import Users from "./pages/Users";
import Layout from "./components/Layout";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

// PrivateRoute bảo vệ các route yêu cầu đăng nhập
function PrivateRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Route đăng nhập */}
          <Route path="/login" element={<Login />} />
          
          {/* Các route yêu cầu đăng nhập */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}
