const orderService = require('../order/order.service');
const userService = require('../user/user.service');
const { Payment } = require('../../models');
const { Order } = require('../../models');

const createPayment = async (req, res) => {
    const { orderId, amount, paymentMethod, paymentStatus, paymentDate } = req.body;
    console.log(orderId, amount, paymentMethod, paymentStatus, paymentDate);
    const order = await orderService.getOrderById(orderId);
    if (!order) {
        throw new Error('Order not found');
    }


    const payment = await Payment.create({
        orderId,
        amount,
        paymentMethod,
        paymentStatus,
        paymentDate,
    });
    return payment;
}

const getAllPayments = async () => {
    return Payment.findAll();
}

const getPaymentById = async (id) => {
    return Payment.findByPk(id);
}

const getPaymentByUserId = async (id) => {
    const user = await userService.findById(id);
    if (!user) {
        throw new Error('User not found');
    }
    const payment = await Payment.findOne({
        include: [{
            model: Order,
            where: {
                userId: id
            }
        }]
    });
    return payment;
}

const updatePaymentById = async (id, paymentData) => {
    const { orderId, amount, paymentMethod, paymentStatus, paymentDate } = paymentData;
    if (orderId) {
        const order = await orderService.getOrderById(orderId);
        if (!order) {
            throw new Error('Order not found');
        }
    }
    const payment = await Payment.findByPk(id);
    if (!payment) {
        throw new Error('Payment not found');
    }
    await payment.update(paymentData);
    return payment;
}

const deletePaymentById = async (id) => {
    const payment = await Payment.findByPk(id);
    if (!payment) {
        throw new Error('Payment not found');
    }
    await payment.destroy();
    return payment;
}

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentByUserId,
    updatePaymentById,
    deletePaymentById,
}