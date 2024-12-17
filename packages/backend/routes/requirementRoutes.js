// routes/requirementRoutes.js

const express = require('express');
const RequirementService = require('../services/requirementService');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authAdminMiddleware = require('../middlewares/authAdminMiddleware');
const ApiResponse = require('../utils/ApiResponse');

// 创建需求
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { versionId, title, description, priority, status, dueDate } = req.body;
        const requirement = await RequirementService.createRequirement({
            versionId,
            title,
            description,
            priority,
            status,
            dueDate,
        });
        res.json(ApiResponse.success('需求创建成功', requirement));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取所有需求（仅管理员）
router.get('/', authMiddleware, authAdminMiddleware, async (req, res) => {
    try {
        const requirements = await RequirementService.getAllRequirements();
        res.json(ApiResponse.success('获取需求列表成功', requirements));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取单个需求
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const requirement = await RequirementService.getRequirementById(id);
        res.json(ApiResponse.success('获取需求成功', requirement));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取指定版本的所有需求
router.get('/version/:versionId', authMiddleware, async (req, res) => {
    const { versionId } = req.params;
    try {
        const requirements = await RequirementService.getRequirementsByVersionId(versionId);
        res.json(ApiResponse.success('获取版本需求成功', requirements));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 更新需求
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const requirement = await RequirementService.updateRequirement(id, updates);
        res.json(ApiResponse.success('需求更新成功', requirement));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 删除需求（仅管理员）
router.delete('/:id', authMiddleware, authAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await RequirementService.deleteRequirement(id);
        res.json(ApiResponse.noContent('需求删除成功'));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
