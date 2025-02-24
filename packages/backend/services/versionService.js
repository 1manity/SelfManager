const { Version, Project, ProjectUser, Requirement, Defect, User } = require('../database/models');
const { Op } = require('sequelize');

const VersionService = {
    // 检查用户是否有权限操作版本
    async checkPermission(projectId, userId, requireManager = false) {
        const projectUser = await ProjectUser.findOne({
            where: {
                projectId,
                userId,
                ...(requireManager && {
                    role: {
                        [Op.in]: ['creator', 'manager'],
                    },
                }),
            },
        });

        if (!projectUser) {
            throw new Error(requireManager ? '只有项目管理者才能执行此操作' : '没有权限操作此版本');
        }
        return projectUser;
    },

    // 创建版本（需要是项目管理者）
    async createVersion({ projectId, versionNumber, description, releaseDate, status }, userId) {
        // 确认项目存在并检查权限
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('项目未找到');
        }

        await this.checkPermission(projectId, userId, true);

        // 检查版本号在项目中是否唯一
        const existingVersion = await Version.findOne({
            where: { projectId, versionNumber },
        });
        if (existingVersion) {
            throw new Error('版本号在该项目中已存在');
        }

        const version = await Version.create({
            projectId,
            versionNumber,
            description,
            releaseDate,
            status,
        });
        return version;
    },

    // 获取所有版本
    async getAllVersions(userId = null) {
        const options = {
            include: [
                {
                    model: Project,
                    as: 'project',
                    required: true,
                    include: [
                        {
                            model: User,
                            as: 'creator',
                            attributes: ['id', 'username', 'avatar'],
                        },
                        {
                            model: User,
                            as: 'members',
                            through: {
                                attributes: ['role'],
                            },
                        },
                    ],
                },
                {
                    model: Requirement,
                    as: 'requirements',
                    separate: true,
                },
                {
                    model: Defect,
                    as: 'defects',
                    separate: true,
                },
            ],
        };

        // 如果指定了userId，只返回该用户参与的项目的版本
        if (userId) {
            options.include[0].include.push({
                model: ProjectUser,
                as: 'members',
                where: { userId },
                required: true,
            });
        }

        return await Version.findAll(options);
    },

    // 获取单个版本
    async getVersionById(versionId, userId) {
        const version = await Version.findByPk(versionId, {
            include: [
                {
                    model: Project,
                    as: 'project',
                },
                {
                    model: Requirement,
                    as: 'requirements',
                },
                {
                    model: Defect,
                    as: 'defects',
                },
            ],
        });

        if (!version) {
            throw new Error('版本未找到');
        }

        // 检查权限
        await this.checkPermission(version.projectId, userId);

        return version;
    },

    // 获取指定项目的所有版本
    async getVersionsByProjectId(projectId, userId) {
        // 检查权限
        await this.checkPermission(projectId, userId);

        return await Version.findAll({
            where: { projectId },
            include: [
                {
                    model: Requirement,
                    as: 'requirements',
                },
                {
                    model: Defect,
                    as: 'defects',
                },
            ],
        });
    },

    // 更新版本（需要是项目管理者）
    async updateVersion(versionId, updates, userId) {
        const version = await Version.findByPk(versionId);
        if (!version) {
            throw new Error('版本未找到');
        }

        // 检查权限
        await this.checkPermission(version.projectId, userId, true);

        // 如果更新了 versionNumber，需要确保在项目中仍然唯一
        if (updates.versionNumber && updates.versionNumber !== version.versionNumber) {
            const existingVersion = await Version.findOne({
                where: {
                    projectId: version.projectId,
                    versionNumber: updates.versionNumber,
                    id: { [Op.ne]: versionId }, // 排除当前版本
                },
            });
            if (existingVersion) {
                throw new Error('版本号在该项目中已存在');
            }
        }

        await version.update(updates);
        return version;
    },

    // 删除版本（需要是项目管理者）
    async deleteVersion(versionId, userId) {
        const version = await Version.findByPk(versionId);
        if (!version) {
            throw new Error('版本未找到');
        }

        // 检查权限
        await this.checkPermission(version.projectId, userId, true);

        await version.destroy();
    },
};

module.exports = VersionService;
