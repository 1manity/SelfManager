const express = require('express');
const TaskService = require('../services/taskService');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

// 创建任务
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, dueDate } = req.body;
    const userId = req.user.id; // 从 authMiddleware 获取用户 ID

    try {
        const task = await TaskService.createTask(userId, title, description, dueDate);
        res.status(201).json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 获取用户所有任务
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id; // 从 authMiddleware 获取用户 ID

    try {
        const tasks = await TaskService.getUserTasks(userId);
        res.json(tasks);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// 获取单个任务
router.get('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // 从 authMiddleware 获取用户 ID

    try {
        const task = await TaskService.getTaskById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // 校验任务是否属于当前用户
        if (task.userId !== userId) {
            return res.status(403).json({ error: 'You can only view your own tasks' });
        }

        res.json(task);
    } catch (error) {
        res.status(400).json({ error: error.message });
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
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // 如果任务不属于当前用户，返回 403 错误
        if (task.userId !== userId) {
            return res.status(403).json({ error: 'You can only update your own tasks' });
        }

        // 执行更新
        const updatedTask = await TaskService.updateTask(id, updates);
        res.json(updatedTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// 删除任务
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; // 从 authMiddleware 获取用户 ID

    try {
        // 校验任务是否属于当前用户
        const task = await TaskService.getTaskById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // 如果任务不属于当前用户，返回 403 错误
        if (task.userId !== userId) {
            return res.status(403).json({ error: 'You can only delete your own tasks' });
        }

        // 执行删除
        await TaskService.deleteTask(id);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// 更新任务状态
router.patch('/:id/status', authMiddleware, async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        // 校验任务是否属于当前用户
        const task = await TaskService.getTaskById(id);
        if (!task) return res.status(404).json({ error: 'Task not found' });

        // 如果任务不属于当前用户，返回 403 错误
        if (task.userId !== userId) {
            return res.status(403).json({ error: 'You can only delete your own tasks' });
        }
        const patchedTask = await TaskService.updateTaskStatus(id, status);
        res.json(patchedTask);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
