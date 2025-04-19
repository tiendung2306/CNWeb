import React from "react";
import { Link } from "react-router-dom";
import "./OrderStatus.css";

export default function OrderSuccess() {
  return (
    <div className="order-status success">
      <div className="icon">✅</div>
      <h1>Đặt hàng thành công!</h1>
      <p>Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được ghi nhận.</p>
      <Link to="/" className="btn">Quay lại trang chủ</Link>
    </div>
  );
}