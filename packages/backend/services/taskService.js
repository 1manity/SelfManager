const { Task, User } = require('../database/models');

const TaskService = {
    // 创建任务
    async createTask(userId, title, description, dueDate) {
        const user = await User.findByPk(userId);
        if (!user) throw new Error('User not found');

        const task = await Task.create({
            title,
            description,
            dueDate,
            userId, // 关联用户
        });
        return task;
    },

    // 获取任务
    async getTaskById(taskId) {
        const task = await Task.findByPk(taskId);
        if (!task) throw new Error('Task not found');
        return task;
    },

    // 获取指定用户的所有任务
    async getUserTasks(userId) {
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: Task,
                    as: 'tasks',
                },
            ], // 关联查询任务
        });
        if (!user) throw new Error('User not found');
        return user.tasks; // 返回该用户的任务列表
    },

    // 更新任务
    async updateTask(taskId, updates) {
        const task = await Task.findByPk(taskId);
        if (!task) throw new Error('Task not found');
        await task.update(updates);
        return task;
    },

    // 删除任务
    async deleteTask(taskId) {
        const task = await Task.findByPk(taskId);
        if (!task) throw new Error('Task not found');
        await task.destroy();
    },

    // 更新任务状态
    async updateTaskStatus(taskId, status) {
        const task = await Task.findByPk(taskId);
        if (!task) throw new Error('Task not found');
        task.status = status;

        if (status === 'completed') {
            task.completedAt = new Date(); // 当前时间
        } else {
            task.completedAt = null; // 如果任务状态不是 completed，清空 completedAt
        }

        await task.save();
        return task;
    },
};

module.exports = TaskService;
