import React from 'react';
import './Order.css'

const OrderItem = ({ order, onEdit }) => {
    return (
        <div className="order-item">
            <p>Mã đơn hàng: {order.id}</p>
            <p>Tên khách hàng: {order.customerName}</p>
            <p>Món ăn: {order.items.join(', ')}</p>
            <p>Tổng tiền: {order.totalAmount} VND</p>
            <button onClick={() => onEdit(order)}>Chỉnh sửa</button>
        </div>
    );
};

export default OrderItem;