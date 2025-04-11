import React from 'react';
import './Reviews.css'; // Import file CSS

const Reviews = () => {
    return (
        <div className="reviews-container">
            <div className="reviews-title">
                <h1>KHÁCH HÀNG NÓI VỀ BISTRO WEST</h1>
                <p>Best food for you and family</p>
            </div>
            <div className="reviews-items">
                <div className="review-item">
                    <p>Món ăn ngon và tươi, nhà hàng sạch sẽ, phục vụ chu đáo. Đã đưa gia đình đến ăn nhiều lần, sẽ tiếp tục ủng hộ. Mong Bistro West mở thêm nhiều chi nhánh để tiện lợi hơn.</p>
                    <div className="review-author">
                        <img src="path/to/nguyen-van-a.jpg" alt="Nguyen Van A" />
                        <div>
                            <h3>Nguyen Van A</h3>
                            <p>Quản lý kinh doanh ABC</p>
                        </div>
                    </div>
                    <div className="quote-icon">
                        <img src="path/to/quote-icon.png" alt="Quote Icon" />
                    </div>
                </div>
                <div className="review-item">
                    <p>Món ăn ngon và tươi, nhà hàng sạch sẽ, phục vụ chu đáo. Đã đưa gia đình đến ăn nhiều lần, sẽ tiếp tục ủng hộ. Mong Bistro West mở thêm nhiều chi nhánh để tiện lợi hơn.</p>
                    <div className="review-author">
                        <img src="path/to/nguyen-van-b.jpg" alt="Nguyen Van B" />
                        <div>
                            <h3>Nguyen Van B</h3>
                            <p>Trưởng phòng CDF</p>
                        </div>
                    </div>
                    <div className="quote-icon">
                        <img src="path/to/quote-icon.png" alt="Quote Icon" />
                    </div>
                </div>
            </div>
            <div className="reviews-dots">
                <span className="dot active"></span>
                <span className="dot"></span>
            </div>
        </div>
    );
};

export default Reviews;