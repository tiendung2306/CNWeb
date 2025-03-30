import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import "./Profile.css";

const Profile = () => {
  const { user, logout, login } = useAuth(); // Thêm login để cập nhật user từ API
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditUser] = useState(currentUser || { name: "", email: "", phone: "", address: "" });


  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setEditUser(user);
    }
  }, [user]);
  const handleEditChange = (e) => {
    setEditUser((prev) => ({
      ...prev,
      [e.target.name]: e.target.value || "",
    }));    
  };

  const handleSave = () => {
    setCurrentUser(editedUser);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>Hồ sơ cá nhân</h2>
      {!currentUser ? (
        <>
          <p>Bạn chưa đăng nhập.</p>
          <button onClick={() => setShowLoginModal(true)} className="login-btn">
            Đăng nhập ngay
          </button>
          {showLoginModal && (
            <LoginModal
              isVisible={showLoginModal}
              onClose={() => setShowLoginModal(false)}
            />
          )}
        </>
      ) : (
        <>
          {isEditing ? (
            <div className="edit-form">
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleEditChange}
              />
              <input
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="phone"
                value={editedUser.phone}
                onChange={handleEditChange}
              />
              <button onClick={handleSave}>Lưu</button>
              <button onClick={() => setIsEditing(false)}>Hủy</button>
            </div>
          ) : (
            <div className="profile-user">
              <div className="profile-image">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="Avatar"
                    className="profile-avatar"
                  />
                ) : (
                  <i className="fas fa-user-circle default-avatar-icon"></i>
                )}
              </div>
              <div className="profile-info">
                <p>
                  <strong>Tên:</strong> {currentUser.name}
                </p>
                <p>
                  <strong>Email:</strong> {currentUser.email}
                </p>
                <p>
                  <strong>Số điện thoại:</strong>{" "}
                  {currentUser.phone || "Chưa cập nhật"}
                </p>
                <p>
                  <strong>Địa chỉ:</strong>{" "}
                  {currentUser.address || "Chưa cập nhật"}
                </p>
                <button onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
              </div>
            </div>
          )}
          <div className="order-history">
            <h3>Lịch sử đặt hàng của bạn:</h3>
            {currentUser.orders && currentUser.orders.length > 0 ? (
              <ul>
                {currentUser.orders.map((order) => (
                  <li key={order.id}>
                    <strong>Đơn hàng {order.id}</strong>
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.id}>
                          {item.name} x {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Không có đơn hàng nào.</p>
            )}
          </div>
          <button
            className="logout-btn"
            onClick={() => {
              logout();
              setCurrentUser(null);
              navigate("/");
            }}
          >
            Đăng xuất
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
