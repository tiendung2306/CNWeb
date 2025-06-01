import axios from "axios";
import { useEffect, useState } from "react";
import "./Payments.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [enhancedPayments, setEnhancedPayments] = useState([]);

  const token = localStorage.getItem("token");

  const fetchOrderDetails = async (payments) => {
    try {
      const paymentsWithOrders = [];

      for (const payment of payments) {
        try {
          const orderRes = await axios.get(`${BASE_URL}/api/order/${payment.orderId}`, {
            headers: {
              "x-token": token,
            },
          });

          const orderData = orderRes.data.data.order;

          paymentsWithOrders.push({
            ...payment,
            userId: orderData.userId,
            deliveryAddress: orderData.deliveryAddress,
          });
        } catch (err) {
          console.error(`Error fetching order ${payment.orderId}:`, err);
          paymentsWithOrders.push({
            ...payment,
            userId: "Error",
            deliveryAddress: "Error loading address",
          });
        }
      }

      setEnhancedPayments(paymentsWithOrders);
      setLoading(false);
    } catch (err) {
      setError("Không thể tải thông tin đơn hàng.");
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/payment`, {
        headers: {
          "x-token": token,
        },
      });
      const paymentsData = res.data.data.payments;
      setPayments(paymentsData);

      // Fetch order details for each payment
      await fetchOrderDetails(paymentsData);
    } catch (err) {
      console.error("Error fetching payments:", err);
      setError("Không thể tải danh sách thanh toán.");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa giao dịch này không?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/payment/${id}`, {
        headers: {
          "x-token": token,
        },
      });
      setPayments(payments.filter((p) => p.id !== id));
      setEnhancedPayments(enhancedPayments.filter((p) => p.id !== id));
    } catch (err) {
      alert("Xóa thanh toán thất bại!");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="payments-container">
      <h2 className="payments-title">Quản lý Thanh Toán</h2>
      <table className="payments-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mã đơn hàng</th>
            <th>Mã khách hàng</th>
            <th>Phương thức</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
            <th>Ngày thanh toán</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {enhancedPayments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.orderId}</td>
              <td>{payment.userId || "N/A"}</td>
              <td>
                {payment.paymentMethod === "Momo" ? "VNPAY" : payment.paymentMethod}
              </td>
              <td>{payment.amount} VND</td>
              <td>{payment.paymentStatus}</td>
              <td>{new Date(payment.paymentDate).toLocaleString()}</td>
              <td>
                <button className="btn-delete" onClick={() => handleDelete(payment.id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}