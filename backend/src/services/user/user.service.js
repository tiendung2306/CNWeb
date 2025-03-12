const {User} = require('../../models');
export const findById = async (id) => {
    return User.findByPk(id);
}