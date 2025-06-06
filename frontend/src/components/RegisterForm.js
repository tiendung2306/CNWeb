import { useState } from "react";
import "./RegisterForm.css";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL; // Đường dẫn đến API

function RegisterForm({ onSwitch }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/pub/register`, {
        username,
        email,
        password,
      });

      const data = response.data;

      if (!data.success) {
        setError(data.errorMessage || "Đăng ký thất bại");
      } else {
        alert("Đăng ký thành công! Hãy đăng nhập.");
        onSwitch();
      }
    } catch (err) {
      if (err.response && err.response.data?.errorMessage) {
        setError(err.response.data.errorMessage);
      } else {
        setError("Lỗi kết nối đến server!");
      }
    }
  };

  return (
    <div className="login-form-container">
      <h2>ĐĂNG KÝ</h2>
      <input
        type="text"
        placeholder="Họ và tên"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
      <input
        type="password"
        placeholder="Xác nhận mật khẩu"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />
      {error && <p className="error-message">{error}</p>}
      <button className="login-button" onClick={handleRegister}>
        TẠO TÀI KHOẢN
      </button>

      <p>
        Đã có tài khoản?{" "}
        <a href="#" onClick={(e) => { e.preventDefault(); onSwitch(); }}>
          Đăng nhập
        </a>
      </p>
    </div>
  );
}

export default RegisterForm;
