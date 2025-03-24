const express = require('express');
const router = express.Router();
const NotificationService = require('../services/notificationService');
const authMiddleware = require('../middlewares/authMiddleware');
const ApiResponse = require('../utils/ApiResponse');

/**
 * 获取用户通知列表
 * @route GET /api/notifications
 * @query {number} [limit=20] - 每页数量
 * @query {number} [offset=0] - 偏移量
 * @query {boolean} [unreadOnly=false] - 是否只获取未读通知
 * @returns {object} 通知列表和总数
 */
router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const { limit, offset, unreadOnly } = req.query;
        
        const options = {
            limit: limit ? parseInt(limit) : 20,
            offset: offset ? parseInt(offset) : 0,
            unreadOnly: unreadOnly === 'true',
        };
        
        const result = await NotificationService.getUserNotifications(userId, options);
        res.json(ApiResponse.success('获取通知列表成功', result));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 获取未读通知数量
 * @route GET /api/notifications/unread-count
 * @returns {object} 未读通知数量
 */
router.get('/unread-count', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const count = await NotificationService.getUnreadCount(userId);
        res.json(ApiResponse.success('获取未读通知数量成功', { count }));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 标记通知为已读
 * @route PUT /api/notifications/:id/read
 * @param {number} id - 通知ID
 * @returns {object} 更新后的通知
 */
router.put('/:id/read', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const notification = await NotificationService.markAsRead(id, userId);
        res.json(ApiResponse.success('标记通知为已读成功', notification));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 标记所有通知为已读
 * @route PUT /api/notifications/read-all
 * @returns {object} 操作结果
 */
router.put('/read-all', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        const result = await NotificationService.markAllAsRead(userId);
        res.json(ApiResponse.success('标记所有通知为已读成功', result));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

/**
 * 删除通知
 * @route DELETE /api/notifications/:id
 * @param {number} id - 通知ID
 * @returns {object} 操作结果
 */
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;
        
        const result = await NotificationService.deleteNotification(id, userId);
        res.json(ApiResponse.success('删除通知成功', result));
    } catch (error) {
        res.json(ApiResponse.error(error.message));
    }
});

module.exports = router; 