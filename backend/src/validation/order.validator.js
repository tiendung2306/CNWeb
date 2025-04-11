const Joi = require('joi');

export const createOrder = {
    body: Joi.object({
        userId: Joi.number().required(),
        totalAmount: Joi.number().min(0).required(),//tong tien
        status: Joi.string().valid('Pending', 'Preparing', 'Delivering', 'Completed'),
        orderDate: Joi.date(),
        deliveryAddress: Joi.string().required(),
        orderItems: Joi.array().items(Joi.object({
            menuItemId: Joi.number().required(),
            quantity: Joi.number().min(1).required(),
            price: Joi.number().min(0).required(),
        })).required(),
    }),
};

export const getOrderById = {
    params: Joi.object({
        id: Joi.number().required(),
    }),
};

export const getOrderByUserId = {
    params: Joi.object({
        id: Joi.number().required(),
    }),
};

export const updateOrder = {
    params: Joi.object({
        id: Joi.number().required(),
    }),
    body: Joi.object({
        userId: Joi.number(),
        totalAmount: Joi.number().min(0),
        status: Joi.string().valid('Pending', 'Preparing', 'Delivering', 'Completed'),
        orderDate: Joi.date(),
        deliveryAddress: Joi.string(),
        orderItems: Joi.array().items(Joi.object({
            menuItemId: Joi.number(),
            quantity: Joi.number().min(1),
            price: Joi.number().min(0),
        })),
    }),
};

export const deleteOrder = {
    params: Joi.object({
        id: Joi.number().required(),
    }),
}