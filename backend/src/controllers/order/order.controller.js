const orderService = require('../../services/order/order.service');
import { createdResponse, errorResponse, notFoundResponse, successResponse } from '../../helpers';

// Create a new order
const createOrder = async (req, res) => {
    try {
        const order = await orderService.createOrder(req.body);
        return createdResponse(req, res, {...order});
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Get all orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderService.getAllOrders();
        return successResponse(req, res, {orders});
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Get order by ID
const getOrderById = async (req, res) => {
    try {
        const order = await orderService.getOrderById(req.params.id);
        if (order) {
            return successResponse(req, res, {...order});
        } else {
            return notFoundResponse(req, res, 'Order not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Update order by ID
const updateOrder = async (req, res) => {
    try {
        const updatedOrder = await orderService.updateOrderById(req.params.id, req.body);
        if (updatedOrder) {
            return successResponse(req, res, {...updatedOrder});
        } else {
            return notFoundResponse(req, res, 'Order not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Delete order by ID
const deleteOrder = async (req, res) => {
    try {
        const deletedOrder = await orderService.deleteOrderById(req.params.id);
        if (deletedOrder) {
            return successResponse(req, res, {message: 'Order deleted successfully'});
        } else {
            return notFoundResponse(req, res, 'Order not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

module.exports = {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder
};