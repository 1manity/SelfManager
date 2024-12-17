const { Version, Project, Requirement, Defect } = require('../database/models');

const VersionService = {
    // 创建版本
    async createVersion({ projectId, versionNumber, description, releaseDate, status }) {
        // 确认项目存在
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('项目未找到');
        }

        // 检查版本号在项目中是否唯一
        const existingVersion = await Version.findOne({
            where: { projectId, versionNumber },
        });
        if (existingVersion) {
            throw new Error('版本号在该项目中已存在');
        }

        const version = await Version.create({ projectId, versionNumber, description, releaseDate, status });
        return version;
    },

    // 获取所有版本
    async getAllVersions() {
        return await Version.findAll({
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'name'],
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
    },

    // 获取单个版本
    async getVersionById(versionId) {
        const version = await Version.findByPk(versionId, {
            include: [
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'name'],
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

        return version;
    },

    // 获取指定项目的所有版本
    async getVersionsByProjectId(projectId) {
        const project = await Project.findByPk(projectId);
        if (!project) {
            throw new Error('项目未找到');
        }

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

    // 更新版本
    async updateVersion(versionId, updates) {
        const version = await Version.findByPk(versionId);
        if (!version) {
            throw new Error('版本未找到');
        }

        // 如果更新了 versionNumber，需要确保在项目中仍然唯一
        if (updates.versionNumber && updates.versionNumber !== version.versionNumber) {
            const existingVersion = await Version.findOne({
                where: { projectId: version.projectId, versionNumber: updates.versionNumber },
            });
            if (existingVersion) {
                throw new Error('版本号在该项目中已存在');
            }
        }

        await version.update(updates);
        return version;
    },

    // 删除版本
    async deleteVersion(versionId) {
        const version = await Version.findByPk(versionId);
        if (!version) {
            throw new Error('版本未找到');
        }
        await version.destroy();
    },
};

module.exports = VersionService;
