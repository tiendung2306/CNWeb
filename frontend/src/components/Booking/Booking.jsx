import React from 'react';
import './Booking.css'; // Import file CSS

const Booking = () => {
    return (
        <div className="booking-container">
            <div className="booking-title">
                <h1>LIÊN HỆ ĐẶT BÀN</h1>
                <p>Best food for you and family</p>
            </div>
            <div className="booking-form">
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="guests">Số Lượng Khách</label>
                        <select id="guests">
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="date">05/09/2024</label>
                        <input type="date" id="date" />
                    </div>
                </div>
                <div className="form-row">
                    <div className="form-group">
                        <label htmlFor="time">Chọn Thời Gian</label>
                        <select id="time">
                            <option value="12:00">12:00</option>
                            <option value="13:00">13:00</option>
                            <option value="14:00">14:00</option>
                            <option value="15:00">15:00</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">+01/123456789</label>
                        <input type="tel" id="phone" />
                    </div>
                </div>
                <button className="booking-button">ĐẶT BÀN</button>
            </div>
        </div>
    );
};

export default Booking;