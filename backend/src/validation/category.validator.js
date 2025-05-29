import Joi from 'joi';

export const createCategory = {
    body: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().allow('').optional(), // Cho phép description rỗng hoặc không bắt buộc
    }),
};

export const updateCategory = {
    params: Joi.object({
        id: Joi.number().integer().required(),
    }),
    body: Joi.object({
        name: Joi.string().optional(),
        description: Joi.string().allow('').optional(), // Cho phép description rỗng hoặc không bắt buộc
    }),
};