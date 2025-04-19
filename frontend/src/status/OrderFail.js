
import React from "react";
import { Link } from "react-router-dom";
import "./OrderStatus.css";

export default function OrderFail() {
  return (
    <div className="order-status fail">
      <div className="icon">❌</div>
      <h1>Đặt hàng thất bại</h1>
      <p>Rất tiếc, đã có lỗi xảy ra khi xử lý đơn hàng. Vui lòng thử lại.</p>
      <Link to="/cart" className="btn">Quay lại giỏ hàng</Link>
    </div>
  );
}
