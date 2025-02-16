// routes/versionRoutes.js

const express = require('express');
const VersionService = require('../services/versionService');
const ProjectService = require('../services/projectService');
const UserService = require('../services/userService');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const ApiResponse = require('../utils/ApiResponse');

/**
 * 创建版本（需要是项目管理者）
 * @route POST /api/versions
 * @body {object} body
 * @body {number} body.projectId - 项目ID
 * @body {string} body.versionNumber - 版本号
 * @body {string} [body.description] - 版本描述
 * @body {Date} [body.releaseDate] - 发布日期
 * @body {string} body.status - 版本状态 ('planned'|'development'|'released'|'closed')
 * @returns {object} 创建的版本信息
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { projectId, versionNumber, description, releaseDate, status } = req.body;
        const userId = req.user.id;
        const version = await VersionService.createVersion(
            {
                projectId,
                versionNumber,
                description,
                releaseDate,
                status,
            },
            userId
        );
        res.json(ApiResponse.success('版本创建成功', version));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取所有版本（系统管理员可以看所有，普通用户只能看参与的项目的版本）
 * @route GET /api/versions
 * @returns {object[]} 版本列表，包含关联的项目、需求和缺陷信息
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = await UserService.isAdmin(userId);
        const versions = isAdmin ? await VersionService.getAllVersions() : await VersionService.getAllVersions(userId);
        res.json(ApiResponse.success('获取版本列表成功', versions));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取单个版本（需要是项目成员）
 * @route GET /api/versions/:id
 * @param {number} id - 版本ID
 * @returns {object} 版本信息，包含关联的项目、需求和缺陷信息
 */
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const version = await VersionService.getVersionById(id, userId);
        res.json(ApiResponse.success('获取版本成功', version));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取指定项目的所有版本（需要是项目成员）
 * @route GET /api/versions/project/:projectId
 * @param {number} projectId - 项目ID
 * @returns {object[]} 版本列表，包含关联的需求和缺陷信息
 */
router.get('/project/:projectId', authMiddleware, async (req, res) => {
    const { projectId } = req.params;
    const userId = req.user.id;
    try {
        const versions = await VersionService.getVersionsByProjectId(projectId, userId);
        res.json(ApiResponse.success('获取项目版本成功', versions));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 更新版本（需要是项目管理者）
 * @route PUT /api/versions/:id
 * @param {number} id - 版本ID
 * @body {object} updates - 更新内容
 * @body {string} [updates.versionNumber] - 版本号
 * @body {string} [updates.description] - 版本描述
 * @body {Date} [updates.releaseDate] - 发布日期
 * @body {string} [updates.status] - 版本状态 ('planned'|'development'|'released'|'closed')
 * @returns {object} 更新后的版本信息
 */
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;
    try {
        const version = await VersionService.updateVersion(id, updates, userId);
        res.json(ApiResponse.success('版本更新成功', version));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 删除版本（需要是项目管理者）
 * @route DELETE /api/versions/:id
 * @param {number} id - 版本ID
 * @returns {null}
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        await VersionService.deleteVersion(id, userId);
        res.json(ApiResponse.noContent('版本删除成功'));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
