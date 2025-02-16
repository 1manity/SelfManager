const { Requirement, Version, Project, ProjectUser } = require('../database/models');

const RequirementService = {
    // 检查用户是否有权限操作需求（项目成员才能操作）
    async checkPermission(versionId, userId) {
        const version = await Version.findByPk(versionId, {
            include: [
                {
                    model: Project,
                    as: 'project',
                },
            ],
        });
        if (!version) throw new Error('版本未找到');

        const projectUser = await ProjectUser.findOne({
            where: {
                projectId: version.project.id,
                userId,
            },
        });

        if (!projectUser) throw new Error('没有权限操作此需求');
        return version;
    },

    // 创建需求
    async createRequirement({ versionId, title, description, priority, status, dueDate }, userId) {
        // 检查权限
        await this.checkPermission(versionId, userId);

        const requirement = await Requirement.create({
            versionId,
            title,
            description,
            priority,
            status,
            dueDate,
        });
        return requirement;
    },

    // 获取所有需求（需要是项目成员）
    async getAllRequirements(userId) {
        const requirements = await Requirement.findAll({
            include: [
                {
                    model: Version,
                    as: 'version',
                    include: [
                        {
                            model: Project,
                            as: 'project',
                            include: [
                                {
                                    model: ProjectUser,
                                    where: { userId },
                                },
                            ],
                        },
                    ],
                },
            ],
        });
        return requirements;
    },

    // 获取单个需求
    async getRequirementById(requirementId, userId) {
        const requirement = await Requirement.findByPk(requirementId, {
            include: [
                {
                    model: Version,
                    as: 'version',
                    attributes: ['id', 'versionNumber'],
                },
            ],
        });

        if (!requirement) throw new Error('需求未找到');

        // 检查权限
        await this.checkPermission(requirement.versionId, userId);

        return requirement;
    },

    // 获取指定版本的所有需求
    async getRequirementsByVersionId(versionId) {
        const version = await Version.findByPk(versionId);
        if (!version) {
            throw new Error('版本未找到');
        }

        return await Requirement.findAll({
            where: { versionId },
        });
    },

    // 更新需求（需要是项目管理者）
    async updateRequirement(requirementId, updates, userId) {
        const requirement = await Requirement.findByPk(requirementId);
        if (!requirement) throw new Error('需求未找到');

        const version = await Version.findByPk(requirement.versionId, {
            include: [{ model: Project, as: 'project' }],
        });

        // 检查是否为项目管理者
        const projectUser = await ProjectUser.findOne({
            where: {
                projectId: version.project.id,
                userId,
                role: ['creator', 'manager'],
            },
        });

        if (!projectUser) throw new Error('只有项目管理者可以更新需求');

        await requirement.update(updates);
        return requirement;
    },

    // 删除需求（需要是项目管理者）
    async deleteRequirement(requirementId, userId) {
        const requirement = await Requirement.findByPk(requirementId);
        if (!requirement) throw new Error('需求未找到');

        const version = await Version.findByPk(requirement.versionId, {
            include: [{ model: Project, as: 'project' }],
        });

        // 检查是否为项目管理者
        const projectUser = await ProjectUser.findOne({
            where: {
                projectId: version.project.id,
                userId,
                role: ['creator', 'manager'],
            },
        });

        if (!projectUser) throw new Error('只有项目管理者可以删除需求');

        await requirement.destroy();
    },
};

module.exports = RequirementService;
