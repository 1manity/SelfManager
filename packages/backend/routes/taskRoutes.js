const express = require('express');
const TaskService = require('../services/taskService');
const authMiddleware = require('../middlewares/authMiddleware');
const ApiResponse = require('../utils/ApiResponse'); // 引入 ApiResponse 类
const router = express.Router();

// 创建任务
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, dueDate } = req.body;
    const userId = req.user.id; // 从 authMiddleware 获取用户 ID

    try {
        const task = await TaskService.createTask(userId, title, description, dueDate);
        res.status(201).json(ApiResponse.success('任务创建成功', task));
    } catch (err) {
        res.status(400).json(ApiResponse.error(err.message));
    }
});

// 获取用户所有任务
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id; // 从 authMiddleware 获取用户 ID

    try {
        const tasks = await TaskService.getUserTasks(userId);
        res.json(ApiResponse.success('任务获取成功', tasks));
    } catch (err) {
        res.status(400).json(ApiResponse.error(err.message));
    }
});

// 获取单个任务
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // 从 authMiddleware 获取用户 ID

    try {
        const task = await TaskService.getTaskById(id);
        if (!task) return res.status(404).json(ApiResponse.notFound('未找到任务'));

        // 校验任务是否属于当前用户
        if (task.userId !== userId) {
            return res.status(403).json(ApiResponse.forbidden('你只能浏览你自己的任务'));
        }

        res.json(ApiResponse.success('任务获取成功', task));
    } catch (err) {
        res.status(400).json(ApiResponse.error(err.message));
    }
});

// 更新任务
router.put('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id; // 从 authMiddleware 获取用户 ID

    try {
        // 校验任务是否属于当前用户
        const task = await TaskService.getTaskById(id);
        if (!task) return res.status(404).json(ApiResponse.notFound('未找到任务'));

        // 如果任务不属于当前用户，返回 403 错误
        if (task.userId !== userId) {
            return res.status(403).json(ApiResponse.forbidden('你只能浏览你自己的任务'));
        }

        // 执行更新
        const updatedTask = await TaskService.updateTask(id, updates);
        res.json(ApiResponse.success('任务更新成功', updatedTask));
    } catch (err) {
        res.status(400).json(ApiResponse.error(err.message));
    }
});

// 删除任务
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // 从 authMiddleware 获取用户 ID

    try {
        // 校验任务是否属于当前用户
        const task = await TaskService.getTaskById(id);
        if (!task) return res.status(404).json(ApiResponse.notFound('未找到任务'));

        // 如果任务不属于当前用户，返回 403 错误
        if (task.userId !== userId) {
            return res.status(403).json(ApiResponse.forbidden('你只能操作你自己的任务'));
        }

        // 执行删除
        await TaskService.deleteTask(id);
        res.status(204).json(ApiResponse.noContent('任务删除成功'));
    } catch (err) {
        res.status(400).json(ApiResponse.error(err.message));
    }
});

// 更新任务状态
router.patch('/:id/status', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id; // 从 authMiddleware 获取用户 ID

    try {
        // 校验任务是否属于当前用户
        const task = await TaskService.getTaskById(id);
        if (!task) return res.status(404).json(ApiResponse.notFound('未找到任务'));

        // 如果任务不属于当前用户，返回 403 错误
        if (task.userId !== userId) {
            return res.status(403).json(ApiResponse.forbidden('你只能操作你自己的任务'));
        }

        const patchedTask = await TaskService.updateTaskStatus(id, status);
        res.json(ApiResponse.success('更新任务状态成功', patchedTask));
    } catch (err) {
        console.log(err);
        res.status(400).json(ApiResponse.error(err.message));
    }
});

module.exports = router;
