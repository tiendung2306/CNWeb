import React, { useState } from "react";
import "./Users.css"; // Import CSS của bạn

export default function Users() {
  const [users, setUsers] = useState([
    { id: 1, name: "Nguyễn Văn A", role: "Admin" },
    { id: 2, name: "Trần Thị B", role: "User" },
  ]);

  const handleRoleChange = (id, newRole) => {
    setUsers(users.map(user => user.id === id ? { ...user, role: newRole } : user));
  };

  const handleDelete = (id) => {
    setUsers(users.filter(user => user.id !== id));
  };

  return (
    <div className="users-container">
      <h2 className="users-title">Quản lý Tài khoản người dùng</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th className="table-header">Tên người dùng</th>
            <th className="table-header">Vai trò</th>
            <th className="table-header">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="table-cell">{user.name}</td>
              <td className="table-cell">
                <select 
                  value={user.role} 
                  onChange={(e) => handleRoleChange(user.id, e.target.value)} 
                  className="role-select">
                  <option value="Admin">Admin</option>
                  <option value="User">User</option>
                </select>
              </td>
              <td className="table-cell">
                <button 
                  onClick={() => handleDelete(user.id)} 
                  className="btn-delete">
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
