import request from '@/api/request';

/**
 * 获取仪表盘数据
 * @returns {Promise<{
 *   projects: {
 *     total: number,
 *     byRole: {
 *       creator?: number,
 *       admin?: number,
 *       member?: number
 *     }
 *   },
 *   requirements: {
 *     total: number,
 *     byStatus: {
 *       pending?: number,
 *       in_progress?: number,
 *       developed?: number,
 *       testing?: number,
 *       completed?: number
 *     }
 *   },
 *   defects: {
 *     total: number,
 *     byStatus: {
 *       open?: number,
 *       in_progress?: number,
 *       resolved?: number,
 *       closed?: number
 *     }
 *   },
 *   recentProjects: Array<{
 *     id: number,
 *     name: string,
 *     description: string,
 *     startDate: string,
 *     status: string,
 *     creatorId: number,
 *     createdAt: string,
 *     updatedAt: string,
 *     ProjectUser: {
 *       role: string,
 *       joinedAt: string
 *     },
 *     creator: {
 *       id: number,
 *       username: string,
 *       avatar: string
 *     }
 *   }>,
 *   pendingTasks: {
 *     requirements: Array<{
 *       id: number,
 *       title: string,
 *       status: string,
 *       priority: string,
 *       dueDate: string,
 *       version: {
 *         id: number,
 *         versionNumber: string,
 *         project: {
 *           id: number,
 *           name: string
 *         }
 *       }
 *     }>,
 *     defects: Array<{
 *       id: number,
 *       title: string,
 *       status: string,
 *       severity: string,
 *       createdAt: string,
 *       assignedAt: string,
 *       version: {
 *         id: number,
 *         versionNumber: string,
 *         project: {
 *           id: number,
 *           name: string
 *         }
 *       }
 *     }>
 *   }
 * }>}
 */
export const getDashboardData = async () => {
    try {
        const response = await request.get('/dashboard');
        return response;
    } catch (error) {
        console.error('获取仪表盘数据失败:', error);
        throw error;
    }
};
