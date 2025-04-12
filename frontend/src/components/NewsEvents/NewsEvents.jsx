import React from 'react';
import './NewsEvents.css'; // Import file CSS

const NewsEvents = () => {
    return (
        <div className="news-events-container">
            <div className="news-events-title">
                <h1>TIN TỨC VÀ SỰ KIỆN MỚI NHẤT</h1>
                <p>Best food for you and family</p>
            </div>
            <div className="news-events-items">
                <div className="news-event-item">
                    <div className="news-event-date">22 Tháng 05, 2024</div>
                    <div className="news-event-image">
                        <img src="path/to/spain-food.jpg" alt="12 món ăn nổi tiếng ở Tây Ban Nha" />
                    </div>
                    <h3>12 món ăn nổi tiếng ở Tây Ban Nha nhất định phải ăn cho đã đời</h3>
                    <p>Người Tây Ban Nha lấy thực phẩm chủ yếu từ đất đai và biển cả, nền ẩm thực của họ...</p>
                    <a href="#" className="read-more-link">Xem thêm </a>
                </div>
                <div className="news-event-item">
                    <div className="news-event-date">22 Tháng 05, 2024</div>
                    <div className="news-event-image">
                        <img src="path/to/saigon-food.jpg" alt="Top 5 món ngon Sài Gòn" />
                    </div>
                    <h3>Top 5 món ngon không thể bỏ qua khi đến Sài Gòn</h3>
                    <p>Những món đặc sản nổi tiếng như cơm tấm, hủ tiếu, bánh xèo, lẩu cá kèo... là những món ngon...</p>
                    <a href="#" className="read-more-link">Xem thêm </a>
                </div>
                <div className="news-event-item">
                    <div className="news-event-date">22 Tháng 05, 2024</div>
                    <div className="news-event-image">
                        <img src="path/to/italian-food.jpg" alt="Sự tinh tế ẩm thực Italia" />
                    </div>
                    <h3>Sự tinh tế và lãng mạn của nét ẩm thực Italia</h3>
                    <p>Ngoài những hàng thời trang nổi tiếng bậc nhất thế giới, đất nước Italia còn được coi là cái nôi...</p>
                    <a href="#" className="read-more-link">Xem thêm </a>
                </div>
            </div>
        </div>
    );
};

export default NewsEvents;