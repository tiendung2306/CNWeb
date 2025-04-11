// AdminOrderPage.jsx
import React, { useEffect, useState } from 'react';
import './AdminOrderList.css';

const AdminOrderList = () => {
    const [orders, setOrders] = useState([]);
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJJZCI6MywiZW1haWwiOiJhZG1pbjFAZ21haWwuY29tIiwiY3JlYXRlZEF0IjoiMjAyNS0wMy0zMFQwMDoyMjoyNS4zNjBaIn0sImlhdCI6MTc0MzI5NDE0NX0.djSJ8j3Rrfvkm9w16bsjpoJFlvG7tKR9wrXxrkrByO0'; // Hoặc localStorage.getItem('x-token');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('http://localhost:3001/api/admin/order', {
                    headers: {
                        'x-token': token,
                    },
                });

                const data = await res.json();
                if (data.success) {
                    setOrders(data.data.orders);
                }
            } catch (error) {
                console.error('Lỗi lấy đơn hàng:', error);
            }
        };

        fetchOrders();
    }, []);

    return (
        <div className="order-container">
            <h1 className="page-title">Lịch sử đặt hàng</h1>
            <p className="page-subtitle">Quản lý và theo dõi đơn hàng</p>

            {orders.map(({ order, orderItems }) => (
                <div key={order.id} className="order-card">
                    <div className="order-header">
                        <div className="order-info">
                            <strong>Mã số đơn hàng :</strong> {order.id}
                            <div className="order-date">
                                Được đặt vào {new Date(order.orderDate).toLocaleString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: 'numeric',
                                })}
                            </div>
                        </div>
                        <button className="detail-button">Chi tiết</button>
                    </div>

                    <div className="order-body">
                        <div className="customer-info">
                            <h4>Thông tin khách hàng</h4>
                            <p><strong>ID:</strong> {order.userId}</p>
                            <p>{order.deliveryAddress}</p>
                        </div>

                        <div className="product-list">
                            <h4>Nội dung đơn hàng</h4>
                            {orderItems.map((item) => {
                                const imageMap = {
                                    1: 'https://cdn-icons-png.flaticon.com/512/828/828777.png', // ví dụ ảnh cánh gà
                                    2: 'https://cdn-icons-png.flaticon.com/512/3132/3132693.png', // bánh mì bơ tỏi
                                    3: 'https://cdn-icons-png.flaticon.com/512/1046/1046750.png', // beef steak
                                };
                                const nameMap = {
                                    1: 'Cánh gà',
                                    2: 'Bánh mì bơ tỏi',
                                    3: 'Beef Steaks',
                                };

                                return (
                                    <div key={item.id} className="product-item">
                                        <img src={imageMap[item.menuItemId]} alt="item" />
                                        <span>{nameMap[item.menuItemId] || `Món #${item.menuItemId}`}</span>
                                        <strong>${parseFloat(item.price).toFixed(2)}</strong>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AdminOrderList;
