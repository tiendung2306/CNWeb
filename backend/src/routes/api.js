import express from 'express';
import validate from 'express-validation';

import * as userController from '../controllers/user/user.controller';
import * as userValidator from '../validation/user.validator';
import * as orderController from '../controllers/order/order.controller';
import * as orderValidator from '../validation/order.validator';
import * as paymentController from '../controllers/payment/payment.controller';
import * as paymentValidator from '../validation/payment.validator';
import * as menuItemController from '../controllers/menu/menuitem.controller';
import * as reviewController from '../controllers/review/review.controller';
import { sendInvoice } from "../controllers/order/order.controller";

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
router.patch('/user/:userId', validate(userValidator.updateUserById), userController.updateUserById);

router.route('/order')
  .post(validate(orderValidator.createOrder), orderController.createOrder);

router.route('/order/:id')
  .get(validate(orderValidator.getOrderById), orderController.getOrderById)
  .patch(validate(orderValidator.updateOrder), orderController.updateOrder)
  .delete(validate(orderValidator.deleteOrder), orderController.deleteOrder);

router.route('/order/user/:id')
  .get(validate(orderValidator.getOrderByUserId), orderController.getOrderByUserId);

router.route('/payment')
  .post(validate(paymentValidator.createPayment), paymentController.createPayment);

router.route('/payment/createPaymentVNPAY')
  .post(validate(paymentValidator.createPaymentVNPAY), paymentController.createPaymentVNPAY);

router.route('/payment/:id')
  .get(validate(paymentValidator.getPaymentById), paymentController.getPaymentById)
  .patch(validate(paymentValidator.updatePayment), paymentController.updatePayment)
  .delete(validate(paymentValidator.deletePayment), paymentController.deletePayment);

router.route('/payment/user/:id')
  .get(validate(paymentValidator.getPaymentByUserId), paymentController.getPaymentByUserId);


//api menu-item
router.get("/menuitems", menuItemController.getAllMenuItems);   
router.get("/menuitems/:id", menuItemController.getMenuItemById); 
 

// Route cho Review
router.post("/reviews", reviewController.createReview);                   
router.get("/reviews/menuitem/:menuItemId", reviewController.getReviewsByMenuItem); 
router.put("/reviews/:id", reviewController.updateReview);               
router.delete("/reviews/:id", reviewController.deleteReview);   

// Lấy món ăn ngẫu nhiên
router.get('/menuitems/random', menuItemController.getRandomMenuItems);


// Route gửi hóa đơn
router.post("/orders/:orderId/invoice", sendInvoice);


module.exports = router;
