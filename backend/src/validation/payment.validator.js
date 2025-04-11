const Joi = require('joi');

export const createPayment = {
    body: Joi.object({
        orderId: Joi.number().required(),
        amount: Joi.number().min(0).required(),
        paymentMethod: Joi.string().required().valid('Cash', 'Momo'),
        paymentStatus: Joi.string().valid('Pending', 'Completed', 'Failed').required(),
        paymentDate: Joi.date(),
    }),
}

export const updatePayment = {
    body: Joi.object({
        orderId: Joi.number(),
        amount: Joi.number().min(0),
        paymentMethod: Joi.string().valid('Cash', 'Momo'),
        paymentStatus: Joi.string().valid('Pending', 'Completed', 'Failed'),
        paymentDate: Joi.date(),
    }),
    params: Joi.object({
        id: Joi.number().required(),
    }),
}

export const getPaymentById = {
    params: Joi.object({
        id: Joi.number().required(),
    }),
}

export const getPaymentByUserId = {
    params: Joi.object({
        id: Joi.number().required(),
    }),
}

export const deletePayment = {
    params: Joi.object({
        id: Joi.number().required(),
    }),
}
