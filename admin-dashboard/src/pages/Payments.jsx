import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Payments.css";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
 

  const token = localStorage.getItem("token");

  const fetchPayments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/payment` , {
        headers: {
          "x-token": token,
        },
      });
      console.log(res.data);
      setPayments(res.data.data.payments); // nếu trả về dạng { payments: [...] }
      setLoading(false);
    } catch (err) {
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
            <th>Người dùng</th>
            <th>Số tiền</th>
            <th>Trạng thái</th>
            <th>Ngày</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.userId || payment.username || "N/A"}</td>
              <td>{payment.amount} VND</td>
              <td>{payment.paymentStatus}</td>
              <td>{new Date(payment.createdAt).toLocaleString()}</td>
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
