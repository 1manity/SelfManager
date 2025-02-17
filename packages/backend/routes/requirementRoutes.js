// routes/requirementRoutes.js

const express = require('express');
const RequirementService = require('../services/requirementService');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const ApiResponse = require('../utils/ApiResponse');

/**
 * 创建需求（需要是项目成员）
 * @route POST /api/requirements
 * @body {object} body
 * @body {number} body.versionId - 版本ID
 * @body {string} body.title - 需求标题
 * @body {string} [body.description] - 需求描述
 * @body {string} body.priority - 优先级 ('high'|'medium'|'low')
 * @body {string} body.status - 状态 ('pending'|'in_progress'|'completed')
 * @body {Date} [body.dueDate] - 截止日期
 * @returns {object} 创建的需求信息
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { versionId, title, description, priority, status, dueDate } = req.body;
        const userId = req.user.id;
        const requirement = await RequirementService.createRequirement(
            {
                versionId,
                title,
                description,
                priority,
                status,
                dueDate,
            },
            userId
        );
        res.json(ApiResponse.success('需求创建成功', requirement));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取所有需求（只返回用户参与的项目的需求）
 * @route GET /api/requirements
 * @returns {object[]} 需求列表，包含关联的版本信息
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const requirements = await RequirementService.getAllRequirements(userId);
        res.json(ApiResponse.success('获取需求列表成功', requirements));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取单个需求（需要是项目成员）
 * @route GET /api/requirements/:id
 * @param {number} id - 需求ID
 * @returns {object} 需求信息，包含关联的版本信息
 */
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const requirement = await RequirementService.getRequirementById(id, userId);
        res.json(ApiResponse.success('获取需求成功', requirement));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取指定版本的所有需求（需要是项目成员）
 * @route GET /api/requirements/version/:versionId
 * @param {number} versionId - 版本ID
 * @returns {object[]} 需求列表
 */
router.get('/version/:versionId', authMiddleware, async (req, res) => {
    const { versionId } = req.params;
    const userId = req.user.id;
    try {
        const requirements = await RequirementService.getRequirementsByVersionId(versionId, userId);
        res.json(ApiResponse.success('获取版本需求成功', requirements));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 更新需求（需要是项目管理者）
 * @route PUT /api/requirements/:id
 * @param {number} id - 需求ID
 * @body {object} updates - 更新内容
 * @body {string} [updates.title] - 需求标题
 * @body {string} [updates.description] - 需求描述
 * @body {string} [updates.priority] - 优先级 ('high'|'medium'|'low')
 * @body {string} [updates.status] - 状态 ('pending'|'in_progress'|'completed')
 * @body {Date} [updates.dueDate] - 截止日期
 * @returns {object} 更新后的需求信息
 */
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;
    try {
        const requirement = await RequirementService.updateRequirement(id, updates, userId);
        res.json(ApiResponse.success('需求更新成功', requirement));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 删除需求（需要是项目管理者）
 * @route DELETE /api/requirements/:id
 * @param {number} id - 需求ID
 * @returns {null}
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        await RequirementService.deleteRequirement(id, userId);
        res.json(ApiResponse.noContent('需求删除成功'));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
