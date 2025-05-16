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
                        <img src="/customer1.jpg" alt="" />
                        <div>
                            <h3>Dang Tien Hoang</h3>
                            <p>Quản lý kinh doanh ABC</p>
                        </div>
                    </div>

                </div>
                <div className="review-item">
                    <p>Món ăn ngon và tươi, nhà hàng sạch sẽ, phục vụ chu đáo. Đã đưa gia đình đến ăn nhiều lần, sẽ tiếp tục ủng hộ. Mong Bistro West mở thêm nhiều chi nhánh để tiện lợi hơn.</p>
                    <div className="review-author">
                        <img src="/customer2.jpg" alt="" />
                        <div>
                            <h3>Trinh Tran Phuong Tuan</h3>
                            <p>Trưởng phòng CDF</p>
                        </div>
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