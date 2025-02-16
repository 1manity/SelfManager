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
    async updateUser(userId, updates, operatorId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('用户未找到');

        // 如果要更新角色
        if (updates.role) {
            const operator = await User.findByPk(operatorId);
            if (!operator) throw new Error('操作者未找到');

            // 只有超级管理员可以设置管理员角色
            if (updates.role === 'admin' && operator.role !== 'super_admin') {
                throw new Error('只有超级管理员可以设置管理员角色');
            }

            // 不能修改超级管理员的角色
            if (user.role === 'super_admin') {
                throw new Error('不能修改超级管理员的角色');
            }
        }

        await user.update(updates);
        return user;
    },

    // 删除用户
    async deleteUser(userId, operatorId) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('用户未找到');

        const operator = await User.findByPk(operatorId);
        if (!operator) throw new Error('操作者未找到');

        // 不能删除超级管理员
        if (user.role === 'super_admin') {
            throw new Error('不能删除超级管理员');
        }

        // 只有管理员和超级管理员可以删除用户
        if (operator.role !== 'super_admin' && operator.role !== 'admin') {
            throw new Error('没有权限删除用户');
        }

        await user.destroy();
    },

    // 验证用户登录
    async verifyUser(username, password) {
        const user = await User.findOne({ where: { username } });
        if (!user) return null;
        const isPasswordValid = await user.checkPassword(password);
        return isPasswordValid ? user : null;
    },

    // 添加新方法：检查用户是否为超级管理员
    async isSuperAdmin(userId) {
        const user = await User.findByPk(userId);
        return user?.role === 'super_admin';
    },

    // 添加新方法：检查用户是否为管理员（包括超级管理员）
    async isAdmin(userId) {
        const user = await User.findByPk(userId);
        return user?.role === 'super_admin' || user?.role === 'admin';
    },
};

module.exports = UserService;
