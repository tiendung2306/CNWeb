import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import "./LoginForm.css";

function LoginForm({ onSwitch }) {
  const { login } = useAuth(); // login: (user, token)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      const response = await axios.post(
        "http://ec2-3-0-101-188.ap-southeast-1.compute.amazonaws.com:3000/pub/login",
        {
          email,
          password,
        }
      );

      if (response.data.success) {
        const { user, token } = response.data.data;

        // Gọi hàm login từ AuthContext để lưu thông tin người dùng
        login(user, token);

        // Lưu token vào localStorage
        localStorage.setItem("token", token);

        alert("Đăng nhập thành công!");
      } else {
        setError(response.data.errorMessage || "Đăng nhập thất bại");
      }
    } catch (err) {
      if (err.response && err.response.data?.errorMessage) {
        setError(err.response.data.errorMessage);
      } else {
        setError("Lỗi kết nối đến server!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <h2>ĐĂNG NHẬP</h2>
      <hr className="divider" />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      {error && <p className="error-message">{error}</p>}
      <button className="login-button" onClick={handleLogin} disabled={loading}>
        {loading ? "Đang xử lý..." : "ĐĂNG NHẬP"}
      </button>

      <p>
        Chưa có tài khoản?{" "}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            onSwitch();
          }}
        >
          Đăng ký
        </a>
      </p>
    </div>
  );
}

export default LoginForm;
