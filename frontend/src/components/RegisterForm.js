import React from "react";
import "./LoginModal.css";

function RegisterForm({ onSwitch }) {
  return (
    <div className="login-form-container">
      <h2>ĐĂNG KÝ</h2>
      <input type="text" placeholder="Họ và tên" />
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Mật khẩu" />
      <input type="password" placeholder="Xác nhận mật khẩu" />
      <button className="login-button">TẠO TÀI KHOẢN</button>

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
