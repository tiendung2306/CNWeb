import React, { useState } from 'react'
import OrderList from '../../components/Order/OrderList';

const OrderPage = () => {
    const [orders, setOrders] = useState([
        {
            id: 1,
            customerName: 'Nguyễn Văn A',
            items: ['Cơm gà', 'Nước ngọt'],
            totalAmount: 50000,
        },
        {
            id: 2,
            customerName: 'Trần Thị B',
            items: ['Phở bò', 'Trà đá'],
            totalAmount: 60000,
        },
    ]);

    const handleUpdateOrder = (updatedOrder) => {
        const updatedOrders = orders.map((order) =>
            order.id === updatedOrder.id ? updatedOrder : order
        );
        setOrders(updatedOrders);
    };

    return (
        <div>
            <OrderList orders={orders} onUpdateOrder={handleUpdateOrder} haveEdit={false} />
        </div>
    );
}

export default OrderPage
