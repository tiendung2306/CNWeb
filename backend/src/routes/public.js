import express from 'express';
import validate from 'express-validation';

import * as categoryController from '../controllers/category/category.controller';
import * as menuItemController from '../controllers/menu/menuitem.controller';
import * as messageController from '../controllers/message/message.controller';
import * as reviewController from '../controllers/review/review.controller';
import * as userController from '../controllers/user/user.controller';
import * as userValidator from '../validation/user.validator';

const router = express.Router();

//= ===============================
// Public routes
//= ===============================

router.post(
  '/login',
  validate(userValidator.login),
  userController.login,
);
router.post(
  '/register',
  validate(userValidator.register),
  userController.register,
);

router.get("/menuitems", menuItemController.getAllMenuItems);
router.get('/menuitems/random', menuItemController.getRandomMenuItems);
router.get("/menuitems/:id", menuItemController.getMenuItemById);

router.get("/reviews/menuitem/:menuItemId", reviewController.getReviewsByMenuItem);

router.get("/message", messageController.getRecentMessages);

router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);

// Lấy món ăn ngẫu nhiên


module.exports = router;
