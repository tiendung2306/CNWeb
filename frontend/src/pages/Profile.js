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
    <div className="profile-container">
      <h2>Hồ sơ cá nhân</h2>

      <div className="profile-user">
        <div className="profile-image">
          {user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="profile-avatar" />
          ) : (
            <i className="fas fa-user-circle default-avatar-icon"></i>
          )}
        </div>
        <div className="profile-info">
          <p><strong>Tên:</strong> {user.username || "Chưa cập nhật"}</p>
          <p><strong>Email:</strong> {user.email || "Chưa cập nhật"}</p>
          <p><strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}</p>
          <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
        </div>
      </div>

      <button className="logout-btn" onClick={handleLogout}>
        Đăng xuất
      </button>
    </div>
  );
};

export default Profile;
