import request from '../request';

/**
 * 获取通知列表
 * @param {Object} params - 查询参数
 * @param {number} [params.limit=20] - 每页数量
 * @param {number} [params.offset=0] - 偏移量
 * @param {boolean} [params.unreadOnly=false] - 是否只获取未读通知
 */
export const getNotifications = async (params = {}) => {
    try {
        const response = await request.get('/notifications', { params });
        return response;
    } catch (error) {
        console.error('获取通知失败:', error.message);
        throw error;
    }
};

/**
 * 获取未读通知数量
 */
export const getUnreadCount = async () => {
    try {
        const response = await request.get('/notifications/unread-count');
        return response;
    } catch (error) {
        console.error('获取未读通知数量失败:', error.message);
        throw error;
    }
};

/**
 * 标记通知为已读
 * @param {number} notificationId - 通知ID
 */
export const markAsRead = async (notificationId) => {
    try {
        const response = await request.put(`/notifications/${notificationId}/read`);
        return response;
    } catch (error) {
        console.error('标记通知为已读失败:', error.message);
        throw error;
    }
};

/**
 * 标记所有通知为已读
 */
export const markAllAsRead = async () => {
    try {
        const response = await request.put('/notifications/read-all');
        return response;
    } catch (error) {
        console.error('标记所有通知为已读失败:', error.message);
        throw error;
    }
};

/**
 * 删除通知
 * @param {number} notificationId - 通知ID
 */
export const deleteNotification = async (notificationId) => {
    try {
        const response = await request.delete(`/notifications/${notificationId}`);
        return response;
    } catch (error) {
        console.error('删除通知失败:', error.message);
        throw error;
    }
}; 