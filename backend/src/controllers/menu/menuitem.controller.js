
const db = require("../../models");
const MenuItem = db.MenuItem;

module.exports = {
  // CREATE: Tạo món mới
  createMenuItem: async (req, res) => {
    try {
      const { name, price, description, imageUrl, category } = req.body;
      const newMenuItem = await MenuItem.create({
        name,
        price,
        description,
        imageUrl,
        category
      });
      return res.status(201).json({
        success: true,
        data: newMenuItem
      });
    } catch (error) {
      console.error("Error creating menu item:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  },

  // READ ALL: Lấy danh sách tất cả món
  getAllMenuItems: async (req, res) => {
    try {
      const menuItems = await MenuItem.findAll();
      return res.status(200).json({
        success: true,
        data: menuItems
      });
    } catch (error) {
      console.error("Error fetching menu items:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  },

  // READ ONE: Lấy thông tin 1 món theo ID
  getMenuItemById: async (req, res) => {
    try {
      const { id } = req.params;
      const menuItem = await MenuItem.findByPk(id);

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found"
        });
      }

      return res.status(200).json({
        success: true,
        data: menuItem
      });
    } catch (error) {
      console.error("Error fetching menu item:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  },

  // UPDATE: Cập nhật món
  updateMenuItem: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, price, description, imageUrl, category } = req.body;

      const menuItem = await MenuItem.findByPk(id);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found"
        });
      }

      // Cập nhật
      menuItem.name = name || menuItem.name;
      menuItem.price = price || menuItem.price;
      menuItem.description = description || menuItem.description;
      menuItem.imageUrl = imageUrl || menuItem.imageUrl;
      menuItem.category = category || menuItem.category;

      await menuItem.save();

      return res.status(200).json({
        success: true,
        data: menuItem
      });
    } catch (error) {
      console.error("Error updating menu item:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  },

  // DELETE: Xoá món
  deleteMenuItem: async (req, res) => {
    try {
      const { id } = req.params;
      const menuItem = await MenuItem.findByPk(id);

      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found"
        });
      }

      await menuItem.destroy();

      return res.status(200).json({
        success: true,
        message: "Menu item deleted successfully"
      });
    } catch (error) {
      console.error("Error deleting menu item:", error);
      return res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  }
};
