import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Xử lý chuyển hướng nếu chưa đăng nhập
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      setLoading(false);
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    console.log("User data in Profile:", user);
  }, [user]);

  const handleLogout = () => {
    logout();
    setLoading(false);
    navigate("/");
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (!user) return <p>Không có dữ liệu người dùng.</p>;

  return (
    <div className="profile-container modern-container">
      <h2 className="profile-title">Hồ sơ cá nhân</h2>

      <div className="profile-user modern-card">
        <div className="profile-image modern-avatar">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="profile-avatar modern-avatar-img" />
          ) : (
            <i className="fas fa-user-circle default-avatar-icon modern-icon"></i>
          )}
        </div>
        <div className="profile-info modern-info">
          <p><strong>Tên:</strong> {user.username || "Chưa cập nhật"}</p>
          <p><strong>Email:</strong> {user.email || "Chưa cập nhật"}</p>
          <p><strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}</p>
          <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
        </div>
      </div>

      <button className="logout-btn modern-button" onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  );
};

export default Profile;
