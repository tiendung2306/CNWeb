import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("Tất cả");

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        `${BASE_URL}/api/admin/orders`,
        {
          headers: {
            "x-token": token,
          },
        }
      );
      setOrders(response.data.data.orders);
    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error);
      setError("Không thể tải danh sách đơn hàng.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (id, newStatus) => {
    try {
      await axios.put(
        `${BASE_URL}/api/admin/orders/${id}/status`,
        {
          status: newStatus,
        },
        {
          headers: {
            "x-token": token,
          },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders =
    filterStatus === "Tất cả"
      ? orders
      : orders.filter((order) => order.status === filterStatus);

  return (
    <div className="orders-container">
      <h2 className="orders-title">Quản lý Đơn hàng</h2>

      <select
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
        className="filter-dropdown"
      >
        <option value="Tất cả">Tất cả</option>
        <option value="Chờ xử lý">Chờ xử lý</option>
        <option value="Đã giao">Đã giao</option>
      </select>

      {loading && <p>Đang tải đơn hàng...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <table className="orders-table">
        <thead>
          <tr>
            <th className="table-header">ID</th>
            <th className="table-header">Người dùng</th>
            <th className="table-header">Địa chỉ</th>
            <th className="table-header">Tổng tiền</th>
            <th className="table-header">Trạng thái</th>
            <th className="table-header">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <React.Fragment key={order.id}>
              <tr>
                <td className="table-cell">{order.id}</td>
                <td className="table-cell">{order.user?.username}</td>
                <td className="table-cell">{order.deliveryAddress}</td>
                <td className="table-cell">{order.totalAmount}</td>
                <td className="table-cell">{order.status}</td>
                <td className="table-cell">
                  {order.status === "Chờ xử lý" && (
                    <button
                      onClick={() =>
                        handleChangeStatus(order.id, "Đã giao")
                      }
                      className="confirm-button"
                    >
                      Xác nhận giao
                    </button>
                  )}
                  <button
                    onClick={() =>
                      setExpandedOrderId(
                        expandedOrderId === order.id ? null : order.id
                      )
                    }
                    className="details-button"
                  >
                    {expandedOrderId === order.id
                      ? "Ẩn chi tiết"
                      : "Xem chi tiết"}
                  </button>
                </td>
              </tr>

              {expandedOrderId === order.id && (
                <tr>
                  <td colSpan="6" className="table-cell">
                    <strong>Món ăn trong đơn hàng:</strong>
                    <ul>
                      {order.orderItems?.map((item, index) => (
                        <li key={index}>
                          {item.menuItem?.name} - SL: {item.quantity} - Giá:{" "}
                          {item.menuItem?.price}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
