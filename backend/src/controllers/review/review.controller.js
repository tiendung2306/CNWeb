const db = require("../../models");
const Review = db.Review;
const MenuItem = db.MenuItem;
const User = db.User;

// CREATE: Tạo đánh giá cho món ăn
module.exports.createReview = async (req, res) => {
  try {
    const { userId, menuItemId, rating, comment } = req.body;

    // Kiểm tra xem user và món ăn có tồn tại không
    const menuItem = await MenuItem.findByPk(menuItemId);
    const user = await User.findByPk(userId);

    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // Tạo mới review
    const newReview = await Review.create({
      userId,
      menuItemId,
      rating,
      comment
    });

    return res.status(201).json({
      success: true,
      data: newReview
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// READ: Lấy tất cả đánh giá của một món ăn
module.exports.getReviewsByMenuItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const menuItem = await MenuItem.findByPk(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ success: false, message: "Menu item not found" });
    }

    const reviews = await Review.findAll({
      where: { menuItemId },
      include: [
        { model: User, as: "user", attributes: ["id", "username"] }, // Lấy thông tin người dùng
        { model: MenuItem, as: "menuItem", attributes: ["id", "name"] } // Lấy thông tin món ăn
      ]
    });

    return res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// UPDATE: Cập nhật đánh giá
module.exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;

    await review.save();

    return res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

// DELETE: Xoá đánh giá
module.exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Review.findByPk(id);
    if (!review) {
      return res.status(404).json({ success: false, message: "Review not found" });
    }

    await review.destroy();

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting review:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};
