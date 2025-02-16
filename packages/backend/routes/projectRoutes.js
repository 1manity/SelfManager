// routes/projectRoutes.js

const express = require('express');
const ProjectService = require('../services/projectService');
const UserService = require('../services/userService');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const ApiResponse = require('../utils/ApiResponse');

/**
 * 创建项目
 * @route POST /api/projects
 * @body {object} body
 * @body {string} body.name - 项目名称
 * @body {string} [body.description] - 项目描述
 * @body {Date} body.startDate - 项目开始日期
 * @body {string} body.status - 项目状态 ('planning'|'in_progress'|'completed')
 * @returns {object} 创建的项目信息
 */
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, startDate, status } = req.body;
        const creatorId = req.user.id;
        const project = await ProjectService.createProject({
            name,
            description,
            startDate,
            status,
            creatorId,
        });
        res.json(ApiResponse.success('项目创建成功', project));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取所有项目（系统管理员可以看所有，普通用户只能看参与的）
 * @route GET /api/projects
 * @returns {object[]} 项目列表，包含关联的版本和用户信息
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const isAdmin = await UserService.isAdmin(userId);
        const projects = isAdmin ? await ProjectService.getAllProjects() : await ProjectService.getAllProjects(userId);
        res.json(ApiResponse.success('获取项目列表成功', projects));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取单个项目（需要是项目成员）
 * @route GET /api/projects/:id
 * @param {number} id - 项目ID
 * @returns {object} 项目信息，包含关联的版本和用户信息
 */
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const isMember = await ProjectService.isProjectMember(id, userId);
        const isAdmin = await UserService.isAdmin(userId);
        if (!isMember && !isAdmin) {
            return res.json(ApiResponse.forbidden('没有权限访问此项目'));
        }
        const project = await ProjectService.getProjectById(id);
        res.json(ApiResponse.success('获取项目成功', project));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 更新项目（需要是项目管理者）
 * @route PUT /api/projects/:id
 * @param {number} id - 项目ID
 * @body {object} updates - 更新内容
 * @body {string} [updates.name] - 项目名称
 * @body {string} [updates.description] - 项目描述
 * @body {Date} [updates.startDate] - 项目开始日期
 * @body {string} [updates.status] - 项目状态 ('planning'|'in_progress'|'completed')
 * @returns {object} 更新后的项目信息
 */
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id;
    try {
        const isManager = await ProjectService.isProjectManager(id, userId);
        if (!isManager) {
            return res.json(ApiResponse.forbidden('只有项目管理者才能更新项目'));
        }
        const project = await ProjectService.updateProject(id, updates);
        res.json(ApiResponse.success('项目更新成功', project));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 删除项目（需要是项目创建者或系统管理员）
 * @route DELETE /api/projects/:id
 * @param {number} id - 项目ID
 * @returns {null}
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const isCreator = await ProjectService.isProjectCreator(id, userId);
        const isAdmin = await UserService.isAdmin(userId);
        if (!isCreator && !isAdmin) {
            return res.json(ApiResponse.forbidden('只有项目创建者或系统管理员才能删除项目'));
        }
        await ProjectService.deleteProject(id);
        res.json(ApiResponse.noContent('项目删除成功'));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 添加用户到项目（需要是项目管理者）
 * @route POST /api/projects/:id/users
 * @param {number} id - 项目ID
 * @body {object} body
 * @body {number} body.userId - 要添加的用户ID
 * @body {string} [body.role='member'] - 用户角色 ('manager'|'member')
 * @returns {object} 操作结果信息
 */
router.post('/:id/users', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { userId, role = 'member' } = req.body;
    const operatorId = req.user.id;
    try {
        const response = await ProjectService.addUserToProject(id, userId, role, operatorId);
        res.json(ApiResponse.success(response.message, response.data || null));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 从项目中移除用户（需要是项目管理者）
 * @route DELETE /api/projects/:id/users/:userId
 * @param {number} id - 项目ID
 * @param {number} userId - 要移除的用户ID
 * @returns {object} 操作结果信息
 */
router.delete('/:id/users/:userId', authMiddleware, async (req, res) => {
    const { id, userId } = req.params;
    const operatorId = req.user.id;
    try {
        const response = await ProjectService.removeUserFromProject(id, userId, operatorId);
        res.json(ApiResponse.success(response.message, response.data || null));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 更新项目成员角色（需要是项目创建者）
 * @route PUT /api/projects/:id/users/:userId/role
 * @param {number} id - 项目ID
 * @param {number} userId - 要更新角色的用户ID
 * @body {object} body
 * @body {string} body.role - 新角色 ('manager'|'member')
 * @returns {object} 操作结果信息
 */
router.put('/:id/users/:userId/role', authMiddleware, async (req, res) => {
    const { id, userId } = req.params;
    const { role } = req.body;
    const operatorId = req.user.id;
    try {
        const response = await ProjectService.updateProjectUserRole(id, userId, role, operatorId);
        res.json(ApiResponse.success(response.message, response.data || null));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取项目的所有用户（需要是项目成员）
 * @route GET /api/projects/:id/users
 * @param {number} id - 项目ID
 * @returns {object} 项目用户信息，包含创建者和成员列表
 */
router.get('/:id/users', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const isMember = await ProjectService.isProjectMember(id, userId);
        if (!isMember) {
            return res.json(ApiResponse.forbidden('没有权限查看项目成员'));
        }
        const users = await ProjectService.getProjectUsers(id);
        res.json(ApiResponse.success('获取项目用户成功', users));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
