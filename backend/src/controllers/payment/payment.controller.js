const paymentService = require('../../services/payment/payment.service');
import { createdResponse, errorResponse, notFoundResponse, successResponse } from '../../helpers';

const createPayment = async (req, res) => {
    try {
        // console.log(req.body);
        const payment = await paymentService.createPayment(req, res);
        return createdResponse(req, res, payment);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
}

const getAllPayments = async (req, res) => {
    try {
        const payments = await paymentService.getAllPayments();
        return successResponse(req, res, { payments });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
}

const getPaymentById = async (req, res) => {
    try {
        const payment = await paymentService.getPaymentById(req.params.id);
        if (payment) {
            return successResponse(req, res, payment);
        } else {
            return notFoundResponse(req, res, 'Payment not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
}

const getPaymentByUserId = async (req, res) => {
    try {
        const payment = await paymentService.getPaymentByUserId(req.params.id);
        if (payment) {
            return successResponse(req, res, payment);
        } else {
            return notFoundResponse(req, res, 'Payment not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
}

const updatePayment = async (req, res) => {
    try {
        const updatedPayment = await paymentService.updatePaymentById(req.params.id, req.body);
        if (updatedPayment) {
            return successResponse(req, res, updatedPayment);
        } else {
            return notFoundResponse(req, res, 'Payment not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
}

const deletePayment = async (req, res) => {
    try {
        const deletedPayment = await paymentService.deletePaymentById(req.params.id);
        if (deletedPayment) {
            return successResponse(req, res, { message: 'Payment deleted successfully' });
        } else {
            return notFoundResponse(req, res, 'Payment not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
}

const createPaymentVNPAY = async (req, res) => {
    try {
        const vnpUrl = await paymentService.createPaymentVNPAY(req, res);
        res.json({vnpUrl});
    } catch(error) {
        return errorResponse(req, res, error.message);
    }
}

module.exports = {
    createPayment,
    getAllPayments,
    getPaymentById,
    getPaymentByUserId,
    updatePayment,
    deletePayment,
    createPaymentVNPAY,
};