// services/taskRuleService.js
const { TaskRule, User, Task } = require('../database/models');
const { Op } = require('sequelize');

const TaskRuleService = {
    // 创建规则任务
    async createTaskRule(
        userId,
        { title, description, frequency, daysOfWeek, timeOfDay }
    ) {
        // 检查用户是否存在
        const user = await User.findByPk(userId);
        if (!user) throw new Error('用户未找到');

        // 计算下一个运行时间
        const now = new Date();
        let nextRun;

        if (frequency === 'daily') {
            nextRun = new Date();
            const [hour, minute] = timeOfDay.split(':').map(Number);
            nextRun.setHours(hour, minute, 0, 0);
            if (nextRun < now) {
                nextRun.setDate(nextRun.getDate() + 1);
            }
        } else if (frequency === 'weekly') {
            if (!daysOfWeek || daysOfWeek.length === 0) {
                throw new Error('每周频率需要指定执行的星期几');
            }
            nextRun = new Date();
            const [hour, minute] = timeOfDay.split(':').map(Number);
            nextRun.setHours(hour, minute, 0, 0);

            // 找到下一个符合条件的星期几
            let found = false;
            for (let i = 0; i < 7; i++) {
                const day = (now.getDay() + i) % 7; // 0 = 周日, 6 = 周六
                if (daysOfWeek.includes(day)) {
                    nextRun.setDate(now.getDate() + i);
                    if (nextRun > now) {
                        found = true;
                        break;
                    }
                }
            }
            if (!found) {
                nextRun.setDate(nextRun.getDate() + 7);
            }
        }

        // 创建规则任务
        const taskRule = await TaskRule.create({
            userId,
            title,
            description,
            frequency,
            daysOfWeek: frequency === 'weekly' ? daysOfWeek : null,
            timeOfDay,
            nextRun,
        });

        return taskRule;
    },

    // 获取单个规则任务
    async getTaskRuleById(taskRuleId) {
        const taskRule = await TaskRule.findByPk(taskRuleId);
        if (!taskRule) throw new Error('规则任务未找到');
        return taskRule;
    },

    // 获取指定用户的所有规则任务
    async getUserTaskRules(userId) {
        const user = await User.findByPk(userId, {
            include: [
                {
                    model: TaskRule,
                    as: 'taskRules',
                },
            ],
        });
        if (!user) throw new Error('用户未找到');
        return user.taskRules;
    },

    // 更新规则任务
    async updateTaskRule(taskRuleId, userId, updates) {
        const taskRule = await TaskRule.findOne({
            where: { id: taskRuleId, userId },
        });
        if (!taskRule) throw new Error('规则任务未找到');

        // 如果更新了频率或执行天数，重新计算下一个运行时间
        if (updates.frequency || updates.daysOfWeek || updates.timeOfDay) {
            const frequency = updates.frequency || taskRule.frequency;
            const daysOfWeek = updates.daysOfWeek || taskRule.daysOfWeek;
            const timeOfDay = updates.timeOfDay || taskRule.timeOfDay;

            const now = new Date();
            let nextRun;

            if (frequency === 'daily') {
                nextRun = new Date();
                const [hour, minute] = timeOfDay.split(':').map(Number);
                nextRun.setHours(hour, minute, 0, 0);
                if (nextRun < now) {
                    nextRun.setDate(nextRun.getDate() + 1);
                }
            } else if (frequency === 'weekly') {
                if (!daysOfWeek || daysOfWeek.length === 0) {
                    throw new Error('每周频率需要指定执行的星期几');
                }
                nextRun = new Date();
                const [hour, minute] = timeOfDay.split(':').map(Number);
                nextRun.setHours(hour, minute, 0, 0);

                let found = false;
                for (let i = 0; i < 7; i++) {
                    const day = (now.getDay() + i) % 7;
                    if (daysOfWeek.includes(day)) {
                        nextRun.setDate(now.getDate() + i);
                        if (nextRun > now) {
                            found = true;
                            break;
                        }
                    }
                }
                if (!found) {
                    nextRun.setDate(nextRun.getDate() + 7);
                }
            }

            updates.nextRun = nextRun;
        }

        await taskRule.update(updates);
        return taskRule;
    },

    // 删除规则任务
    async deleteTaskRule(taskRuleId, userId) {
        const taskRule = await TaskRule.findOne({
            where: { id: taskRuleId, userId },
        });
        if (!taskRule) throw new Error('规则任务未找到');
        await taskRule.destroy();
    },

    // 处理规则任务，创建任务并更新 nextRun
    async processRecurringTasks() {
        const now = new Date();
        const tasksToRun = await TaskRule.findAll({
            where: {
                isActive: true,
                nextRun: {
                    [Op.lte]: now,
                },
            },
        });

        for (const rule of tasksToRun) {
            // 创建实际的任务
            await Task.create({
                title: rule.title,
                description: rule.description,
                dueDate: rule.nextRun,
                userId: rule.userId,
            });

            // 计算下一个运行时间
            let nextRun;
            if (rule.frequency === 'daily') {
                nextRun = new Date(rule.nextRun);
                nextRun.setDate(nextRun.getDate() + 1);
            } else if (rule.frequency === 'weekly') {
                if (!rule.daysOfWeek || rule.daysOfWeek.length === 0) {
                    console.error(
                        `RecurringTask ID ${rule.id} 没有指定执行的星期几`
                    );
                    continue;
                }
                const currentDay = rule.nextRun.getDay();
                let nextDay = null;
                for (let i = 1; i <= 7; i++) {
                    const day = (currentDay + i) % 7;
                    if (rule.daysOfWeek.includes(day)) {
                        nextRun = new Date(rule.nextRun);
                        nextRun.setDate(rule.nextRun.getDate() + i);
                        break;
                    }
                }
                if (!nextRun) {
                    // 如果没有找到下一个运行日，默认下周相同时间
                    nextRun = new Date(rule.nextRun);
                    nextRun.setDate(rule.nextRun.getDate() + 7);
                }
            }

            // 更新下一个运行时间
            rule.nextRun = nextRun;
            await rule.save();
        }
    },
};

module.exports = TaskRuleService;
