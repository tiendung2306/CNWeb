import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth từ context
import LoginModal from "../components/LoginModal";
import Home from "../page/home/Home";


const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth(); // Lấy dữ liệu từ AuthContext

  // Kiểm tra người dùng đã đăng nhập chưa
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/"); // Chuyển hướng đến trang đăng nhập nếu chưa đăng nhập
    } else {
      setLoading(false); // Đã đăng nhập, không cần tải lại dữ liệu
    }
  }, [isLoggedIn, navigate]);

  // Debugging: Log dữ liệu người dùng để kiểm tra
  useEffect(() => {
    console.log("User data in Profile: ", user);
  }, [user]);

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ AuthContext
    setLoading(false); // Dừng loading sau khi logout
    navigate("/"); // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="profile-container">
      <h2>Hồ sơ cá nhân</h2>

      {!user ? (
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
          <div className="profile-user">
            <div className="profile-image">
              {/* Hiển thị avatar nếu có */}
              {user.avatar ? (
                <img src={user.avatar} alt="Avatar" className="profile-avatar" />
              ) : (
                <i className="fas fa-user-circle default-avatar-icon"></i>
              )}
            </div>
            <div className="profile-info">
              {/* Đảm bảo lấy thông tin đúng từ user */}
              <p><strong>Tên:</strong> {user.username || "Chưa có tên"}</p>
              <p><strong>Email:</strong> {user.email || "Chưa có email"}</p>
              <p><strong>Số điện thoại:</strong> {user.phone || "Chưa cập nhật"}</p>
              <p><strong>Địa chỉ:</strong> {user.address || "Chưa cập nhật"}</p>
            </div>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Đăng xuất
          </button>
        </>
      )}

    </div>
  );
};

export default Profile;
