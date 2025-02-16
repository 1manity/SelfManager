const { Defect, Version, Project, ProjectUser } = require('../database/models');

const DefectService = {
    // 检查用户是否有权限操作缺陷（项目成员才能操作）
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

        if (!projectUser) throw new Error('没有权限操作此缺陷');
        return version;
    },

    // 创建缺陷
    async createDefect({ versionId, title, description, stepsToReproduce, severity, status }, userId) {
        // 检查权限
        await this.checkPermission(versionId, userId);

        const defect = await Defect.create({
            versionId,
            title,
            description,
            stepsToReproduce,
            severity,
            status,
        });
        return defect;
    },

    // 获取所有缺陷（需要是项目成员）
    async getAllDefects(userId) {
        const defects = await Defect.findAll({
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
        return defects;
    },

    // 获取单个缺陷
    async getDefectById(defectId, userId) {
        const defect = await Defect.findByPk(defectId, {
            include: [
                {
                    model: Version,
                    as: 'version',
                    attributes: ['id', 'versionNumber'],
                },
            ],
        });

        if (!defect) throw new Error('缺陷未找到');

        // 检查权限
        await this.checkPermission(defect.versionId, userId);

        return defect;
    },

    // 获取指定版本的所有缺陷
    async getDefectsByVersionId(versionId) {
        const version = await Version.findByPk(versionId);
        if (!version) {
            throw new Error('版本未找到');
        }

        return await Defect.findAll({
            where: { versionId },
        });
    },

    // 更新缺陷（需要是项目管理者）
    async updateDefect(defectId, updates, userId) {
        const defect = await Defect.findByPk(defectId);
        if (!defect) throw new Error('缺陷未找到');

        const version = await Version.findByPk(defect.versionId, {
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

        if (!projectUser) throw new Error('只有项目管理者可以更新缺陷');

        await defect.update(updates);
        return defect;
    },

    // 删除缺陷（需要是项目管理者）
    async deleteDefect(defectId, userId) {
        const defect = await Defect.findByPk(defectId);
        if (!defect) throw new Error('缺陷未找到');

        const version = await Version.findByPk(defect.versionId, {
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

        if (!projectUser) throw new Error('只有项目管理者可以删除缺陷');

        await defect.destroy();
    },
};

module.exports = DefectService;
