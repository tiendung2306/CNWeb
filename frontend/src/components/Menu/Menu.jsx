import React from 'react';
import './Menu.css'; // Import file CSS

const Menu = () => {
    return (
        <div className="menu-container">
            <div className="menu-title">
                <h1>THỰC ĐƠN ĐẶC BIỆT CHO BẠN</h1>
                <p>Best food for you and family</p>
            </div>
            <div className="menu-items">
                <div className="menu-item">
                    <div className="menu-item-content">
                        <h3>Gà viên đúc phô mai</h3>
                        <p>Gà viên nhân phô mai 200g, làm cho những nồi lẩu phong cách nhà làm của bạn ngày càng trở...</p>
                    </div>
                    <div className="menu-item-price">
                        <p>50,000₫</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Menu;