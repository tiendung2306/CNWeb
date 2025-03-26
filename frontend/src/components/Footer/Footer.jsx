import React from 'react';
import './Footer.css'; // Import file CSS

const Footer = () => {
    return (
        <div className="footer-container">
            <div className="footer-logos">
                <img src="path/to/food-court-logo.png" alt="Food Court Logo" />
                <img src="path/to/restaurant-logo1.png" alt="Restaurant Logo 1" />
                <img src="path/to/restaurant-logo2.png" alt="Restaurant Logo 2" />
                <img src="path/to/restaurant-logo3.png" alt="Restaurant Logo 3" />
                <img src="path/to/restaurant-logo4.png" alt="Restaurant Logo 4" />
                <img src="path/to/restaurant-logo5.png" alt="Restaurant Logo 5" />
            </div>
            <div className="footer-content">
                <div className="subscribe-section">
                    <h3>Đăng ký nhận tin</h3>
                    <div className="subscribe-form">
                        <input type="email" placeholder="Nhập email của bạn" />
                        <button>ĐĂNG KÝ</button>
                    </div>
                </div>
                <div className="social-section">
                    <h3>Kết nối với chúng tôi</h3>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><img src="path/to/facebook-icon.png" alt="Facebook" /></a>
                        <a href="#" className="social-icon"><img src="path/to/twitter-icon.png" alt="Twitter" /></a>
                        <a href="#" className="social-icon"><img src="path/to/instagram-icon.png" alt="Instagram" /></a>
                        <a href="#" className="social-icon"><img src="path/to/google-icon.png" alt="Google" /></a>
                        <a href="#" className="social-icon"><img src="path/to/youtube-icon.png" alt="YouTube" /></a>
                    </div>
                </div>
            </div>
            <div className="footer-details">
                <div className="footer-column">
                    <h3>Về Bistro West</h3>
                    <p>Hệ thống Bistro West được sáng lập và vận hành, trải qua hơn 16 năm, bằng sự sáng tạo không ngừng đã mang hồn Việt "thổi" vào tinh hoa phương Tây, tạo ra những món "đỉnh" chiều lòng mọi khẩu vị.</p>
                    <p>• Tầng 4, tòa nhà Flemington, số 182, đường Lê Đại Hành, phường 15, quận 11, Tp. Hồ Chí Minh.</p>
                    <p>1900.000.XXX</p>
                    <p>hi@bistro-west.abc</p>
                    <h3>Phương thức thanh toán</h3>
                    <img src="path/to/payment-icons.png" alt="Payment Icons" className="payment-icons" />
                </div>
                <div className="footer-column">
                    <h3>Hỗ trợ khách hàng</h3>
                    <p>Sản phẩm khuyến mãi</p>
                    <p>Sản phẩm nổi bật</p>
                    <p>Tất cả sản phẩm</p>
                    <h3>Phương thức vận chuyển</h3>
                    <img src="path/to/shipping-icons.png" alt="Shipping Icons" className="shipping-icons" />
                </div>
                <div className="footer-column">
                    <h3>Liên kết</h3>
                    <p>Trang chủ</p>
                    <p>Giới thiệu</p>
                    <p>Thực đơn</p>
                    <p>Đặt bàn</p>
                    <p>Sản phẩm</p>
                    <p>Tin tức</p>
                    <p>Liên hệ</p>
                </div>
                <div className="footer-column">
                    <h3>Chính sách</h3>
                    <p>Tìm kiếm</p>
                    <p>Giới thiệu</p>
                    <p>Chính sách đổi trả</p>
                    <p>Chính sách bảo mật</p>
                    <p>Điều khoản dịch vụ</p>
                    <p>Liên hệ</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;