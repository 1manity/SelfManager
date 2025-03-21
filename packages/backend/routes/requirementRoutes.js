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
 * @body {string} body.status - 状态 ('pending'|'in_progress'|'developed'|'testing'|'completed')
 * @body {Date} [body.dueDate] - 截止日期
 * @body {number} [body.assigneeId] - 负责人ID
 * @returns {object} 创建的需求信息
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { versionId, title, description, priority, status, dueDate, assigneeId } = req.body;
        const userId = req.user.id;
        const requirement = await RequirementService.createRequirement(
            {
                versionId,
                title,
                description,
                priority,
                status,
                dueDate,
                assigneeId,
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
 * 更新需求（需要是项目管理者）
 * @route PUT /api/requirements/:id
 * @param {number} id - 需求ID
 * @body {object} updates - 更新内容
 * @body {string} [updates.title] - 需求标题
 * @body {string} [updates.description] - 需求描述
 * @body {string} [updates.priority] - 优先级 ('high'|'medium'|'low')
 * @body {string} [updates.status] - 状态 ('pending'|'in_progress'|'developed'|'testing'|'completed')
 * @body {Date} [updates.dueDate] - 截止日期
 * @body {number} [updates.assigneeId] - 负责人ID
 * @body {number} [updates.progress] - 完成进度(0-100)
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

/**
 * 添加需求评论
 * @route POST /api/requirements/:id/comments
 * @param {number} id - 需求ID
 * @body {object} body
 * @body {string} body.content - 评论内容
 * @returns {object} 创建的评论信息
 */
router.post('/:id/comments', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    try {
        const comment = await RequirementService.addComment(id, userId, content);
        res.json(ApiResponse.success('评论添加成功', comment));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取需求评论列表
 * @route GET /api/requirements/:id/comments
 * @param {number} id - 需求ID
 * @returns {object[]} 评论列表
 */
router.get('/:id/comments', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const comments = await RequirementService.getComments(id, userId);
        res.json(ApiResponse.success('获取评论列表成功', comments));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 删除需求评论
 * @route DELETE /api/requirements/comments/:id
 * @param {number} id - 评论ID
 * @returns {object} 删除结果
 */
router.delete('/comments/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const result = await RequirementService.deleteComment(id, userId);
        res.json(ApiResponse.success('评论删除成功', result));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 指派需求
 * @route PUT /api/requirements/:id/assign
 * @param {number} id - 需求ID
 * @body {object} body
 * @body {number} body.assigneeId - 负责人ID
 * @returns {object} 更新后的需求信息
 */
router.put('/:id/assign', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { assigneeId } = req.body;
    const userId = req.user.id;
    try {
        // 使用现有的 updateRequirement 方法，但只更新 assigneeId
        const requirement = await RequirementService.updateRequirement(id, { assigneeId }, userId);
        res.json(ApiResponse.success('需求指派成功', requirement));
    } catch (error) {
        res.json(ApiResponse.error(error.message + id + assigneeId));
    }
});

module.exports = router;
