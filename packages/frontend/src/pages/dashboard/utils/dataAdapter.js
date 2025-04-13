/**
 * Dashboard数据适配器
 * 处理后端数据格式和前端需求之间的差异
 */

/**
 * 确保统计数据包含所有所需字段
 * @param {Object} dashboardData - 从后端API获取的原始仪表盘数据
 * @returns {Object} - 修正后的数据对象
 */
export const adaptDashboardData = (dashboardData) => {
    if (!dashboardData) return null;

    return {
        ...dashboardData,
        projects: adaptProjectsData(dashboardData.projects),
        requirements: adaptRequirementsData(dashboardData.requirements),
        defects: adaptDefectsData(dashboardData.defects),
        // 确保项目状态数据完整
        recentProjects: (dashboardData.recentProjects || []).map((project) => ({
            ...project,
            status: project.status || 'planning',
        })),
    };
};

/**
 * 适配项目数据格式
 * @param {Object} projectsData
 * @returns {Object}
 */
const adaptProjectsData = (projectsData) => {
    if (!projectsData) {
        return {
            total: 0,
            byRole: {},
            byStatus: {},
        };
    }

    return {
        ...projectsData,
        total: projectsData.total || 0,
        byRole: projectsData.byRole || {},
        byStatus: projectsData.byStatus || {
            planning: 0,
            in_progress: 0,
            completed: 0,
            suspended: 0,
        },
    };
};

/**
 * 适配需求数据格式
 * @param {Object} requirementsData
 * @returns {Object}
 */
const adaptRequirementsData = (requirementsData) => {
    if (!requirementsData) {
        return {
            total: 0,
            byStatus: {},
        };
    }

    return {
        ...requirementsData,
        total: requirementsData.total || 0,
        byStatus: requirementsData.byStatus || {
            pending: 0,
            in_progress: 0,
            developed: 0,
            testing: 0,
            completed: 0,
        },
    };
};

/**
 * 适配缺陷数据格式
 * @param {Object} defectsData
 * @returns {Object}
 */
const adaptDefectsData = (defectsData) => {
    if (!defectsData) {
        return {
            total: 0,
            byStatus: {},
        };
    }

    return {
        ...defectsData,
        total: defectsData.total || 0,
        byStatus: defectsData.byStatus || {
            open: 0,
            in_progress: 0,
            resolved: 0,
            closed: 0,
        },
    };
};
