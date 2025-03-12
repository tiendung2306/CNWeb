
const { MenuItem } = require('../../models');

const findById = async (id) => {
    return MenuItem.findByPk(id);
}

module.exports = {
    findById,
}