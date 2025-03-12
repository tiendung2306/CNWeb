const {Order} = require("../../models");
const userService = require("../user/user.service");
const orderItemService = require("../orderitem/orderitem.service");

const createOrder = async (orderData) => {
    const { userId, totalAmount, status, orderDate, deliveryAddress, orderItems } = orderData;
    const user = await userService.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const newOrder = await Order.create(orderData);
    const newOrderItems = await Promise.all(orderItems.map(async (orderItem) => {
        return orderItemService.createOrderItem(newOrder.id, orderItem);
    }));
    return {order: newOrder, orderItems: newOrderItems};
}

const getAllOrders = async () => {
    const orders = await Order.findAll();
    const ordersWithItems = await Promise.all(orders.map(async (order) => {
        const orderItems = await orderItemService.getOrderItemsByOrderId(order.id);
        return {order, orderItems};
    }
    ));
    return ordersWithItems;
}

const getOrderById = async (id) => {
    const order = await Order.findByPk(id);
    if(!order) {
        throw new Error('Order not found');
    }
    const orderWithItems = await orderItemService.getOrderItemsByOrderId(id);
    return {order, orderItems: orderWithItems};
}

const updateOrderById = async (id, orderData) => {
    const { userId, totalAmount, status, orderDate, deliveryAddress, orderItems } = orderData;
    const user = await userService.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    const order = await Order.findByPk(id);
    if (!order) {
        throw new Error('Order not found');
    }
    await orderItemService.deleteOrderItemsByOrderId(id);
    await order.update(orderData);
    const newOrderItems = await Promise.all(orderItems.map(async (orderItem) => {
        return orderItemService.createOrderItem(order.id, orderItem);
    }));
    
    return {order, orderItems: newOrderItems};
}

const deleteOrderById = async (id) => {
    const order = await Order.findByPk(id);
    if (!order) {
        throw new Error('Order not found');
    }
    await orderItemService.deleteOrderItemsByOrderId(id);
    await order.destroy();
    return order;
}

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrderById,
    deleteOrderById,
};