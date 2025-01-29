// routes/projectRoutes.js

const express = require('express');
const ProjectService = require('../services/projectService');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const authAdminMiddleware = require('../middlewares/authAdminMiddleware');
const ApiResponse = require('../utils/ApiResponse');

// 创建项目
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, startDate, status, userIds = [] } = req.body;
        const creatorId = req.user.id; // 假设通过认证中间件获取当前用户
        const project = await ProjectService.createProject({
            name,
            description,
            startDate,
            status,
            creatorId,
            userIds,
        });
        res.json(ApiResponse.success('项目创建成功', project));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取所有项目（仅管理员）
router.get('/', authMiddleware, authAdminMiddleware, async (req, res) => {
    try {
        const projects = await ProjectService.getAllProjects();
        res.json(ApiResponse.success('获取项目列表成功', projects));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取单个项目
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const project = await ProjectService.getProjectById(id);
        res.json(ApiResponse.success('获取项目成功', project));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 更新项目
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    try {
        const project = await ProjectService.updateProject(id, updates);
        res.json(ApiResponse.success('项目更新成功', project));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 删除项目（仅管理员）
router.delete('/:id', authMiddleware, authAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        await ProjectService.deleteProject(id);
        res.json(ApiResponse.noContent('项目删除成功'));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 添加用户到项目（仅管理员）
router.post('/:id/add-user', authMiddleware, authAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const response = await ProjectService.addUserToProject(id, userId);
        res.json(ApiResponse.success(response.message, response.data || null));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 从项目中移除用户（仅管理员）
router.post('/:id/remove-user', authMiddleware, authAdminMiddleware, async (req, res) => {
    const { id } = req.params;
    const { userId } = req.body;
    try {
        const response = await ProjectService.removeUserFromProject(id, userId);
        res.json(ApiResponse.success(response.message, response.data || null));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

// 获取项目的所有用户
router.get('/:id/users', authMiddleware, async (req, res) => {
    const { id } = req.params;
    try {
        const users = await ProjectService.getProjectUsers(id);
        res.json(ApiResponse.success('获取项目用户成功', users));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
