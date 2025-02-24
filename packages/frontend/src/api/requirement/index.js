import request from '@/api/request';

/**
 * 创建需求
 * @param {Object} requirementData
 * @param {number} requirementData.versionId - 版本ID
 * @param {string} requirementData.title - 标题
 * @param {string} requirementData.description - 描述
 * @param {string} requirementData.priority - 优先级 ('low'|'medium'|'high')
 * @param {string} requirementData.dueDate - 截止日期
 * @param {number} [requirementData.assigneeId] - 指派人ID
 */
export const createRequirement = async (requirementData) => {
    try {
        const response = await request.post('/requirements', requirementData);
        return response;
    } catch (error) {
        console.error('创建需求失败:', error.message);
        throw error;
    }
};

/**
 * 获取版本的所有需求
 * @param {number} versionId - 版本ID
 */
export const getRequirementsByVersionId = async (versionId) => {
    try {
        const response = await request.get(`/versions/${versionId}/requirements`);
        return response;
    } catch (error) {
        console.error('获取需求列表失败:', error.message);
        throw error;
    }
};

/**
 * 更新需求
 * @param {number} requirementId - 需求ID
 * @param {Object} updates - 更新数据
 */
export const updateRequirement = async (requirementId, updates) => {
    try {
        const response = await request.put(`/requirements/${requirementId}`, updates);
        return response;
    } catch (error) {
        console.error('更新需求失败:', error.message);
        throw error;
    }
};

/**
 * 删除需求
 * @param {number} requirementId - 需求ID
 */
export const deleteRequirement = async (requirementId) => {
    try {
        const response = await request.delete(`/requirements/${requirementId}`);
        return response;
    } catch (error) {
        console.error('删除需求失败:', error.message);
        throw error;
    }
};

/**
 * 指派需求
 * @param {number} requirementId - 需求ID
 * @param {number} assigneeId - 指派人ID
 */
export const assignRequirement = async (requirementId, assigneeId) => {
    try {
        const response = await request.put(`/requirements/${requirementId}/assign`, { assigneeId });
        return response;
    } catch (error) {
        console.error('指派需求失败:', error.message);
        throw error;
    }
};

/**
 * 更新需求状态
 * @param {number} requirementId - 需求ID
 * @param {string} status - 新状态
 */
export const updateRequirementStatus = async (requirementId, status) => {
    try {
        const response = await request.put(`/requirements/${requirementId}/status`, { status });
        return response;
    } catch (error) {
        console.error('更新需求状态失败:', error.message);
        throw error;
    }
};

/**
 * 更新需求进度
 * @param {number} requirementId - 需求ID
 * @param {number} progress - 进度 (0-100)
 */
export const updateRequirementProgress = async (requirementId, progress) => {
    try {
        const response = await request.put(`/requirements/${requirementId}/progress`, { progress });
        return response;
    } catch (error) {
        console.error('更新需求进度失败:', error.message);
        throw error;
    }
};
