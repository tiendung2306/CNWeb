import React, { useState } from "react";
import "./RegisterForm.css";

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
      const response = await fetch("http://localhost:3000/pub/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!data.success) {
        setError(data.errorMessage || "Đăng ký thất bại");
      } else {
        alert("Đăng ký thành công! Hãy đăng nhập.");
        onSwitch();
      }
    } catch (err) {
      setError("Lỗi kết nối đến server!");
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
