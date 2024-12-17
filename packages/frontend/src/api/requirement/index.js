import request from '@/api/request';
import ApiResponse from '@/utils/ApiResponse';

/**
 * 创建新需求
 * @param {Object} requirementData - 需求数据
 * @param {number} requirementData.versionId - 关联的版本ID
 * @param {string} requirementData.title - 需求标题
 * @param {string} [requirementData.description] - 需求描述
 * @param {string} [requirementData.priority] - 优先级（high, medium, low）
 * @param {string} [requirementData.status] - 状态（pending, in_progress, completed）
 * @param {string} [requirementData.dueDate] - 截止日期
 * @returns {Promise} - 返回创建的需求数据
 */
export const createRequirement = async (requirementData) => {
    try {
        const response = await request.post('/requirements', requirementData);
        return ApiResponse.success('需求创建成功', response.data.data);
    } catch (error) {
        console.error('创建需求失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 获取所有需求（仅管理员可访问）
 * @returns {Promise} - 返回需求列表
 */
export const getAllRequirements = async () => {
    try {
        const response = await request.get('/requirements');
        return ApiResponse.success('获取需求列表成功', response.data.data);
    } catch (error) {
        console.error('获取需求列表失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 获取单个需求详情
 * @param {number} requirementId - 需求ID
 * @returns {Promise} - 返回需求详情
 */
export const getRequirementById = async (requirementId) => {
    try {
        const response = await request.get(`/requirements/${requirementId}`);
        return ApiResponse.success('获取需求成功', response.data.data);
    } catch (error) {
        console.error('获取需求失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 获取指定版本的所有需求
 * @param {number} versionId - 版本ID
 * @returns {Promise} - 返回版本的所有需求
 */
export const getRequirementsByVersionId = async (versionId) => {
    try {
        const response = await request.get(`/requirements/version/${versionId}`);
        return ApiResponse.success('获取版本需求成功', response.data.data);
    } catch (error) {
        console.error('获取版本需求失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 更新需求
 * @param {number} requirementId - 需求ID
 * @param {Object} updates - 更新数据
 * @returns {Promise} - 返回更新后的需求数据
 */
export const updateRequirement = async (requirementId, updates) => {
    try {
        const response = await request.put(`/requirements/${requirementId}`, updates);
        return ApiResponse.success('需求更新成功', response.data.data);
    } catch (error) {
        console.error('更新需求失败:', error.message);
        return ApiResponse.error(error.message);
    }
};

/**
 * 删除需求（仅管理员可操作）
 * @param {number} requirementId - 需求ID
 * @returns {Promise} - 返回删除成功的消息
 */
export const deleteRequirement = async (requirementId) => {
    try {
        const response = await request.delete(`/requirements/${requirementId}`);
        return ApiResponse.noContent('需求删除成功');
    } catch (error) {
        console.error('删除需求失败:', error.message);
        return ApiResponse.error(error.message);
    }
};
