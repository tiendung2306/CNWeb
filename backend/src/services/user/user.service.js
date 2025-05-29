const {User} = require('../../models');
export const findById = async (id) => {
    return User.findByPk(id);
}

export const updateUserById = async (req, res) => {
    const {username} = req.body;
    const userId = req.params.userId;
    const user = await findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    const currentUser = req.user;
    if(currentUser.role !== 'admin' && currentUser.id !== userId) {
        throw new Error('You are not authorized to update this user');
    }

    await user.update({username});
    return user;
}

export const deleteUserById = async (req, res) => {
    const userId = req.params.userId;
    const user = await findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    await user.destroy();
    return user;
}