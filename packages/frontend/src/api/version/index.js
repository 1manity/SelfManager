import request from '@/api/request';

/**
 * 创建新版本
 * @param {Object} versionData - 版本数据
 * @param {number} versionData.projectId - 关联的项目ID
 * @param {string} versionData.versionNumber - 版本号
 * @param {string} [versionData.description] - 版本描述
 * @param {string} [versionData.releaseDate] - 发布日期
 * @param {string} [versionData.status] - 版本状态
 * @returns {Promise} - 返回创建的版本数据
 */
export const createVersion = async (versionData) => {
    try {
        const response = await request.post('/versions', versionData);
        return response;
    } catch (error) {
        console.error('创建版本失败:', error);
        return error;
    }
};

/**
 * 获取所有版本（仅管理员可访问）
 * @returns {Promise} - 返回版本列表
 */
export const getAllVersions = async () => {
    try {
        const response = await request.get('/versions');
        return response;
    } catch (error) {
        console.error('获取版本列表失败:', error);
        return error;
    }
};

/**
 * 获取单个版本详情
 * @param {number} versionId - 版本ID
 * @returns {Promise} - 返回版本详情
 */
export const getVersionById = async (versionId) => {
    try {
        const response = await request.get(`/versions/${versionId}`);
        return response;
    } catch (error) {
        console.error('获取版本失败:', error);
        return error;
    }
};

/**
 * 获取指定项目的所有版本
 * @param {number} projectId - 项目ID
 * @returns {Promise} - 返回项目的所有版本
 */
export const getVersionsByProjectId = async (projectId) => {
    try {
        const response = await request.get(`/versions/project/${projectId}`);
        return response;
    } catch (error) {
        console.error('获取项目版本失败:', error);
        return error;
    }
};

/**
 * 更新版本
 * @param {number} versionId - 版本ID
 * @param {Object} updates - 更新数据
 * @returns {Promise} - 返回更新后的版本数据
 */
export const updateVersion = async (versionId, updates) => {
    try {
        const response = await request.put(`/versions/${versionId}`, updates);
        return response;
    } catch (error) {
        console.error('更新版本失败:', error);
        return error;
    }
};

/**
 * 删除版本（仅管理员可操作）
 * @param {number} versionId - 版本ID
 * @returns {Promise} - 返回删除成功的消息
 */
export const deleteVersion = async (versionId) => {
    try {
        const response = await request.delete(`/versions/${versionId}`);
        return response;
    } catch (error) {
        console.error('删除版本失败:', error);
        return error;
    }
};
