
import React from 'react';
import './SecondBanner.css'; // Import file CSS
import banner5 from '../../assets/images/banner-5.jpg'
const SecondBanner = () => {
    return (
        <div className="bistro-west-container">
            <div className="content-wrapper">
                <div className="image-container">
                    {/* Thay thế với đường dẫn hình ảnh của bạn */}
                    <img src={banner5} alt="Bistro West" className="hero-image" />
                </div>
                <div className="text-container">
                    <h2>VÌ SAO CHỌN BISTRO WEST</h2>
                    <p>
                        Hệ thống Bistro West được sáng lập và vận hành, trải qua hơn 16 năm, bằng sự sáng tạo không ngừng đã mang hồn Việt
                        "thổi" vào tinh hoa phương Tây, tạo ra những món "đỉnh" chiều lòng mọi khẩu vị.
                    </p>
                    <button className="view-more-button">XEM THÊM</button>
                </div>
            </div>
            <div className="stats-container">
                <div className="stat">
                    <span className="stat-number">452</span>
                    <span className="stat-label">Món ăn</span>
                </div>
                <div className="stat">
                    <span className="stat-number">30</span>
                    <span className="stat-label">Đầu bếp chuyên nghiệp</span>
                </div>
                <div className="stat">
                    <span className="stat-number">15+</span>
                    <span className="stat-label">Năm kinh nghiệm</span>
                </div>
                <div className="stat">
                    <span className="stat-number">3000+</span>
                    <span className="stat-label">Khách hàng hài lòng</span>
                </div>
            </div>
        </div>
    );
};

export default SecondBanner;
