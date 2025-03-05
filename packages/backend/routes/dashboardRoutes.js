const express = require('express');
const router = express.Router();
const DashboardService = require('../services/dashboardService');
const authMiddleware = require('../middlewares/authMiddleware');
const ApiResponse = require('../utils/ApiResponse');

/**
 * 获取用户仪表盘数据
 * @route GET /api/dashboard
 * @returns {object} 包含项目统计、需求统计、缺陷统计、最近项目和待处理任务
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const dashboardData = await DashboardService.getUserDashboard(userId);
        res.json(ApiResponse.success('获取仪表盘数据成功', dashboardData));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router;
