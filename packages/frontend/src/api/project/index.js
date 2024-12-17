import request from '@/api/request';
import ApiResponse from '@/utils/ApiResponse';

/**
 * 创建新项目
 * @param {Object} projectData - 项目数据
 * @param {string} projectData.name - 项目名称
 * @param {string} [projectData.description] - 项目描述
 * @param {string} projectData.startDate - 开始日期
 * @param {string} [projectData.endDate] - 结束日期
 * @param {string} [projectData.status] - 项目状态
 * @param {number[]} [projectData.userIds] - 参与项目的用户ID数组
 * @returns {Promise} - 返回创建的项目数据
 */
export const createProject = async (projectData) => {
    try {
        const response = await request.post('/projects', projectData);
        return ApiResponse.success('项目创建成功', response.data.data);
    } catch (error) {
        console.error('创建项目失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 获取所有项目（仅管理员可访问）
 * @returns {Promise} - 返回项目列表
 */
export const getAllProjects = async () => {
    try {
        const response = await request.get('/projects');
        return ApiResponse.success('获取项目列表成功', response.data.data);
    } catch (error) {
        console.error('获取项目列表失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 获取单个项目详情
 * @param {number} projectId - 项目ID
 * @returns {Promise} - 返回项目详情
 */
export const getProjectById = async (projectId) => {
    try {
        const response = await request.get(`/projects/${projectId}`);
        return ApiResponse.success('获取项目成功', response.data.data);
    } catch (error) {
        console.error('获取项目失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 更新项目
 * @param {number} projectId - 项目ID
 * @param {Object} updates - 更新数据
 * @returns {Promise} - 返回更新后的项目数据
 */
export const updateProject = async (projectId, updates) => {
    try {
        const response = await request.put(`/projects/${projectId}`, updates);
        return ApiResponse.success('项目更新成功', response.data.data);
    } catch (error) {
        console.error('更新项目失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 删除项目（仅管理员可操作）
 * @param {number} projectId - 项目ID
 * @returns {Promise} - 返回删除成功的消息
 */
export const deleteProject = async (projectId) => {
    try {
        const response = await request.delete(`/projects/${projectId}`);
        return ApiResponse.noContent('项目删除成功');
    } catch (error) {
        console.error('删除项目失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 添加用户到项目（仅管理员可操作）
 * @param {number} projectId - 项目ID
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回操作结果消息
 */
export const addUserToProject = async (projectId, userId) => {
    try {
        const response = await request.post(`/projects/${projectId}/add-user`, { userId });
        return ApiResponse.success('用户已成功添加到项目', response.data.data);
    } catch (error) {
        console.error('添加用户到项目失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 从项目中移除用户（仅管理员可操作）
 * @param {number} projectId - 项目ID
 * @param {number} userId - 用户ID
 * @returns {Promise} - 返回操作结果消息
 */
export const removeUserFromProject = async (projectId, userId) => {
    try {
        const response = await request.post(`/projects/${projectId}/remove-user`, { userId });
        return ApiResponse.success('用户已成功从项目中移除', response.data.data);
    } catch (error) {
        console.error('从项目中移除用户失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 获取项目的所有用户
 * @param {number} projectId - 项目ID
 * @returns {Promise} - 返回项目的所有用户及创建者信息
 */
export const getProjectUsers = async (projectId) => {
    try {
        const response = await request.get(`/projects/${projectId}/users`);
        return ApiResponse.success('获取项目用户成功', response.data.data);
    } catch (error) {
        console.error('获取项目用户失败:', error.message);
        return ApiResponse.error(error.message);
    }
};
