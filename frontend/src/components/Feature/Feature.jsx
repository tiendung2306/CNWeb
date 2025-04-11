import React from 'react';
import './Feature.css'; // Import file CSS
import feature1 from '../../assets/icons/feature1.png'
import feature2 from '../../assets/icons/feature2.png'
import feature3 from '../../assets/icons/feature3.png'
import feature4 from '../../assets/icons/feature4.png'
const Features = () => {
    return (
        <div className="features-container">
            <div className="feature-item">
                <div className="feature-icon">
                    <img src={feature1} alt="100% Sạch" />
                </div>
                <h3>100% Sạch</h3>
                <p>Thực phẩm sạch hay còn được gọi là thực phẩm hữu cơ, không chứa các chất hóa học độc hại từ thuốc trừ sâu, thuốc bảo vệ thực vật, thuốc kích thích tăng trưởng, bảo quản, các kim loại nặng trong đất.</p>
                <a href="/" className="read-more-link">Xem thêm →</a>
            </div>
            <div className="feature-item">
                <div className="feature-icon">
                    <img src={feature2} alt="Giao hàng" />
                </div>
                <h3>Giao hàng</h3>
                <p>Thực phẩm sạch hay còn được gọi là thực phẩm hữu cơ, không chứa các chất hóa học độc hại từ thuốc trừ sâu, thuốc bảo vệ thực vật, thuốc kích thích tăng trưởng, bảo quản, các kim loại nặng trong đất.</p>
                <a href="/" className="read-more-link">Xem thêm →</a>
            </div>
            <div className="feature-item">
                <div className="feature-icon">
                    <img src={feature3} alt="Thanh toán" />
                </div>
                <h3>Thanh toán</h3>
                <p>Thực phẩm sạch hay còn được gọi là thực phẩm hữu cơ, không chứa các chất hóa học độc hại từ thuốc trừ sâu, thuốc bảo vệ thực vật, thuốc kích thích tăng trưởng, bảo quản, các kim loại nặng trong đất.</p>
                <a href="/" className="read-more-link">Xem thêm →</a>
            </div>
            <div className="feature-item">
                <div className="feature-icon">
                    <img src={feature4} alt="Tổ chức sự kiện" />
                </div>
                <h3>Tổ chức sự kiện</h3>
                <p>Bistro West nhận tổ chức tiệc công ty, gia đình, sự kiện với nhiều thực đơn đa dạng, phục vụ tận tình với chi phí hợp lý, với menu hải sản, quý khách vui lòng liên hệ sớm để chúng tôi chuẩn bị tốt nhất.</p>
                <a href="/" className="read-more-link">Xem thêm→</a>
            </div>
        </div>
    );
};

export default Features;