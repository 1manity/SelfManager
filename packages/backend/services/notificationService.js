const { Notification, User, Project, Version, Requirement, Defect } = require('../database/models');

const NotificationService = {
    // 创建通知
    async createNotification(data) {
        const notification = await Notification.create(data);
        return notification;
    },

    // 获取用户的通知
    async getUserNotifications(userId, options = {}) {
        const { limit = 20, offset = 0, unreadOnly = false } = options;
        
        const query = {
            where: {
                receiverId: userId,
                ...(unreadOnly ? { isRead: false } : {}),
            },
            include: [
                {
                    model: User,
                    as: 'sender',
                    attributes: ['id', 'username', 'avatar'],
                },
                {
                    model: Project,
                    as: 'project',
                    attributes: ['id', 'name'],
                },
            ],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        };
        
        const notifications = await Notification.findAll(query);
        const total = await Notification.count({ where: query.where });
        
        return { notifications, total };
    },

    // 获取未读通知数量
    async getUnreadCount(userId) {
        return await Notification.count({
            where: {
                receiverId: userId,
                isRead: false,
            },
        });
    },

    // 标记通知为已读
    async markAsRead(notificationId, userId) {
        const notification = await Notification.findOne({
            where: {
                id: notificationId,
                receiverId: userId,
            },
        });
        
        if (!notification) {
            throw new Error('通知不存在或无权限访问');
        }
        
        await notification.update({ isRead: true });
        return notification;
    },

    // 标记所有通知为已读
    async markAllAsRead(userId) {
        await Notification.update(
            { isRead: true },
            {
                where: {
                    receiverId: userId,
                    isRead: false,
                },
            }
        );
        
        return { success: true };
    },

    // 删除通知
    async deleteNotification(notificationId, userId) {
        const notification = await Notification.findOne({
            where: {
                id: notificationId,
                receiverId: userId,
            },
        });
        
        if (!notification) {
            throw new Error('通知不存在或无权限访问');
        }
        
        await notification.destroy();
        return { success: true };
    },

    // 创建需求指派通知
    async createRequirementAssignedNotification(requirement, assignerId) {
        // 获取版本和项目信息
        const version = await Version.findByPk(requirement.versionId, {
            include: [{ model: Project, as: 'project' }],
        });
        
        if (!version || !version.project) {
            throw new Error('找不到相关版本或项目');
        }
        
        // 获取指派者信息
        const assigner = await User.findByPk(assignerId);
        if (!assigner) {
            throw new Error('找不到指派者信息');
        }
        
        // 创建通知
        return await this.createNotification({
            receiverId: requirement.assigneeId,
            senderId: assignerId,
            type: 'requirement_assigned',
            content: `${assigner.username} 将需求 "${requirement.title}" 指派给了你`,
            resourceType: 'requirement',
            resourceId: requirement.id,
            projectId: version.project.id,
        });
    },

    // 创建缺陷指派通知
    async createDefectAssignedNotification(defect, assignerId) {
        // 获取版本和项目信息
        const version = await Version.findByPk(defect.versionId, {
            include: [{ model: Project, as: 'project' }],
        });
        
        if (!version || !version.project) {
            throw new Error('找不到相关版本或项目');
        }
        
        // 获取指派者信息
        const assigner = await User.findByPk(assignerId);
        if (!assigner) {
            throw new Error('找不到指派者信息');
        }
        
        // 创建通知
        return await this.createNotification({
            receiverId: defect.assigneeId,
            senderId: assignerId,
            type: 'defect_assigned',
            content: `${assigner.username} 将缺陷 "${defect.title}" 指派给了你`,
            resourceType: 'defect',
            resourceId: defect.id,
            projectId: version.project.id,
        });
    },
};

module.exports = NotificationService; 