import express from 'express';
import * as userController from '../controllers/user/user.controller';
import * as orderController from '../controllers/order/order.controller';
import * as paymentController from '../controllers/payment/payment.controller';

const router = express.Router();

//= ===============================
// Admin routes
//= ===============================
router.get('/allUsers', userController.allUsers);

router.get('/order', orderController.getAllOrders);

router.get('/payment', paymentController.getAllPayments);

module.exports = router;
