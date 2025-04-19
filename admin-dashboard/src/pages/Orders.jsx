import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Orders.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
      const response = await axios.get(`${BASE_URL}/api/admin/order`, {
        headers: { "x-token": token },
      });
      setOrders(response.data.data.orders || []);
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
        `${BASE_URL}/api/payment/${id}`,
        { status: newStatus },
        {
          headers: { "x-token": token },
        }
      );
      setOrders((prevOrders) =>
        prevOrders.map((item) =>
          item.order.id === id
            ? { ...item, order: { ...item.order, status: newStatus } }
            : item
        )
      );
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái:", error);
      alert("Không thể cập nhật trạng thái đơn hàng.");
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa đơn hàng này?")) return;

    try {
      await axios.delete(`${BASE_URL}/api/order/${id}`, {
        headers: { "x-token": token },
      });
      setOrders((prevOrders) =>
        prevOrders.filter((item) => item.order.id !== id)
      );
    } catch (error) {
      console.error("Lỗi khi xóa đơn hàng:", error);
      alert("Xóa đơn hàng thất bại.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const formatMoney = (amount) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(Number(amount));

  const translateStatus = (status) => {
    switch (status) {
      case "Pending":
        return "Chờ xử lý";
      case "Delivered":
        return "Đã giao";
      default:
        return status;
    }
  };

  const filteredOrders =
    filterStatus === "Tất cả"
      ? orders
      : orders.filter(
          (item) => translateStatus(item.order.status) === filterStatus
        );

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
            <th className="table-header">Người nhận - SĐT - Địa chỉ</th>
            <th className="table-header">Tổng tiền</th>
            <th className="table-header">Trạng thái</th>
            <th className="table-header">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((item, index) => {
            const order = item.order;
            const orderItems = item.orderItems || [];

            return (
              <React.Fragment key={order.id || index}>
                <tr>
                  <td className="table-cell">{order.id}</td>
                  <td className="table-cell">ID: {order.userId}</td>
                  <td className="table-cell">
                    {order.deliveryAddress || "Chưa có"}
                  </td>
                  <td className="table-cell">
                    {formatMoney(order.totalAmount)}
                  </td>
                  <td className="table-cell">
                    {translateStatus(order.status)}
                  </td>
                  <td className="table-cell">
                    {order.status === "Pending" && (
                      <button
                        onClick={() =>
                          handleChangeStatus(order.id, "Delivered")
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
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="delete-button"
                      style={{
                        backgroundColor: "#dc3545",
                        color: "white",
                        marginLeft: "8px",
                      }}
                    >
                      Xóa
                    </button>
                  </td>
                </tr>

                {expandedOrderId === order.id && (
                  <tr>
                    <td colSpan="6" className="table-cell">
                      <strong>Món ăn trong đơn hàng:</strong>
                      <ul>
                        {orderItems.map((itemDetail, idx) => (
                          <li key={itemDetail.id || idx}>
                            Món ID: {itemDetail.menuItemId} - SL:{" "}
                            {itemDetail.quantity} - Giá:{" "}
                            {formatMoney(itemDetail.price)}
                          </li>
                        ))}
                      </ul>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
