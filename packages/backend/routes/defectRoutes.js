// routes/defectRoutes.js

const express = require('express');
const DefectService = require('../services/defectService');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const ApiResponse = require('../utils/ApiResponse');

/**
 * 创建缺陷（需要是项目成员）
 * @route POST /api/defects
 * @body {object} body
 * @body {number} body.versionId - 版本ID
 * @body {string} body.title - 缺陷标题
 * @body {string} body.description - 缺陷描述
 * @body {string} body.stepsToReproduce - 复现步骤
 * @body {string} body.severity - 严重程度 ('high'|'medium'|'low')
 * @body {string} body.status - 状态 ('open'|'in_progress'|'resolved'|'closed')
 * @returns {object} 创建的缺陷信息
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { versionId, title, description, stepsToReproduce, severity, status } = req.body;
        const userId = req.user.id;
        const defect = await DefectService.createDefect(
            {
                versionId,
                title,
                description,
                stepsToReproduce,
                severity,
                status,
            },
            userId
        );
        res.json(ApiResponse.success('缺陷创建成功', defect));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取所有缺陷（只返回用户参与的项目的缺陷）
 * @route GET /api/defects
 * @returns {object[]} 缺陷列表
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const defects = await DefectService.getAllDefects(userId);
        res.json(ApiResponse.success('获取缺陷列表成功', defects));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取单个缺陷（需要是项目成员）
 * @route GET /api/defects/:id
 * @param {number} id - 缺陷ID
 * @returns {object} 缺陷信息
 */
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const defect = await DefectService.getDefectById(id, userId);
        res.json(ApiResponse.success('获取缺陷成功', defect));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取指定版本的所有缺陷（需要是项目成员）
 * @route GET /api/defects/version/:versionId
 * @param {number} versionId - 版本ID
 * @returns {object[]} 缺陷列表
 */
router.get('/version/:versionId', authMiddleware, async (req, res) => {
    const { versionId } = req.params;
    const userId = req.user.id;
    try {
        const defects = await DefectService.getDefectsByVersionId(versionId, userId);
        res.json(ApiResponse.success('获取版本缺陷成功', defects));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 更新缺陷（需要是项目管理者）
 * @route PUT /api/defects/:id
 * @param {number} id - 缺陷ID
 * @body {object} updates - 更新内容
 * @body {string} [updates.title] - 缺陷标题
 * @body {string} [updates.description] - 缺陷描述
 * @body {string} [updates.stepsToReproduce] - 复现步骤
 * @body {string} [updates.severity] - 严重程度 ('high'|'medium'|'low')
 * @body {string} [updates.status] - 状态 ('open'|'in_progress'|'resolved'|'closed')
 * @returns {object} 更新后的缺陷信息
 */
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;
    try {
        const defect = await DefectService.updateDefect(id, updates, userId);
        res.json(ApiResponse.success('缺陷更新成功', defect));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 删除缺陷（需要是项目管理者）
 * @route DELETE /api/defects/:id
 * @param {number} id - 缺陷ID
 * @returns {null}
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        await DefectService.deleteDefect(id, userId);
        res.json(ApiResponse.noContent('缺陷删除成功'));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
