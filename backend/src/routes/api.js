import express from 'express';
import validate from 'express-validation';

import * as userController from '../controllers/user/user.controller';
import * as userValidator from '../validation/user.validator';
import * as orderController from '../controllers/order/order.controller';
import * as orderValidator from '../validation/order.validator';

const router = express.Router();

//= ===============================
// API routes
//= ===============================
router.get('/me', userController.profile);
router.post(
  '/changePassword',
  validate(userValidator.changePassword),
  userController.changePassword,
);
router.route('/order')
  .post(validate(orderValidator.createOrder), orderController.createOrder)
  .get(orderController.getAllOrders);

router.route('/order/:id')
  .get(validate(orderValidator.getOrderById), orderController.getOrderById)
  .put(validate(orderValidator.updateOrder), orderController.updateOrder)
  .delete(validate(orderValidator.deleteOrder), orderController.deleteOrder);

module.exports = router;
