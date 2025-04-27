const db = require("../../models");
const MenuItem = db.MenuItem;
const MenuItemsCategory = db.MenuItemsCategory; // Import the MenuItemsCategory model

module.exports = {
  // CREATE: Tạo món mới
  createMenuItem: async (req, res) => {
    try {
      const { name, price, description, imageUrl, categoryIds } = req.body;

      // Validate categoryIds if provided
      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        const validCategories = await db.Category.findAll({
          where: { id: categoryIds }
        });

        if (validCategories.length !== categoryIds.length) {
          return res.status(400).json({
            success: false,
            message: "Some category IDs are invalid"
          });
        }
      }

      // Create a new menu item
      const newMenuItem = await MenuItem.create({
        name,
        price,
        description,
        imageUrl
      });

      // Create menuitemscategory entries
      if (Array.isArray(categoryIds) && categoryIds.length > 0) {
        const menuItemsCategories = categoryIds.map(categoryId => ({
          menuItemId: newMenuItem.id,
          categoryId
        }));
        await MenuItemsCategory.bulkCreate(menuItemsCategories);
      }

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
      const menuItems = await MenuItem.findAll({
        include: [
          {
            model: db.Category,
            through: { attributes: [] }, // Exclude join table attributes
            as: "categories"
          }
        ]
      });
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
      const menuItem = await MenuItem.findByPk(id, {
        include: [
          {
            model: db.Category,
            through: { attributes: [] }, // Exclude join table attributes
            as: "categories"
          }
        ]
      });

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
      const { name, price, description, imageUrl, categoryIds } = req.body;

      const menuItem = await MenuItem.findByPk(id);
      if (!menuItem) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found"
        });
      }

      // Update menu item fields
      menuItem.name = name || menuItem.name;
      menuItem.price = price || menuItem.price;
      menuItem.description = description || menuItem.description;
      menuItem.imageUrl = imageUrl || menuItem.imageUrl;

      await menuItem.save();

      // Handle categoryIds if provided
      if (Array.isArray(categoryIds)) {
        // Validate all categoryIds
        const validCategories = await db.Category.findAll({
          where: { id: categoryIds }
        });

        if (validCategories.length !== categoryIds.length) {
          return res.status(400).json({
            success: false,
            message: "Some category IDs are invalid"
          });
        }

        // Get current categories for the menu item
        const currentCategories = await MenuItemsCategory.findAll({
          where: { menuItemId: id }
        });

        const currentCategoryIds = currentCategories.map(cat => cat.categoryId);

        // Determine categories to add and remove
        const categoriesToAdd = categoryIds.filter(catId => !currentCategoryIds.includes(catId));
        const categoriesToRemove = currentCategoryIds.filter(catId => !categoryIds.includes(catId));

        // Add new categories
        for (const categoryId of categoriesToAdd) {
          await MenuItemsCategory.create({
            menuItemId: id,
            categoryId
          });
        }

        // Remove outdated categories
        await MenuItemsCategory.destroy({
          where: {
            menuItemId: id,
            categoryId: categoriesToRemove
          }
        });
      }

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

      // Delete related entries in MenuItemsCategory
      await MenuItemsCategory.destroy({
        where: { menuItemId: id }
      });

      // Delete the menu item
      await menuItem.destroy();

      return res.status(200).json({
        success: true,
        message: "Menu item and related categories deleted successfully"
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
