import request from '@/api/request';

export const getAllTaskRules = async () => {
    try {
        const response = await request.get('/task-rules');
        return response;
    } catch (error) {
        console.error('获取规则任务列表失败:', error.message);
        throw error;
    }
};
export const createNewTaskRule = async (taskData) => {
    try {
        const response = await request.post('/task-rules', taskData);
        return response;
    } catch (error) {
        console.error('创建任务失败:', error.message);
        throw error;
    }
};

// 获取单个任务
export const getTaskRuleById = async (taskId) => {
    try {
        const response = await request.get(`/task-rules/${taskId}`);
        return response;
    } catch (error) {
        console.error('获取任务失败:', error.message);
        throw error;
    }
};

// 更新任务
export const updateTaskRule = async (taskId, taskData) => {
    try {
        const response = await request.put(`/task-rules/${taskId}`, taskData);
        return response;
    } catch (error) {
        console.error('更新任务失败:', error.message);
        throw error;
    }
};

// 删除任务
export const deleteTaskRule = async (taskId) => {
    try {
        const response = await request.delete(`/task-rules/${taskId}`);
        return response;
    } catch (error) {
        console.error('删除任务失败:', error.message);
        throw error;
    }
};