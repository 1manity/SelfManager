const { Requirement, Version, Project, ProjectUser, User, Comment } = require('../database/models');

const RequirementService = {
    // 检查用户是否有权限操作需求（项目成员才能操作）
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

        if (!projectUser) throw new Error('没有权限操作此需求');
        return version;
    },

    // 创建需求
    async createRequirement({ versionId, title, description, priority, status, dueDate, assigneeId }, userId) {
        // 检查权限
        await this.checkPermission(versionId, userId);

        // 构建创建参数
        const createParams = {
            versionId,
            title,
            description,
            priority,
            status,
            dueDate,
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

        const requirement = await Requirement.create(createParams);
        return requirement;
    },

    // 获取所有需求（需要是项目成员）
    async getAllRequirements(userId) {
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

        // 获取这些版本下的所有需求
        const requirements = await Requirement.findAll({
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

        return requirements;
    },

    // 获取单个需求
    async getRequirementById(requirementId, userId) {
        const requirement = await Requirement.findByPk(requirementId, {
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

        if (!requirement) throw new Error('需求未找到');

        // 检查权限
        await this.checkPermission(requirement.versionId, userId);

        return requirement;
    },

    // 获取指定版本的所有需求
    async getRequirementsByVersionId(versionId) {
        const version = await Version.findByPk(versionId);
        if (!version) {
            throw new Error('版本未找到');
        }

        return await Requirement.findAll({
            where: { versionId },
        });
    },

    // 更新需求
    async updateRequirement(requirementId, updates, userId) {
        const requirement = await Requirement.findByPk(requirementId);
        if (!requirement) throw new Error('需求未找到');

        const version = await Version.findByPk(requirement.versionId, {
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

        if (!projectUser) throw new Error('只有项目管理者可以更新需求');

        // 如果更新了负责人，先验证用户是否存在
        if (updates.assigneeId) {
            const assignee = await User.findByPk(updates.assigneeId);
            if (!assignee) {
                throw new Error('指定的负责人不存在');
            }
            if (updates.assigneeId !== requirement.assigneeId) {
                updates.assignedAt = new Date();
            }
        }

        // 如果状态变更为进行中且没有开始时间，记录开始时间
        if (updates.status === 'in_progress' && !requirement.startedAt) {
            updates.startedAt = new Date();
        }

        // 如果状态变更为已完成且没有完成时间，记录完成时间
        if (updates.status === 'completed' && !requirement.completedAt) {
            updates.completedAt = new Date();
        }

        await requirement.update(updates);
        return requirement;
    },

    // 删除需求（需要是项目管理者）
    async deleteRequirement(requirementId, userId) {
        const requirement = await Requirement.findByPk(requirementId);
        if (!requirement) throw new Error('需求未找到');

        const version = await Version.findByPk(requirement.versionId, {
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

        if (!projectUser) throw new Error('只有项目管理者可以删除需求');

        await requirement.destroy();
    },

    // 添加评论
    async addComment(requirementId, userId, content) {
        const requirement = await Requirement.findByPk(requirementId);
        if (!requirement) throw new Error('需求未找到');

        // 检查权限
        await this.checkPermission(requirement.versionId, userId);

        const comment = await Comment.create({
            content,
            userId,
            targetType: 'requirement',
            targetId: requirementId,
        });

        return comment;
    },

    // 获取评论列表
    async getComments(requirementId, userId) {
        const requirement = await Requirement.findByPk(requirementId);
        if (!requirement) throw new Error('需求未找到');

        // 检查权限
        await this.checkPermission(requirement.versionId, userId);

        const comments = await Comment.findAll({
            where: {
                targetType: 'requirement',
                targetId: requirementId,
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

        if (comment.targetType !== 'requirement') {
            throw new Error('评论类型不匹配');
        }

        // 检查是否为评论作者
        const isAuthor = comment.userId === userId;

        if (!isAuthor) {
            // 检查是否为项目管理员
            const requirement = await Requirement.findByPk(comment.targetId);
            if (!requirement) throw new Error('需求不存在');

            const version = await Version.findByPk(requirement.versionId, {
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

module.exports = RequirementService;
