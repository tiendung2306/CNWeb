import express from 'express';
import validate from 'express-validation';

import * as userController from '../controllers/user/user.controller';
import * as userValidator from '../validation/user.validator';
import * as menuItemController from '../controllers/menu/menuitem.controller';
import * as reviewController from '../controllers/review/review.controller';
import * as categoryController from '../controllers/category/category.controller';


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
                   
router.get("/reviews/menuitem/:menuItemId", reviewController.getReviewsByMenuItem);

router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:id", categoryController.getCategoryById);

module.exports = router;
