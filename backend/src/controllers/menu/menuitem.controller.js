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
    const { name, price, description, categoryIds } = req.body;

    // 1) Upload ảnh nếu có file
    let imageUrl = req.body.imageUrl || null;
    if (req.file?.buffer) {
      const result = await uploadToCloudinary(req.file.buffer);
      imageUrl = result.secure_url;
    }

    // 2) Tạo món ăn
    const newItem = await MenuItem.create({ name, price, description, imageUrl });

    // 3) Gán category nếu có
    if (Array.isArray(categoryIds) && categoryIds.length) {
      const mappings = categoryIds.map(catId => ({
        menuItemId: newItem.id,
        categoryId: catId,
      }));
      await MenuItemsCategory.bulkCreate(mappings);
    }

    return res.status(201).json({ success: true, data: newItem });
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
    const { name, price, description, categoryIds } = req.body;
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
    if (name !== undefined)        item.name        = name;
    if (price !== undefined)       item.price       = price;
    if (description !== undefined) item.description = description;
    await item.save();

    // 3) Cập nhật danh mục nếu client gửi categoryIds
    if (Array.isArray(categoryIds)) {
      // Lấy các mapping hiện tại
      const existing = await MenuItemsCategory.findAll({ where: { menuItemId: id } });
      const existIds = existing.map(e => e.categoryId);
      // Xác định thêm/xóa
      const toAdd    = categoryIds.filter(cid => !existIds.includes(cid));
      const toRemove = existIds.filter(cid => !categoryIds.includes(cid));
      // Thêm mapping mới
      await Promise.all(
        toAdd.map(cid => MenuItemsCategory.create({ menuItemId: id, categoryId: cid }))
      );
      // Xóa mapping lỗi thời
      if (toRemove.length) {
        await MenuItemsCategory.destroy({ where: { menuItemId: id, categoryId: toRemove } });
      }
    }

    return res.status(200).json({ success: true, data: item });
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
