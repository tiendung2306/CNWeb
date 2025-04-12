import React, { useState } from 'react'

import './Order.css'
import OrderItem from './OrderItem'
import EditOrderPopup from './EditOrderPopup'
const OrderList = ({ orders, onUpdateOrder, haveEdit }) => {
    const [selectedOrder, setSelectedOrder] = useState(null)

    const handleEditOrder = (order) => {
        setSelectedOrder(order)
    }

    const handleUpdateOrder = (updateOrder) => {
        onUpdateOrder(updateOrder);
        setSelectedOrder(null);
    }

    const handleClosePopup = () => {
        setSelectedOrder(null);
    };

    return (
        <div className="order-list">
            <h2>Danh sách đơn hàng</h2>
            {orders.map((order) => (
                <OrderItem key={order.id} order={order} onEdit={handleEditOrder} haveEdit={haveEdit} />
            ))}
            {selectedOrder && (
                <EditOrderPopup
                    order={selectedOrder}
                    onUpdate={handleUpdateOrder}
                    onClose={handleClosePopup}
                />
            )}
        </div>
    )
}

export default OrderList
