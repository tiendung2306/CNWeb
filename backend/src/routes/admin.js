import express from 'express';
import * as userController from '../controllers/user/user.controller';
import * as orderController from '../controllers/order/order.controller';
import * as paymentController from '../controllers/payment/payment.controller';
import * as menuItemController from '../controllers/menu/menuitem.controller';
import * as userValidator from '../validation/user.validator';
import validate from 'express-validation';
import * as categoryController from '../controllers/category/category.controller';
import * as categoryValidator from '../validation/category.validator';
import * as reviewController from '../controllers/review/review.controller';
import uploadImage from '../middleware/uploadImage.js';
import * as statisticController from '../controllers/statistic/statistic.controller.js';



const router = express.Router();

//= ===============================
// Admin routes
//= ===============================
router.get('/allUsers', userController.allUsers);
router.delete('/user/:userId', validate(userValidator.deleteUserById), userController.deleteUserById);

router.get('/order', orderController.getAllOrders);

router.get('/payment', paymentController.getAllPayments);
//api menu-item
router.post('/menuitems', uploadImage, menuItemController.createMenuItem);
router.put('/menuitems/:id', uploadImage, menuItemController.updateMenuItem);
router.delete("/menuitems/:id", menuItemController.deleteMenuItem);
router.get("/menuitems", menuItemController.getAllMenuItems);   
router.get("/menuitems/:id", menuItemController.getMenuItemById); 

// Route cho Review
router.post("/reviews", reviewController.createReview);                   
router.get("/reviews/menuitem/:menuItemId", reviewController.getReviewsByMenuItem); 
router.put("/reviews/:id", reviewController.updateReview);               
router.delete("/reviews/:id", reviewController.deleteReview); 

// Thống kê đơn hàng, doanh thu, số lượng món theo khoảng thời gian
router.get('/statistics', statisticController.getStatistics);

// Thống kê tổng user & tổng menu items
router.get('/statistics/overview', statisticController.getSystemStats );
  
// Lấy món ăn ngẫu nhiên
router.get('/menuitems/random', menuItemController.getRandomMenuItems);

//api category
router.post("/categories", validate(categoryValidator.createCategory), categoryController.createCategory);
router.patch("/categories/:id", validate(categoryValidator.updateCategory), categoryController.updateCategory);
router.delete("/categories/:id", categoryController.deleteCategory);

module.exports = router;
