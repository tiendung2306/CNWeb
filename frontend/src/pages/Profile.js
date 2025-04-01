import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LoginModal from "../components/LoginModal";
import "./Profile.css";

const Profile = () => {
  const { user, logout, login } = useAuth(); 
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(user || { name: "", email: "", phone: "", address: "" });
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditUser] = useState(currentUser);

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

      {!currentUser?.name ? (
        <>
          <p>Bạn chưa đăng nhập.</p>
          <button onClick={() => setShowLoginModal(true)} className="login-btn">
            Đăng nhập ngay
          </button>
          {showLoginModal && (
            <LoginModal isVisible={showLoginModal} onClose={() => setShowLoginModal(false)} />
          )}
        </>
      ) : (
        <>
          {isEditing ? (
            <div className="edit-form">
              <input type="text" name="name" value={editedUser.name} onChange={handleEditChange} />
              <input type="email" name="email" value={editedUser.email} onChange={handleEditChange} />
              <input type="text" name="phone" value={editedUser.phone} onChange={handleEditChange} />
              <button onClick={handleSave}>Lưu</button>
              <button onClick={() => setIsEditing(false)}>Hủy</button>
            </div>
          ) : (
            <div className="profile-user">
              <div className="profile-image">
                {currentUser.avatar ? (
                  <img src={currentUser.avatar} alt="Avatar" className="profile-avatar" />
                ) : (
                  <i className="fas fa-user-circle default-avatar-icon"></i>
                )}
              </div>
              <div className="profile-info">
                <p><strong>Tên:</strong> {currentUser.name}</p>
                <p><strong>Email:</strong> {currentUser.email}</p>
                <p><strong>Số điện thoại:</strong> {currentUser.phone || "Chưa cập nhật"}</p>
                <p><strong>Địa chỉ:</strong> {currentUser.address || "Chưa cập nhật"}</p>
                <button onClick={() => setIsEditing(true)}>Chỉnh sửa</button>
              </div>
            </div>
          )}
          
          <button className="logout-btn" onClick={() => { logout(); navigate("/"); }}>
            Đăng xuất
          </button>
        </>
      )}
    </div>
  );
};

export default Profile;
