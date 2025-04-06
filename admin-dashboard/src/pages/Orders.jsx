import React, { useState } from "react";
import "./Orders.css"; // Import CSS của bạn

export default function Orders() {
  const [orders, setOrders] = useState([
    { id: 1, product: "Sản phẩm 1", status: "Chờ xử lý" },
    { id: 2, product: "Sản phẩm 2", status: "Đã giao" },
  ]);

  const handleChangeStatus = (id, newStatus) => {
    setOrders(orders.map(order => order.id === id ? { ...order, status: newStatus } : order));
  };

  return (
    <div className="orders-container">
      <h2 className="orders-title">Quản lý Đơn hàng</h2>
      <table className="orders-table">
        <thead>
          <tr>
            <th className="table-header">Sản phẩm</th>
            <th className="table-header">Trạng thái</th>
            <th className="table-header">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td className="table-cell">{order.product}</td>
              <td className="table-cell">{order.status}</td>
              <td className="table-cell">
                {order.status === "Chờ xử lý" && (
                  <button 
                    onClick={() => handleChangeStatus(order.id, "Đã giao")}
                    className="confirm-button">
                    Xác nhận giao
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
