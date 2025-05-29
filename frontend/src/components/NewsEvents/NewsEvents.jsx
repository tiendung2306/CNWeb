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
                        <img src="news1.jpg" alt="Nhà hàng Vịt 34 với menu 50 món ăn từ vịt" />
                    </div>
                    <h3>Nhà hàng Vịt 34 với menu 50 món ăn từ vịt</h3>
                    <p>Nhà hàng Vịt 34 phục vụ hơn 50 món ăn, từ món truyền thống như vịt om sấu, vịt rang muối, đến các sáng tạo mới lạ như vịt thiết bản gang, lưỡi vịt chiên xù.</p>
                    <a href="https://vnexpress.net/nha-hang-vit-34-voi-menu-50-mon-an-tu-vit-4888364.html" className="read-more-link">Xem thêm </a>
                </div>
                <div className="news-event-item">
                    <div className="news-event-date">22 Tháng 05, 2024</div>
                    <div className="news-event-image">
                        <img src="news2.jpg" alt="Ăn phở vắt nửa quả chanh, bún riêu cua có hột vịt lộn" />
                    </div>
                    <h3>Ăn phở vắt nửa quả chanh, bún riêu cua có hột vịt lộn</h3>
                    <p>Không cần nếm trước để thử vị, vắt chanh, thêm tương là quán tính của nhiều người đi ăn phở, hủ tiếu, bún riêu.</p>
                    <a href="https://vnexpress.net/quan-pho-gan-day-am-thuc-viet-dang-lon-xon-4885831.html" className="read-more-link">Xem thêm </a>
                </div>
                <div className="news-event-item">
                    <div className="news-event-date">22 Tháng 05, 2024</div>
                    <div className="news-event-image">
                        <img src="news3.jpg" alt="Nghề muối cà hơn 300 năm tuổi của ngôi làng Hà Nội" />
                    </div>
                    <h3>Nghề muối cà hơn 300 năm tuổi của ngôi làng Hà Nội</h3>
                    <p>
                        Từ gần 300 năm nay, người dân làng Khương Hạ sống nhờ nghề muối cà bát, món ăn dân dã quen thuộc của người dân Hà Nội.	</p>
                    <a href="https://vnexpress.net/nghe-muoi-ca-hon-300-nam-tuoi-cua-ngoi-lang-ha-noi-4884625.html" className="read-more-link">Xem thêm </a>
                </div>
            </div>
        </div>
    );
};

export default NewsEvents;