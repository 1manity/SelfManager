import request from '@/api/request';

/**
 * 创建缺陷
 * @param {Object} defectData
 * @param {number} defectData.versionId - 版本ID
 * @param {string} defectData.title - 标题
 * @param {string} defectData.description - 描述
 * @param {string} defectData.stepsToReproduce - 复现步骤
 * @param {string} defectData.severity - 严重程度 ('low'|'medium'|'high'|'critical')
 * @param {string} defectData.expectedResult - 预期结果
 * @param {number} [defectData.assigneeId] - 指派人ID
 */
export const createDefect = async (defectData) => {
    try {
        const response = await request.post('/defects', defectData);
        return response;
    } catch (error) {
        console.error('创建缺陷失败:', error.message);
        throw error;
    }
};

/**
 * 获取版本的所有缺陷
 * @param {number} versionId - 版本ID
 */
export const getDefectsByVersionId = async (versionId) => {
    try {
        const response = await request.get(`/versions/${versionId}/defects`);
        return response;
    } catch (error) {
        console.error('获取缺陷列表失败:', error.message);
        throw error;
    }
};

/**
 * 更新缺陷
 * @param {number} defectId - 缺陷ID
 * @param {Object} updates - 更新数据
 */
export const updateDefect = async (defectId, updates) => {
    try {
        const response = await request.put(`/defects/${defectId}`, updates);
        return response;
    } catch (error) {
        console.error('更新缺陷失败:', error.message);
        throw error;
    }
};

/**
 * 删除缺陷
 * @param {number} defectId - 缺陷ID
 */
export const deleteDefect = async (defectId) => {
    try {
        const response = await request.delete(`/defects/${defectId}`);
        return response;
    } catch (error) {
        console.error('删除缺陷失败:', error.message);
        throw error;
    }
};

/**
 * 指派缺陷
 * @param {number} defectId - 缺陷ID
 * @param {number} assigneeId - 指派人ID
 */
export const assignDefect = async (defectId, assigneeId) => {
    try {
        const response = await request.put(`/defects/${defectId}/assign`, { assigneeId });
        return response;
    } catch (error) {
        console.error('指派缺陷失败:', error.message);
        throw error;
    }
};

/**
 * 更新缺陷状态
 * @param {number} defectId - 缺陷ID
 * @param {string} status - 新状态
 */
export const updateDefectStatus = async (defectId, status) => {
    try {
        const response = await request.put(`/defects/${defectId}/status`, { status });
        return response;
    } catch (error) {
        console.error('更新缺陷状态失败:', error.message);
        throw error;
    }
};
