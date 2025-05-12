import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Users.css";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/admin/allUsers`,
        {
          headers: {
            "x-token": token,
          },
        }
      );
      console.log(res.data);
      console.log("Số lượng user nhận được:", res.data.data.users.rows.length);

      setUsers(res.data.data.users.rows);
      setLoading(false);
    } catch (err) {
      setError("Lỗi khi tải người dùng");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

 
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?"))
      return;
    try {
      await axios.delete(
        `${BASE_URL}/api/admin/allUsers/${id}`,
        {
          headers: {
            "x-token": token,
          },
        }
      );
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (err) {
      alert("Xóa người dùng thất bại!");
    }
  };

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="users-container">
      <h2 className="users-title">Quản lý Tài khoản người dùng</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th className="table-header">Tên người dùng</th>
            <th className="table-header">Email</th>
            <th className="table-header">Vai trò</th>
            <th className="table-header">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="table-cell">{user.username}</td>
              <td className="table-cell">{user.email}</td>
              <td className="table-cell">
                {user.role === "admin" ? "Quản trị viên" : "Người dùng"}
              </td>
              <td className="table-cell">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="btn-delete"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
