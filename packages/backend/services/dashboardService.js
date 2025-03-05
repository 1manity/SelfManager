const { User, Project, ProjectUser, Requirement, Defect, Version, Comment, sequelize } = require('../database/models');
const { Op } = require('sequelize');

const DashboardService = {
    async getUserDashboard(userId) {
        try {
            // 1. 项目统计
            const projectStats = await ProjectUser.findAll({
                where: { userId },
                attributes: ['role', [sequelize.fn('COUNT', sequelize.col('projectId')), 'count']],
                group: ['role'],
                raw: true,
            });

            // 2. 负责的需求统计
            const requirementStats = await Requirement.findAll({
                where: { assigneeId: userId },
                attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
                group: ['status'],
                raw: true,
            });

            // 3. 负责的缺陷统计
            const defectStats = await Defect.findAll({
                where: { assigneeId: userId },
                attributes: ['status', [sequelize.fn('COUNT', sequelize.col('id')), 'count']],
                group: ['status'],
                raw: true,
            });

            // 4. 最近参与的项目（按最后活动时间排序）
            const recentProjects = await User.findOne({
                where: { id: userId },
                include: [
                    {
                        model: Project,
                        as: 'joinedProjects',
                        through: {
                            attributes: ['role', 'joinedAt'],
                        },
                        include: [
                            {
                                model: User,
                                as: 'creator',
                                attributes: ['id', 'username', 'avatar'],
                            },
                        ],
                    },
                ],
            });

            // 5. 待处理的任务（未完成的需求和缺陷）
            const pendingTasks = {
                requirements: await Requirement.findAll({
                    where: {
                        assigneeId: userId,
                        status: {
                            [Op.notIn]: ['completed'],
                        },
                    },
                    include: [
                        {
                            model: Version,
                            as: 'version',
                            attributes: ['id', 'versionNumber'],
                            include: [
                                {
                                    model: Project,
                                    as: 'project',
                                    attributes: ['id', 'name'],
                                },
                            ],
                        },
                    ],
                    limit: 5,
                    order: [['updatedAt', 'DESC']],
                }),
                defects: await Defect.findAll({
                    where: {
                        assigneeId: userId,
                        status: {
                            [Op.notIn]: ['resolved', 'closed'],
                        },
                    },
                    include: [
                        {
                            model: Version,
                            as: 'version',
                            attributes: ['id', 'versionNumber'],
                            include: [
                                {
                                    model: Project,
                                    as: 'project',
                                    attributes: ['id', 'name'],
                                },
                            ],
                        },
                    ],
                    limit: 5,
                    order: [['updatedAt', 'DESC']],
                }),
            };

            // 格式化统计数据
            const formattedData = {
                projects: {
                    total: projectStats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
                    byRole: projectStats.reduce((acc, stat) => {
                        acc[stat.role] = parseInt(stat.count);
                        return acc;
                    }, {}),
                },
                requirements: {
                    total: requirementStats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
                    byStatus: requirementStats.reduce((acc, stat) => {
                        acc[stat.status] = parseInt(stat.count);
                        return acc;
                    }, {}),
                },
                defects: {
                    total: defectStats.reduce((sum, stat) => sum + parseInt(stat.count), 0),
                    byStatus: defectStats.reduce((acc, stat) => {
                        acc[stat.status] = parseInt(stat.count);
                        return acc;
                    }, {}),
                },
                recentProjects: recentProjects?.joinedProjects || [],
                pendingTasks,
            };

            return formattedData;
        } catch (error) {
            console.error('获取仪表盘数据失败:', error);
            throw new Error('获取仪表盘数据失败');
        }
    },
};

module.exports = DashboardService;
