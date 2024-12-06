const { User } = require('../database/models');

const UserService = {
    // 创建用户
    async createUser(username, password, avatar = null, nickname = null, bio = null) {
        const user = await User.create({ username, password, avatar, nickname, bio });
        return user;
    },
    // 获取用户
    async getUserById(userId) {
        return await User.findByPk(userId);
    },

    // 获取所有用户
    async getAllUsers() {
        return await User.findAll();
    },

    // 更新用户
    async updateUser(userId, updates) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');
        await user.update(updates);
        return user;
    },

    // 删除用户
    async deleteUser(userId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');
        await user.destroy();
    },

    // 验证用户登录
    async verifyUser(username, password) {
        const user = await User.findOne({ where: { username } });
        if (!user) return null;
        const isPasswordValid = await user.checkPassword(password);
        return isPasswordValid ? user : null;
    },
};

module.exports = UserService;
