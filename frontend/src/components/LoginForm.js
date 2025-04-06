import React, { useState } from "react";
import { useAuth } from "../context/AuthContext"; // Import useAuth
import axios from "axios"; // Import axios
import "./LoginForm.css";

function LoginForm({ onSwitch }) {
  const { login } = useAuth(); // Lấy hàm login từ AuthContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      // Gửi yêu cầu đăng nhập tới backend
      const response = await axios.post("http://localhost:3000/pub/login", {
        email,
        password,
      });

      if (response.data.success) {
        // Nếu đăng nhập thành công, lưu thông tin người dùng và token
        login(response.data.data.user, response.data.data.token); // Gọi login() từ AuthContext

        // Lưu token vào localStorage
        localStorage.setItem("token", response.data.data.token);

        alert("Đăng nhập thành công!");
      } else {
        // Nếu đăng nhập không thành công
        setError(response.data.errorMessage || "Đăng nhập thất bại");
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
