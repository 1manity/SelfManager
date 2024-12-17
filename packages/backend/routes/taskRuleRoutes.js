// routes/taskRuleRouter.js
const express = require('express');
const TaskRuleService = require('../services/taskRuleService');
const authMiddleware = require('../middlewares/authMiddleware');
const ApiResponse = require('../utils/ApiResponse'); // 引入 ApiResponse 类
const router = express.Router();

// 创建规则任务
router.post('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    const { title, description, frequency, daysOfWeek, timeOfDay } = req.body;

    try {
        const rule = await TaskRuleService.createTaskRule(userId, {
            title,
            description,
            frequency,
            daysOfWeek,
            timeOfDay,
        });
        res.status(200).json(ApiResponse.success('规则任务创建成功', rule));
    } catch (error) {
        res.status(400).json(ApiResponse.error(error.message));
    }
});

// 获取用户所有规则任务
router.get('/', authMiddleware, async (req, res) => {
    const userId = req.user.id;
    try {
        const rules = await TaskRuleService.getUserTaskRules(userId);
        res.json(ApiResponse.success('获取规则任务列表成功', rules));
    } catch (error) {
        res.json(ApiResponse.error('规则任务未找到', error.message));
    }
});

// 获取单个规则任务
router.get('/:id', authMiddleware, checkTaskRulePermission, (req, res) => {
    res.json(ApiResponse.success('获取规则任务成功', req.rule));
});

// 更新规则任务
router.put('/:id', authMiddleware, checkTaskRulePermission, async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedRule = await TaskRuleService.updateTaskRule(id, updates);
        res.json(ApiResponse.success('规则任务更新成功', updatedRule));
    } catch (error) {
        res.json(ApiResponse.error('规则任务未找到', error.message));
    }
});

// 删除规则任务
router.delete('/:id', authMiddleware, async (req, res) => {
    const { id } = req.params;

    try {
        await TaskRuleService.deleteTaskRule(id);
        res.json(ApiResponse.noContent('规则任务删除成功'));
    } catch (error) {
        res.json(ApiResponse.error('规则任务未找到', error.message));
    }
});

module.exports = router;

// 校验规则任务是否属于当前用户的中间件
async function checkTaskRulePermission(req, res, next) {
    const { id } = req.params;
    const userId = req.user.id; // 从 authMiddleware 获取用户 ID

    try {
        const rule = await TaskRuleService.getTaskRuleById(id);
        if (!rule) {
            return res.json(ApiResponse.notFound('规则任务未找到'));
        }
        if (rule.userId !== userId) {
            return res.json(ApiResponse.forbidden('你只能操作你自己的规则任务'));
        }

        // 将规则任务信息传递给下一个中间件
        req.rule = rule;
        next();
    } catch (err) {
        res.json(ApiResponse.error(err.message));
    }
}
