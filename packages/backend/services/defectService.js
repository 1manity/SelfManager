const { Defect, Version, Project, ProjectUser, User, Comment } = require('../database/models');

const DefectService = {
    // 检查用户是否有权限操作缺陷（项目成员才能操作）
    async checkPermission(versionId, userId) {
        const version = await Version.findByPk(versionId, {
            include: [
                {
                    model: Project,
                    as: 'project',
                },
            ],
        });
        if (!version) throw new Error('版本未找到');

        const projectUser = await ProjectUser.findOne({
            where: {
                projectId: version.project.id,
                userId,
            },
        });

        if (!projectUser) throw new Error('没有权限操作此缺陷');
        return version;
    },

    // 创建缺陷
    async createDefect(
        { versionId, title, description, stepsToReproduce, expectedResult, severity, status, assigneeId },
        userId
    ) {
        // 检查权限
        await this.checkPermission(versionId, userId);

        // 构建创建参数
        const createParams = {
            versionId,
            title,
            description,
            stepsToReproduce,
            expectedResult,
            severity,
            status,
        };

        // 如果指定了负责人，先验证用户是否存在
        if (assigneeId) {
            const assignee = await User.findByPk(assigneeId);
            if (!assignee) {
                throw new Error('指定的负责人不存在');
            }
            createParams.assigneeId = assigneeId;
            createParams.assignedAt = new Date();
        }

        const defect = await Defect.create(createParams);
        return defect;
    },

    // 获取所有缺陷（需要是项目成员）
    async getAllDefects(userId) {
        // 先获取用户参与的所有项目ID
        const projectUsers = await ProjectUser.findAll({
            where: { userId },
            attributes: ['projectId'],
        });
        const projectIds = projectUsers.map((pu) => pu.projectId);

        // 获取这些项目下的所有版本ID
        const versions = await Version.findAll({
            where: {
                projectId: projectIds,
            },
            attributes: ['id'],
        });
        const versionIds = versions.map((v) => v.id);

        // 获取这些版本下的所有缺陷
        const defects = await Defect.findAll({
            where: {
                versionId: versionIds,
            },
            include: [
                {
                    model: Version,
                    as: 'version',
                    attributes: ['id', 'versionNumber'],
                },
                {
                    model: User,
                    as: 'assignee',
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
        });

        return defects;
    },

    // 获取单个缺陷
    async getDefectById(defectId, userId) {
        const defect = await Defect.findByPk(defectId, {
            include: [
                {
                    model: Version,
                    as: 'version',
                    attributes: ['id', 'versionNumber'],
                },
                {
                    model: User,
                    as: 'assignee',
                    attributes: ['id', 'username', 'avatar'],
                },
                {
                    model: Comment,
                    as: 'comments',
                    include: [
                        {
                            model: User,
                            as: 'user',
                            attributes: ['id', 'username', 'avatar'],
                        },
                    ],
                },
            ],
        });

        if (!defect) throw new Error('缺陷未找到');

        // 检查权限
        await this.checkPermission(defect.versionId, userId);

        return defect;
    },

    // 获取指定版本的所有缺陷
    async getDefectsByVersionId(versionId) {
        const version = await Version.findByPk(versionId);
        if (!version) {
            throw new Error('版本未找到');
        }

        return await Defect.findAll({
            where: { versionId },
        });
    },

    // 更新缺陷（需要是项目管理者）
    async updateDefect(defectId, updates, userId) {
        const defect = await Defect.findByPk(defectId);
        if (!defect) throw new Error('缺陷未找到');

        const version = await Version.findByPk(defect.versionId, {
            include: [{ model: Project, as: 'project' }],
        });

        // 检查是否为项目管理者
        const projectUser = await ProjectUser.findOne({
            where: {
                projectId: version.project.id,
                userId,
                role: ['creator', 'manager'],
            },
        });

        if (!projectUser) throw new Error('只有项目管理者可以更新缺陷');

        // 如果更新了负责人，先验证用户是否存在
        if (updates.assigneeId) {
            const assignee = await User.findByPk(updates.assigneeId);
            if (!assignee) {
                throw new Error('指定的负责人不存在');
            }
            if (updates.assigneeId !== defect.assigneeId) {
                updates.assignedAt = new Date();
            }
        }

        await defect.update(updates);
        // 如果更新了指派人，且指派人不为空，则创建通知
        if (updates.assigneeId && updates.assigneeId !== null) {
            try {
                const notificationService = require('./notificationService');
                await notificationService.createDefectAssignedNotification(defect, userId);

                // 如果用户在线，发送实时通知
                const { sendNotificationToUser } = require('../socket');
                const io = require('../index').io;
                if (io) {
                    sendNotificationToUser(io, updates.assigneeId, {
                        type: 'defect_assigned',
                        defectId: defect.id,
                        projectId: defect.version.project.id,
                        versionId: defect.versionId,
                        title: defect.title,
                        message: `您被指派了一个新缺陷: ${defect.title}`,
                    });
                }
            } catch (error) {
                console.error('发送通知失败:', error);
                // 通知失败不影响主流程
            }
        }

        return defect;
    },

    // 删除缺陷（需要是项目管理者）
    async deleteDefect(defectId, userId) {
        const defect = await Defect.findByPk(defectId);
        if (!defect) throw new Error('缺陷未找到');

        const version = await Version.findByPk(defect.versionId, {
            include: [{ model: Project, as: 'project' }],
        });

        // 检查是否为项目管理者
        const projectUser = await ProjectUser.findOne({
            where: {
                projectId: version.project.id,
                userId,
                role: ['creator', 'manager'],
            },
        });

        if (!projectUser) throw new Error('只有项目管理者可以删除缺陷');

        await defect.destroy();
    },

    // 添加评论
    async addComment(defectId, userId, content) {
        const defect = await Defect.findByPk(defectId);
        if (!defect) throw new Error('缺陷未找到');

        // 检查权限
        await this.checkPermission(defect.versionId, userId);

        const comment = await Comment.create({
            content,
            userId,
            targetType: 'defect',
            targetId: defectId,
        });

        return comment;
    },

    // 获取评论列表
    async getComments(defectId, userId) {
        const defect = await Defect.findByPk(defectId);
        if (!defect) throw new Error('缺陷未找到');

        // 检查权限
        await this.checkPermission(defect.versionId, userId);

        const comments = await Comment.findAll({
            where: {
                targetType: 'defect',
                targetId: defectId,
            },
            include: [
                {
                    model: User,
                    as: 'user',
                    attributes: ['id', 'username', 'avatar'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return comments;
    },

    // 删除评论
    async deleteComment(commentId, userId) {
        const comment = await Comment.findByPk(commentId);
        if (!comment) throw new Error('评论不存在');

        if (comment.targetType !== 'defect') {
            throw new Error('评论类型不匹配');
        }

        // 检查是否为评论作者
        const isAuthor = comment.userId === userId;

        if (!isAuthor) {
            // 检查是否为项目管理员
            const defect = await Defect.findByPk(comment.targetId);
            if (!defect) throw new Error('缺陷不存在');

            const version = await Version.findByPk(defect.versionId, {
                include: [{ model: Project, as: 'project' }],
            });

            const projectUser = await ProjectUser.findOne({
                where: {
                    projectId: version.project.id,
                    userId,
                    role: ['creator', 'manager'],
                },
            });

            if (!projectUser) throw new Error('没有权限删除此评论');
        }

        await comment.destroy();
        return { message: '评论已删除' };
    },
};

module.exports = DefectService;
