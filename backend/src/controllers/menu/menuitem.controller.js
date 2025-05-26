import cloudinary from '../../config/cloudinary.js';
import streamifier from 'streamifier';
import db from '../../models/index.js';

const { MenuItem, Category, MenuItemsCategory } = db;

// Helper để upload buffer lên Cloudinary
async function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'menuItems' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

// CREATE: Tạo món mới, hỗ trợ cả URL cũ hoặc upload file ảnh
export const createMenuItem = async (req, res) => {
  try {
    const { name, price, description, categoryIds, status } = req.body;

    // 1) Kiểm tra các trường bắt buộc
    if (!name || !price) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    // 2) Upload ảnh nếu có file
    let imageUrl = req.body.imageUrl || null;
    if (req.file?.buffer) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // 3) Parse categoryIds nếu là chuỗi JSON
    let parsedCategoryIds = [];
    if (categoryIds) {
      try {
        parsedCategoryIds = typeof categoryIds === 'string' ? JSON.parse(categoryIds) : categoryIds;
        if (!Array.isArray(parsedCategoryIds)) {
          return res.status(400).json({ success: false, message: 'categoryIds must be an array' });
        }
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid categoryIds format' });
      }
    }

    // 4) Kiểm tra tính hợp lệ của categoryIds
    if (parsedCategoryIds.length > 0) {
      const validCategories = await Category.findAll({
        where: { id: parsedCategoryIds },
        attributes: ['id'],
      });
      const validCategoryIds = validCategories.map(cat => cat.id);
      const invalidIds = parsedCategoryIds.filter(id => !validCategoryIds.includes(id));
      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid category IDs: ${invalidIds.join(', ')}`,
        });
      }
    }

    // 5) Tạo món ăn
    const newItem = await MenuItem.create({ name, price, description, imageUrl, status });

    // 6) Gán category nếu có
    if (parsedCategoryIds.length > 0) {
      const mappings = parsedCategoryIds.map(catId => ({
        menuItemId: newItem.id,
        categoryId: catId,
      }));
      await MenuItemsCategory.bulkCreate(mappings);
    }

    // 7) Lấy lại món ăn với categories để trả về
    const result = await MenuItem.findByPk(newItem.id, {
      include: [{ model: Category, through: { attributes: [] }, as: 'categories' }],
    });

    return res.status(201).json({ success: true, data: result });
  } catch (error) {
    console.error('Error creating menu item:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// READ ALL: Lấy danh sách món, kèm category
export const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.findAll({
      include: [
        { model: Category, through: { attributes: [] }, as: 'categories' }
      ]
    });
    return res.status(200).json({ success: true, data: menuItems });
  } catch (error) {
    console.error('Error fetching menu items:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// READ ONE: Lấy thông tin 1 món theo ID
export const getMenuItemById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByPk(id, {
      include: [
        { model: Category, through: { attributes: [] }, as: 'categories' }
      ]
    });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    return res.status(200).json({ success: true, data: item });
  } catch (error) {
    console.error('Error fetching menu item:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// UPDATE: Cập nhật món ăn, bao gồm upload ảnh mới và cập nhật category
export const updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, description, categoryIds, status } = req.body;

    const item = await MenuItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }

    // 1) Upload ảnh mới nếu có
    if (req.file?.buffer) {
      const result = await uploadToCloudinary(req.file.buffer);
      item.imageUrl = result.secure_url;
    }

    // 2) Cập nhật các trường thông tin
    if (name !== undefined) item.name = name;
    if (price !== undefined) item.price = price;
    if (description !== undefined) item.description = description;
    if (status !== undefined) item.status = status;
    await item.save();

    // 3) Parse categoryIds nếu là chuỗi JSON
    let parsedCategoryIds = [];
    if (categoryIds !== undefined) {
      try {
        parsedCategoryIds = typeof categoryIds === 'string' ? JSON.parse(categoryIds) : categoryIds;
        if (!Array.isArray(parsedCategoryIds)) {
          return res.status(400).json({ success: false, message: 'categoryIds must be an array' });
        }
      } catch (error) {
        return res.status(400).json({ success: false, message: 'Invalid categoryIds format' });
      }
    }

    // 4) Kiểm tra tính hợp lệ của categoryIds
    if (parsedCategoryIds.length > 0) {
      const validCategories = await Category.findAll({
        where: { id: parsedCategoryIds },
        attributes: ['id'],
      });
      const validCategoryIds = validCategories.map(cat => cat.id);
      const invalidIds = parsedCategoryIds.filter(id => !validCategoryIds.includes(id));
      if (invalidIds.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid category IDs: ${invalidIds.join(', ')}`,
        });
      }
    }

    // 5) Cập nhật danh mục nếu categoryIds được gửi
    if (categoryIds !== undefined) {
      // Lấy các mapping hiện tại
      const existing = await MenuItemsCategory.findAll({ where: { menuItemId: id } });
      const existIds = existing.map(e => e.categoryId);

      // Xác định thêm/xóa
      const toAdd = parsedCategoryIds.filter(cid => !existIds.includes(cid));
      const toRemove = existIds.filter(cid => !parsedCategoryIds.includes(cid));

      // Thêm mapping mới
      if (toAdd.length > 0) {
        const mappings = toAdd.map(cid => ({
          menuItemId: id,
          categoryId: cid,
        }));
        await MenuItemsCategory.bulkCreate(mappings);
      }

      // Xóa mapping lỗi thời
      if (toRemove.length > 0) {
        await MenuItemsCategory.destroy({ where: { menuItemId: id, categoryId: toRemove } });
      }
    }

    // 6) Lấy lại món ăn với categories để trả về
    const result = await MenuItem.findByPk(id, {
      include: [{ model: Category, through: { attributes: [] }, as: 'categories' }],
    });

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Error updating menu item:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE: Xóa món ăn và các mapping category
export const deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await MenuItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Menu item not found' });
    }
    // Xóa mapping liên quan
    await MenuItemsCategory.destroy({ where: { menuItemId: id } });
    // Xóa món
    await item.destroy();
    return res.status(200).json({ success: true, message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Error deleting menu item:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// RANDOM: Lấy danh sách món ở thứ tự ngẫu nhiên
export const getRandomMenuItems = async (req, res) => {
  try {
    // 1) Lấy tất cả món kèm thông tin category
    const menuItems = await MenuItem.findAll({
      include: [
        { model: Category, through: { attributes: [] }, as: 'categories' }
      ]
    });

    // 2) Xáo trộn mảng bằng Fisher–Yates shuffle
    for (let i = menuItems.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [menuItems[i], menuItems[j]] = [menuItems[j], menuItems[i]];
    }

    // 3) Trả về kết quả
    return res.status(200).json({ success: true, data: menuItems });
  } catch (error) {
    console.error('Error fetching random menu items:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
};