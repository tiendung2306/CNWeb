import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css"; // Import CSS của bạn

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Bắt đầu loading khi form được submit
    try {
      await login(email, password); // Gọi login với email và mật khẩu
      navigate("/"); // Nếu đăng nhập thành công, chuyển đến trang dashboard
    } catch (err) {
      setError("Email hoặc mật khẩu không đúng");
    } finally {
      setLoading(false); // Dừng loading sau khi hoàn tất xử lý
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Đăng nhập Admin</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <button
            type="submit"
            className="login-btn"
            disabled={loading}
          >
            {loading ? "Đang xử lý..." : "Đăng nhập"}
          </button>
        </form>
      </div>
    </div>
  );
}
