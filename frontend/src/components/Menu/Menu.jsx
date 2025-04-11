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
                <div className="menu-item">
                    <div className="menu-item-content">
                        <h3>Gà xiên que</h3>
                        <p>Gà xiên que bao gồm thịt gà được cắt miếng ướp cùng với tỏi, bột cà ri, muối tiêu, khi...</p>
                    </div>
                    <div className="menu-item-price">
                        <p>35,000₫</p>
                    </div>
                </div>
                <div className="menu-item">
                    <div className="menu-item-content">
                        <h3>Garlic Prime Rib</h3>
                        <p>Bít tết sẽ là lựa chọn tuyệt vời cho những bữa tiệc sang chảnh tại nhà với hương vị thơm...</p>
                    </div>
                    <div className="menu-item-price">
                        <p>320,000₫</p>
                    </div>
                </div>
                <div className="menu-item">
                    <div className="menu-item-content">
                        <h3>Green Chicken Salad</h3>
                        <p>Salad là món gỏi trộn thanh đạm và thường xuất hiện trong thực đơn món Âu, nhưng bạn đã thực sự...</p>
                    </div>
                    <div className="menu-item-price">
                        <p>125,000₫</p>
                    </div>
                </div>
                <div className="menu-item">
                    <div className="menu-item-content">
                        <h3>Hamburger Trứng, Thịt Bò & Xúc Xích</h3>
                        <p>Bạn là tín đồ của thịt bò? Bạn muốn biến tấu những miếng thịt bò thành một món ăn khác...</p>
                    </div>
                    <div className="menu-item-price">
                        <p>52,000₫</p>
                    </div>
                </div>
                <div className="menu-item">
                    <div className="menu-item-content">
                        <h3>KHOAI TÂY PHÔ MAI</h3>
                        <p>...</p>
                    </div>
                    <div className="menu-item-price">
                        <p>29,000₫</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Menu;