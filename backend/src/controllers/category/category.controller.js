const categoryService = require('../../services/category/category.service');
const { createdResponse, errorResponse, notFoundResponse, successResponse } = require('../../helpers');

// Create a new category
const createCategory = async (req, res) => {
    try {
        const category = await categoryService.createCategory(req.body);
        return createdResponse(req, res, category);
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Get all categories
const getAllCategories = async (req, res) => {
    try {
        const categories = await categoryService.getAllCategories();
        return successResponse(req, res, { categories });
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Get category by ID
const getCategoryById = async (req, res) => {
    try {
        const category = await categoryService.getCategoryById(req.params.id);
        if (category) {
            return successResponse(req, res, category);
        } else {
            return notFoundResponse(req, res, 'Category not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Update category by ID
const updateCategory = async (req, res) => {
    try {
        const updatedCategory = await categoryService.updateCategoryById(req.params.id, req.body);
        if (updatedCategory) {
            return successResponse(req, res, updatedCategory);
        } else {
            return notFoundResponse(req, res, 'Category not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

// Delete category by ID
const deleteCategory = async (req, res) => {
    try {
        const deletedCategory = await categoryService.deleteCategoryById(req.params.id);
        if (deletedCategory) {
            return successResponse(req, res, { message: 'Category deleted successfully' });
        } else {
            return notFoundResponse(req, res, 'Category not found');
        }
    } catch (error) {
        return errorResponse(req, res, error.message);
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
};
