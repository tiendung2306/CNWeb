import React, { useState } from "react";
import "./Header.css";
import LoginModal from "./LoginModal.js";

function Header() {
  const [isLoginFormVisible, setLoginFormVisible] = useState(false);

  return (
    <div className="header-wrap">
      <div className="header">
        <div className="header-logo">
          <a href="/" className="header-logo__link">
          <i class="fa-solid fa-store"> Bistro West</i>
          </a>
        </div>
        <div className="header-menu">
          <ul className="header-menu-list">
            <li className="header-menu-item">
              <a href="/" className="header-menu__link">
              <i className="fa-solid fa-house"></i> Trang chủ</a>
            </li>
            <li className="header-menu-item">
              <a href="/" className="header-menu__link">
              <i className="fa-solid fa-utensils"></i> Thực đơn</a>
            </li>
            <li className="header-menu-item">
              <a href="/" className="header-menu__link">
              <i className="fa-solid fa-concierge-bell"></i> Dịch vụ</a>
            </li>
            <li className="header-menu-item">
              <a href="/" className="header-menu__link">
              <i className="fa-solid fa-envelope"></i> Liên hệ</a>
            </li>
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
            <div className="header-action-item header-action_account">
              <a href="#" className="header-action__link" 
                 onClick={(e) => {
                   e.preventDefault();
                   setLoginFormVisible(true);
                 }}>
                <i className="fa-solid fa-user"></i>
              </a>
            </div>
            <div className="header-action-item header-action_cart">
              <a href="#" className="header-action__link">
                <i className="fa-solid fa-shopping-cart"></i>
                <span className="count-holder">3</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {isLoginFormVisible && (
        <div className="login-form-overlay active" 
             onClick={() => setLoginFormVisible(false)}>
          <div className="login-form-wrapper" onClick={(e) => e.stopPropagation()}>
            <LoginModal 
              isVisible={isLoginFormVisible}
              onClose={() => setLoginFormVisible(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
