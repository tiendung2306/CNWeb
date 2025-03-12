const { create } = require('joi/lib/errors');
const { OrderItem } = require('../../models');
const menuItemService = require('../menuitem/menuitem.service');

const createOrderItem = async (orderId, orderItemData) => {
    const { menuItemId, quantity, price } = orderItemData;

    const menuItem = await menuItemService.findById(menuItemId);
    if (!menuItem) {
        throw new Error('Menu item not found');
    }

    const newOrderItem = await OrderItem.create({orderId, ...orderItemData});
    return newOrderItem;
}

const getOrderItemsByOrderId = async (orderId) => {
    return OrderItem.findAll({
        where: {
            orderId,
        }
    });
}

const deleteOrderItemsByOrderId = async (orderId) => {
    return OrderItem.destroy({
        where: {
            orderId,
        }
    });
}

module.exports = {
    createOrderItem,
    getOrderItemsByOrderId,
    deleteOrderItemsByOrderId,
};