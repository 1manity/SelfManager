const { Project, User } = require('../database/models');

const ProjectUserService = {
    // 添加用户到项目
    async addUserToProject(projectId, userId) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('项目未找到');
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('用户未找到');
        }

        await project.addUser(user);
        return { message: '用户已成功添加到项目' };
    },

    // 从项目中移除用户
    async removeUserFromProject(projectId, userId) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('项目未找到');
        }

        const user = await User.findByPk(userId);
        if (!user) {
            throw new Error('用户未找到');
        }

        await project.removeUser(user);
        return { message: '用户已成功从项目中移除' };
    },

    // 获取项目的所有用户
    async getProjectUsers(projectId) {
        const project = await Project.findByPk(projectId, {
            include: [
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'username', 'nickname', 'avatar'],
                    through: { attributes: [] },
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'nickname', 'avatar'],
                },
            ],
        });

        if (!project) {
            throw new Error('项目未找到');
        }

        return {
            creator: project.creator,
            users: project.users,
        };
    },
};

module.exports = ProjectUserService;
