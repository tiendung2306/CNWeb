const { Message, User } = require('../../models');

// API to fetch the last n messages
exports.getRecentMessages = async (req, res) => {
    try {
        const n = parseInt(req.query.n, 10) || 20; // Default to 20 messages if n is not provided
        const messages = await Message.findAll({
            limit: n,
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'email', 'role'],
                },
            ],
        });
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};