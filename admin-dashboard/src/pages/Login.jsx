import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { useAuth } from "../contexts/AuthContext"; // tùy vào nơi bạn lưu AuthContext

const BASE_URL = process.env.REACT_APP_API_BASE_URL

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Gọi login từ context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${BASE_URL}/pub/login`, {
        email,
        password,
      });

      if (response.data.success) {
        const { user, token } = response.data.data;
        if (user.role !== "admin") {
          setError("Bạn không có quyền truy cập trang này!");
          setLoading(false);
          return;
        }
        localStorage.setItem("token", token);
        login(user); // lưu user vào context

        alert("Đăng nhập thành công!");
        navigate("/"); // chuyển hướng
      } else {
        setError(response.data.errorMessage || "Đăng nhập thất bại");
      }
    } catch (err) {
      setError("Lỗi kết nối đến server!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập Admin</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
