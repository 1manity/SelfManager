const { Project, User, Version } = require('../database/models');

const ProjectService = {
    // 创建项目
    async createProject({ name, description, startDate, status, creatorId, userIds = [] }) {
        const project = await Project.create({ name, description, startDate, status, creatorId });

        // 添加创建者到项目参与者列表（如果不自动添加）
        if (!userIds.includes(creatorId)) {
            userIds.push(creatorId);
        }

        // 添加其他用户到项目
        if (userIds.length > 0) {
            const users = await User.findAll({ where: { id: userIds } });
            await project.addUsers(users);
        }

        return project;
    },

    // 获取所有项目
    async getAllProjects() {
        return await Project.findAll({
            include: [
                {
                    model: Version,
                    as: 'versions',
                },
                {
                    model: User,
                    as: 'users',
                    attributes: ['id', 'username', 'nickname', 'avatar'],
                    through: { attributes: [] }, // 不返回关联表的属性
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'nickname', 'avatar'],
                },
            ],
        });
    },

    // 获取单个项目
    async getProjectById(projectId) {
        const project = await Project.findByPk(projectId, {
            include: [
                {
                    model: Version,
                    as: 'versions',
                },
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

        return project;
    },

    // 更新项目
    async updateProject(projectId, updates) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('项目未找到');
        }
        await project.update(updates);
        return project;
    },

    // 删除项目
    async deleteProject(projectId) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('项目未找到');
        }
        await project.destroy();
    },

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

module.exports = ProjectService;
