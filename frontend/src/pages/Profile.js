import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth từ context
import LoginModal from "../components/LoginModal";
import "./Profile.css";

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const { user, logout, isLoggedIn } = useAuth(); // Lấy dữ liệu từ AuthContext
  console.log("AuthContext:", { user, isLoggedIn });
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
  useEffect(() => {
    console.log("Profile component re-rendered với user:", user);
  }, [user]);

  const handleLogout = () => {
    logout(); // Gọi hàm logout từ AuthContext
    setLoading(false); // Dừng loading sau khi logout
    navigate("/"); // Chuyển hướng về trang chủ sau khi đăng xuất
  };

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;
  console.log("User condition check:", !user);

  return (
    <div className="profile-container">
      <h2>Hồ sơ cá nhân</h2>
      <pre>{JSON.stringify(user, null, 2)}</pre>

      {user ? (
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
            <p><strong>Tên:</strong> {user?.username ? user.username : "Dữ liệu chưa cập nhật"}</p>
<p><strong>Email:</strong> {user?.email ? user.email : "Dữ liệu chưa cập nhật"}</p>
<p><strong>Số điện thoại:</strong> {user?.phone ? user.phone : "Dữ liệu chưa cập nhật"}</p>
<p><strong>Địa chỉ:</strong> {user?.address ? user.address : "Dữ liệu chưa cập nhật"}</p>

          </div>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Đăng xuất
        </button>
      </>
        
      ) : (
        <>
          <p>Không có dữ liệu người dùng.</p>
        </>
      )}
    </div>
  );
};

export default Profile;
