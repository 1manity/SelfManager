// routes/defectRoutes.js

const express = require('express');
const DefectService = require('../services/defectService');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authAdminMiddleware = require('../middlewares/authAdminMiddleware');
const ApiResponse = require('../utils/ApiResponse');

// 创建缺陷
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { versionId, title, description, stepsToReproduce, severity, status } = req.body;
        const defect = await DefectService.createDefect({
            versionId,
            title,
            description,
            stepsToReproduce,
            severity,
            status,
        });
        res.json(ApiResponse.success('缺陷创建成功', defect));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取所有缺陷（仅管理员）
router.get('/', authMiddleware, authAdminMiddleware, async (req, res) => {
    try {
        const defects = await DefectService.getAllDefects();
        res.json(ApiResponse.success('获取缺陷列表成功', defects));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取单个缺陷
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const defect = await DefectService.getDefectById(id);
        res.json(ApiResponse.success('获取缺陷成功', defect));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取指定版本的所有缺陷
router.get('/version/:versionId', authMiddleware, async (req, res) => {
    const { versionId } = req.params;
    try {
        const defects = await DefectService.getDefectsByVersionId(versionId);
        res.json(ApiResponse.success('获取版本缺陷成功', defects));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 更新缺陷
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const defect = await DefectService.updateDefect(id, updates);
        res.json(ApiResponse.success('缺陷更新成功', defect));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 删除缺陷（仅管理员）
router.delete('/:id', authMiddleware, authAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await DefectService.deleteDefect(id);
        res.json(ApiResponse.noContent('缺陷删除成功'));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
