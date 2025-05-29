import React, { useState } from 'react';
import './Order.css'

const EditOrderPopup = ({ order, onUpdate, onClose }) => {
    const [customerName, setCustomerName] = useState(order.customerName);
    const [items, setItems] = useState(order.items.join(', '));
    const [totalAmount, setTotalAmount] = useState(order.totalAmount);

    const handleSubmit = (e) => {
        e.preventDefault();
        onUpdate({
            ...order,
            customerName,
            items: items.split(',').map((item) => item.trim()),
            totalAmount: parseFloat(totalAmount),
        });
    };

    return (
        <div className="popup">
            <div className="popup-content">
                <h2>Chỉnh sửa đơn hàng</h2>
                <form onSubmit={handleSubmit}>
                    <label>Tên khách hàng:</label>
                    <input
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <label>Món ăn:</label>
                    <input
                        type="text"
                        value={items}
                        onChange={(e) => setItems(e.target.value)}
                    />
                    <label>Tổng tiền:</label>
                    <input
                        type="number"
                        value={totalAmount}
                        onChange={(e) => setTotalAmount(e.target.value)}
                    />
                    <button type="submit">Cập nhật</button>
                    <button type="button" onClick={onClose}>
                        Đóng
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditOrderPopup;