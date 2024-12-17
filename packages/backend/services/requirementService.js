const { Requirement, Version } = require('../database/models');

const RequirementService = {
    // 创建需求
    async createRequirement({ versionId, title, description, priority, status, dueDate }) {
        // 确认版本存在
        const version = await Version.findByPk(versionId);
        if (!version) {
            throw new Error('版本未找到');
        }

        const requirement = await Requirement.create({ versionId, title, description, priority, status, dueDate });
        return requirement;
    },

    // 获取所有需求
    async getAllRequirements() {
        return await Requirement.findAll({
            include: [
                {
                    model: Version,
                    as: 'version',
                    attributes: ['id', 'versionNumber'],
                },
            ],
        });
    },

    // 获取单个需求
    async getRequirementById(requirementId) {
        const requirement = await Requirement.findByPk(requirementId, {
            include: [
                {
                    model: Version,
                    as: 'version',
                    attributes: ['id', 'versionNumber'],
                },
            ],
        });

        if (!requirement) {
            throw new Error('需求未找到');
        }

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

    // 更新需求
    async updateRequirement(requirementId, updates) {
        const requirement = await Requirement.findByPk(requirementId);
        if (!requirement) {
            throw new Error('需求未找到');
        }

        await requirement.update(updates);
        return requirement;
    },

    // 删除需求
    async deleteRequirement(requirementId) {
        const requirement = await Requirement.findByPk(requirementId);
        if (!requirement) {
            throw new Error('需求未找到');
        }

        await requirement.destroy();
    },
};

module.exports = RequirementService;
