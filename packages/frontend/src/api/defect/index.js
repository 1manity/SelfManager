import request from '@/api/request';

/**
 * 创建新缺陷
 * @param {Object} defectData - 缺陷数据
 * @param {number} defectData.versionId - 关联的版本ID
 * @param {string} defectData.title - 缺陷标题
 * @param {string} defectData.description - 缺陷描述
 * @param {string} [defectData.stepsToReproduce] - 重现步骤
 * @param {string} [defectData.severity] - 严重程度（high, medium, low）
 * @param {string} [defectData.status] - 状态（open, in_progress, resolved, closed）
 * @returns {Promise} - 返回创建的缺陷数据
 */
export const createDefect = async (defectData) => {
    try {
        const response = await request.post('/defects', defectData);
        return response;
    } catch (error) {
        console.error('创建缺陷失败:', error.message);
        return error;
    }
};

/**
 * 获取所有缺陷（仅管理员可访问）
 * @returns {Promise} - 返回缺陷列表
 */
export const getAllDefects = async () => {
    try {
        const response = await request.get('/defects');
        return response;
    } catch (error) {
        console.error('获取缺陷列表失败:', error.message);
        return error;
    }
};

/**
 * 获取单个缺陷详情
 * @param {number} defectId - 缺陷ID
 * @returns {Promise} - 返回缺陷详情
 */
export const getDefectById = async (defectId) => {
    try {
        const response = await request.get(`/defects/${defectId}`);
        return response;
    } catch (error) {
        console.error('获取缺陷失败:', error.message);
        return error;
    }
};

/**
 * 获取指定版本的所有缺陷
 * @param {number} versionId - 版本ID
 * @returns {Promise} - 返回版本的所有缺陷
 */
export const getDefectsByVersionId = async (versionId) => {
    try {
        const response = await request.get(`/defects/version/${versionId}`);
        return response;
    } catch (error) {
        console.error('获取版本缺陷失败:', error.message);
        return error;
    }
};

/**
 * 更新缺陷
 * @param {number} defectId - 缺陷ID
 * @param {Object} updates - 更新数据
 * @returns {Promise} - 返回更新后的缺陷数据
 */
export const updateDefect = async (defectId, updates) => {
    try {
        const response = await request.put(`/defects/${defectId}`, updates);
        return response;
    } catch (error) {
        console.error('更新缺陷失败:', error.message);
        return error;
    }
};

/**
 * 删除缺陷（仅管理员可操作）
 * @param {number} defectId - 缺陷ID
 * @returns {Promise} - 返回删除成功的消息
 */
export const deleteDefect = async (defectId) => {
    try {
        const response = await request.delete(`/defects/${defectId}`);
        return response;
    } catch (error) {
        console.error('删除缺陷失败:', error.message);
        return error;
    }
};
