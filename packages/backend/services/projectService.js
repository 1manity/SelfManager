const { Project, User, Version, ProjectUser } = require('../database/models');
const { Op } = require('sequelize');

const ProjectService = {
    // 创建项目
    async createProject({ name, description, startDate, status, creatorId }) {
        const project = await Project.create({
            name,
            description,
            startDate,
            status,
            creatorId,
        });

        // 创建者自动成为项目成员，角色为 creator
        await ProjectUser.create({
            projectId: project.id,
            userId: creatorId,
            role: 'creator',
        });

        return project;
    },

    // 检查用户是否为项目创建者
    async isProjectCreator(projectId, userId) {
        const projectUser = await ProjectUser.findOne({
            where: {
                projectId,
                userId,
                role: 'creator',
            },
        });
        return !!projectUser;
    },

    // 检查用户是否为项目管理者（包括创建者）
    async isProjectManager(projectId, userId) {
        const projectUser = await ProjectUser.findOne({
            where: {
                projectId,
                userId,
                role: {
                    [Op.in]: ['creator', 'manager'],
                },
            },
        });
        return !!projectUser;
    },

    // 检查用户是否为项目成员
    async isProjectMember(projectId, userId) {
        const projectUser = await ProjectUser.findOne({
            where: {
                projectId,
                userId,
            },
        });
        return !!projectUser;
    },

    // 获取所有项目
    async getAllProjects(userId = null) {
        const options = {
            include: [
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'avatar'],
                },
                {
                    model: User,
                    as: 'members',
                    attributes: ['id', 'username', 'avatar'],
                    through: {
                        attributes: ['role'],
                    },
                },
                {
                    model: Version,
                    as: 'versions',
                },
            ],
        };

        // 如果指定了userId，只返回该用户参与的项目
        if (userId) {
            options.include.push({
                model: ProjectUser,
                where: { userId },
                attributes: [],
                required: true,
            });
        }

        return await Project.findAll(options);
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
                    as: 'members',
                    attributes: ['id', 'username', 'avatar'],
                    through: {
                        attributes: ['role'],
                    },
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'avatar'],
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
    async addUserToProject(projectId, userId, role, operatorId) {
        // 检查操作者权限
        const isManager = await this.isProjectManager(projectId, operatorId);
        if (!isManager) {
            throw new Error('没有权限添加项目成员');
        }

        // 如果要设置为管理者，需要检查操作者是否为创建者
        if (role === 'manager') {
            const isCreator = await this.isProjectCreator(projectId, operatorId);
            if (!isCreator) {
                throw new Error('只有项目创建者可以设置项目管理者');
            }
        }

        await ProjectUser.create({
            projectId,
            userId,
            role: role || 'member',
        });

        return { message: '用户已成功添加到项目' };
    },

    // 从项目中移除用户
    async removeUserFromProject(projectId, userId, operatorId) {
        // 检查操作者权限
        const isManager = await this.isProjectManager(projectId, operatorId);
        if (!isManager) {
            throw new Error('没有权限移除项目成员');
        }

        // 不能移除创建者
        const targetUser = await ProjectUser.findOne({
            where: {
                projectId,
                userId,
            },
        });

        if (targetUser.role === 'creator') {
            throw new Error('不能移除项目创建者');
        }

        // 如果要移除的是管理者，需要检查操作者是否为创建者
        if (targetUser.role === 'manager') {
            const isCreator = await this.isProjectCreator(projectId, operatorId);
            if (!isCreator) {
                throw new Error('只有项目创建者可以移除项目管理者');
            }
        }

        await targetUser.destroy();
        return { message: '用户已成功从项目中移除' };
    },

    // 更新项目成员角色
    async updateProjectUserRole(projectId, userId, newRole, operatorId) {
        // 只有创建者可以更改角色
        const isCreator = await this.isProjectCreator(projectId, operatorId);
        if (!isCreator) {
            throw new Error('只有项目创建者可以更改成员角色');
        }

        const projectUser = await ProjectUser.findOne({
            where: {
                projectId,
                userId,
            },
        });

        if (!projectUser) {
            throw new Error('用户不是项目成员');
        }

        if (projectUser.role === 'creator') {
            throw new Error('不能更改创建者的角色');
        }

        await projectUser.update({ role: newRole });
        return { message: '成员角色已更新' };
    },

    // 获取项目的所有用户
    async getProjectUsers(projectId) {
        const project = await Project.findByPk(projectId, {
            include: [
                {
                    model: User,
                    as: 'members',
                    attributes: ['id', 'username', 'avatar'],
                    through: {
                        attributes: ['role'],
                    },
                },
                {
                    model: User,
                    as: 'creator',
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
        });

        if (!project) {
            throw new Error('项目未找到');
        }

        return {
            creator: project.creator,
            members: project.members,
        };
    },
};

module.exports = ProjectService;
