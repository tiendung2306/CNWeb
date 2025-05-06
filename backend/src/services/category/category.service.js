const db = require('../../models');

const createCategory = async (data) => {
    return await db.Category.create(data);
};

const getAllCategories = async () => {
    return await db.Category.findAll({
        include: [{ model: db.MenuItem, as: 'menuItems' }]
    });
};

const getCategoryById = async (id) => {
    return await db.Category.findByPk(id, {
        include: [{ model: db.MenuItem, as: 'menuItems' }]
    });
};

const updateCategoryById = async (id, data) => {
    const category = await db.Category.findByPk(id);
    if (!category) return null;
    await category.update(data);
    return category;
};

const deleteCategoryById = async (id) => {
    const category = await db.Category.findByPk(id);
    if (!category) return null;
    await category.destroy();
    return category;
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
};
