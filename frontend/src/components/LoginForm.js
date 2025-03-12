import React from "react";
import "./LoginModal.css";

function LoginForm({ onSwitch }) {
  return (
    <div className="login-form-container">
      <h2>ĐĂNG NHẬP</h2>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Mật khẩu" />
      <button className="login-button">ĐĂNG NHẬP</button>

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
