import React, { useState, useContext, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Header.css";
import LoginModal from "./LoginModal.js";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext.js";

function Header() {
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const { cart, notification } = useContext(CartContext);
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const profileRef = useRef(null); // 👈 ref vùng dropdown

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="header-wrap">
      <div className="header">
        <div className="header-logo">
          <Link to="/" className="header-logo__link">
            <i className="fa-solid fa-store"> Bistro West</i>
          </Link>
        </div>

        <div className="header-menu">
          <ul className="header-menu-list">
            <li className="header-menu-item"><Link to="/" className="header-menu__link"><i className="fa-solid fa-house"></i> Trang chủ</Link></li>
            <li className="header-menu-item"><Link to="/menu" className="header-menu__link"><i className="fa-solid fa-utensils"></i> Thực đơn</Link></li>
            <li className="header-menu-item"><Link to="/services" className="header-menu__link"><i className="fa-solid fa-concierge-bell"></i> Dịch vụ</Link></li>
            <li className="header-menu-item"><Link to="/contact" className="header-menu__link"><i className="fa-solid fa-envelope"></i> Liên hệ</Link></li>
          </ul>
        </div>

        <div className="header-wrap-action">
          <div className="header-action">
            <div className="header-action-item header-action_hotline">
              <a href="tel:0123456789" className="header-action__link">
                <i className="fa-solid fa-phone"></i>
                <span>0123 456 789</span>
              </a>
            </div>

            {/* Nếu đã đăng nhập thì hiển thị Profile, nếu chưa thì hiển thị Login */}
            <div className="header-action-item header-action_account" ref={profileRef}>
              {isLoggedIn ? (
                <div className="profile-dropdown">
                  <button
                    className="profile-btn"
                    onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                  >
                    <i className="fa-solid fa-user"></i> {user && user.name}
                  </button>
                  {isProfileMenuOpen && (
                    <ul className="profile-menu">
                      <li><Link to="/profile">Tài khoản</Link></li>
                      <li><Link to="/history">Lịch sử đặt hàng</Link></li>
                      <li>
                        <button
                          onClick={() => {
                            logout();
                            navigate("/");
                          }}
                        >
                          Đăng xuất
                        </button>
                      </li>
                    </ul>
                  )}
                </div>
              ) : (
                <button
                  className="header-action__link"
                  onClick={() => setLoginFormVisible(true)}
                >
                  <i className="fa-solid fa-user"></i>
                </button>
              )}
            </div>

            <div className="header-action-item header-action_cart">
              <Link to="/cart" className="header-action__link">
                <i className="fa-solid fa-shopping-cart"></i>
                {totalItems > 0 && <span className="count-holder">{totalItems}</span>}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {notification && <div className="cart-notification">{notification}</div>}

      {isLoginFormVisible && !isLoggedIn && (
        <div className="login-form-overlay active" onClick={() => setLoginFormVisible(false)}>
          <div className="login-form-wrapper" onClick={(e) => e.stopPropagation()}>
            <LoginModal isVisible={isLoginFormVisible} onClose={() => setLoginFormVisible(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
