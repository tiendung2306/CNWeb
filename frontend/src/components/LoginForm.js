import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import "./LoginForm.css";

function LoginForm({ onSwitch }) {
  const { login } = useAuth(); // Lấy hàm login từ AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:3000/pub/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.errorMessage || "Đăng nhập thất bại");
      } else {
        login(data.data.user, data.data.token); // Gọi login() từ AuthContext
        alert("Đăng nhập thành công!");
      }
    } catch (err) {
      setError("Lỗi kết nối đến server!");
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
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <button className="login-button" onClick={handleLogin}>
        ĐĂNG NHẬP
      </button>

      <p>
        Chưa có tài khoản?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
          Đăng ký
        </a>
      </p>
    </div>
  );
}

export default LoginForm;
