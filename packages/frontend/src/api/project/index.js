import request from '@/api/request';

/**
 * 创建新项目
 * @param {Object} projectData - 项目数据
 * @param {string} projectData.name - 项目名称
 * @param {string} [projectData.description] - 项目描述
 * @param {string} projectData.startDate - 开始日期（ISO 格式的时间字符串）
 * @param {string} [projectData.status] - 项目状态
 * @param {number[]} [projectData.userIds] - 参与项目的用户ID数组
 * @returns {Promise} - 返回创建的项目数据
 */
export const createProject = async (projectData) => {
    try {
        const response = await request.post('/projects', projectData);
        return response;
    } catch (error) {
        console.error('创建项目失败:', error.message);
        return error;
    }
};

/**
 * 获取所有项目（仅管理员可访问）
 * @returns {Promise} - 返回项目列表
 */
export const getAllProjects = async () => {
    try {
        const response = await request.get('/projects');
        return response;
    } catch (error) {
        console.error('获取项目列表失败:', error.message);
        return error;
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
        return response;
    } catch (error) {
        console.error('获取项目失败:', error.message);
        return error;
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
        return response;
    } catch (error) {
        console.error('更新项目失败:', error.message);
        return error;
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
        return response;
    } catch (error) {
        console.error('删除项目失败:', error.message);
        return error;
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
        return response;
    } catch (error) {
        console.error('添加用户到项目失败:', error.message);
        return error;
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
        return response;
    } catch (error) {
        console.error('从项目中移除用户失败:', error.message);
        return error;
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
        return response;
    } catch (error) {
        console.error('获取项目用户失败:', error.message);
        return error;
    }
};
