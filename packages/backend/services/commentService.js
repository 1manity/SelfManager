const { Comment, User, Requirement, Defect, Version, Project, ProjectUser } = require('../database/models');

const CommentService = {
    // 删除评论
    async deleteComment(commentId, userId) {
        const comment = await Comment.findByPk(commentId);
        if (!comment) throw new Error('评论不存在');

        // 检查是否为评论作者或管理员
        const isAuthor = comment.userId === userId;

        // 如果不是作者，检查是否为管理员
        if (!isAuthor) {
            const isAdmin = await this.isProjectAdmin(comment, userId);
            if (!isAdmin) {
                throw new Error('没有权限删除此评论');
            }
        }

        await comment.destroy();
        return { message: '评论已删除' };
    },

    // 检查用户是否为项目管理员
    async isProjectAdmin(comment, userId) {
        // 根据评论类型获取关联的项目
        let projectId;

        if (comment.targetType === 'requirement') {
            const requirement = await Requirement.findByPk(comment.targetId, {
                include: [
                    {
                        model: Version,
                        as: 'version',
                        include: [
                            {
                                model: Project,
                                as: 'project',
                            },
                        ],
                    },
                ],
            });
            if (!requirement) return false;
            projectId = requirement.version.project.id;
        } else if (comment.targetType === 'defect') {
            const defect = await Defect.findByPk(comment.targetId, {
                include: [
                    {
                        model: Version,
                        as: 'version',
                        include: [
                            {
                                model: Project,
                                as: 'project',
                            },
                        ],
                    },
                ],
            });
            if (!defect) return false;
            projectId = defect.version.project.id;
        } else {
            return false;
        }

        // 检查用户是否为项目管理员
        const projectUser = await ProjectUser.findOne({
            where: {
                projectId,
                userId,
                role: ['creator', 'manager'],
            },
        });

        return !!projectUser;
    },
};

module.exports = CommentService;
