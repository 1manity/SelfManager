// routes/versionRoutes.js

const express = require('express');
const VersionService = require('../services/versionService');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authAdminMiddleware = require('../middlewares/authAdminMiddleware');
const ApiResponse = require('../utils/ApiResponse');

// 创建版本
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { projectId, versionNumber, description, releaseDate, status } = req.body;
        const version = await VersionService.createVersion({
            projectId,
            versionNumber,
            description,
            releaseDate,
            status,
        });
        res.json(ApiResponse.success('版本创建成功', version));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取所有版本（仅管理员）
router.get('/', authMiddleware, authAdminMiddleware, async (req, res) => {
    try {
        const versions = await VersionService.getAllVersions();
        res.json(ApiResponse.success('获取版本列表成功', versions));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取单个版本
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const version = await VersionService.getVersionById(id);
        res.json(ApiResponse.success('获取版本成功', version));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取指定项目的所有版本
router.get('/project/:projectId', authMiddleware, async (req, res) => {
    const { projectId } = req.params;
    try {
        const versions = await VersionService.getVersionsByProjectId(projectId);
        res.json(ApiResponse.success('获取项目版本成功', versions));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 更新版本
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const version = await VersionService.updateVersion(id, updates);
        res.json(ApiResponse.success('版本更新成功', version));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 删除版本（仅管理员）
router.delete('/:id', authMiddleware, authAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await VersionService.deleteVersion(id);
        res.json(ApiResponse.noContent('版本删除成功'));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
