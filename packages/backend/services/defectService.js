const { Defect, Version } = require('../database/models');

const DefectService = {
    // 创建缺陷
    async createDefect({ versionId, title, description, stepsToReproduce, severity, status }) {
        // 确认版本存在
        const version = await Version.findByPk(versionId);
        if (!version) {
            throw new Error('版本未找到');
        }

        const defect = await Defect.create({ versionId, title, description, stepsToReproduce, severity, status });
        return defect;
    },

    // 获取所有缺陷
    async getAllDefects() {
        return await Defect.findAll({
            include: [
                {
                    model: Version,
                    as: 'version',
                    attributes: ['id', 'versionNumber'],
                },
            ],
        });
    },

    // 获取单个缺陷
    async getDefectById(defectId) {
        const defect = await Defect.findByPk(defectId, {
            include: [
                {
                    model: Version,
                    as: 'version',
                    attributes: ['id', 'versionNumber'],
                },
            ],
        });

        if (!defect) {
            throw new Error('缺陷未找到');
        }

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

    // 更新缺陷
    async updateDefect(defectId, updates) {
        const defect = await Defect.findByPk(defectId);
        if (!defect) {
            throw new Error('缺陷未找到');
        }

        await defect.update(updates);
        return defect;
    },

    // 删除缺陷
    async deleteDefect(defectId) {
        const defect = await Defect.findByPk(defectId);
        if (!defect) {
            throw new Error('缺陷未找到');
        }

        await defect.destroy();
    },
};

module.exports = DefectService;
