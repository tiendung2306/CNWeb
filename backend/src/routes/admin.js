import express from 'express';
import * as userController from '../controllers/user/user.controller';
import * as orderController from '../controllers/order/order.controller';
import * as paymentController from '../controllers/payment/payment.controller';
import * as menuItemController from '../controllers/menu/menuitem.controller';

const router = express.Router();

//= ===============================
// Admin routes
//= ===============================
router.get('/allUsers', userController.allUsers);

router.get('/order', orderController.getAllOrders);

router.get('/payment', paymentController.getAllPayments);
//api menu-item
router.post("/menuitems", menuItemController.createMenuItem);
router.put("/menuitems/:id", menuItemController.updateMenuItem); 
router.delete("/menuitems/:id", menuItemController.deleteMenuItem);

module.exports = router;
