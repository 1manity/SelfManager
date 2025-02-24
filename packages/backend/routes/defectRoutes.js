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
 * @body {string} [body.expectedResult] - 期望结果
 * @body {string} [body.solution] - 解决方案
 * @body {string} body.severity - 严重程度 ('high'|'medium'|'low')
 * @body {string} body.status - 状态 ('open'|'in_progress'|'to_verify'|'resolved'|'closed')
 * @body {number} [body.assigneeId] - 负责人ID
 * @returns {object} 创建的缺陷信息
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const {
            versionId,
            title,
            description,
            stepsToReproduce,
            expectedResult,
            solution,
            severity,
            status,
            assigneeId,
        } = req.body;
        const userId = req.user.id;
        const defect = await DefectService.createDefect(
            {
                versionId,
                title,
                description,
                stepsToReproduce,
                expectedResult,
                solution,
                severity,
                status,
                assigneeId,
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
 * @returns {object[]} 缺陷列表，包含关联的版本和负责人信息
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
 * @returns {object} 缺陷信息，包含关联的版本、负责人和评论信息
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
 * 更新缺陷（需要是项目管理者）
 * @route PUT /api/defects/:id
 * @param {number} id - 缺陷ID
 * @body {object} updates - 更新内容
 * @body {string} [updates.title] - 缺陷标题
 * @body {string} [updates.description] - 缺陷描述
 * @body {string} [updates.stepsToReproduce] - 复现步骤
 * @body {string} [updates.expectedResult] - 期望结果
 * @body {string} [updates.solution] - 解决方案
 * @body {string} [updates.severity] - 严重程度 ('high'|'medium'|'low')
 * @body {string} [updates.status] - 状态 ('open'|'in_progress'|'to_verify'|'resolved'|'closed')
 * @body {number} [updates.assigneeId] - 负责人ID
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

/**
 * 添加缺陷评论
 * @route POST /api/defects/:id/comments
 * @param {number} id - 缺陷ID
 * @body {object} body
 * @body {string} body.content - 评论内容
 * @returns {object} 创建的评论信息
 */
router.post('/:id/comments', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;
    try {
        const comment = await DefectService.addComment(id, userId, content);
        res.json(ApiResponse.success('评论添加成功', comment));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取缺陷评论列表
 * @route GET /api/defects/:id/comments
 * @param {number} id - 缺陷ID
 * @returns {object[]} 评论列表
 */
router.get('/:id/comments', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const comments = await DefectService.getComments(id, userId);
        res.json(ApiResponse.success('获取评论列表成功', comments));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
