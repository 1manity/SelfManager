import request from '@/api/request';

export const getAllTask = async () => {
    try {
        const response = await request.get('/tasks');
        return response;
    } catch (error) {
        console.error('获取任务失败:', error.message);
        throw error;
    }
}
export const createNewTask = async (taskData) => {
    // {
    //     "title": "Task Title",
    //     "description": "Task Description",
    //     "dueDate": "2024-12-01T12:00:00Z"
    // }
      
    try {
        const response = await request.post('/tasks', taskData);
        return response;
    } catch (error) {
        console.error('创建任务失败:', error.message);
        throw error;
    }
}

// 获取单个任务
export const getTaskById = async (taskId) => {
    try {
        const response = await request.get(`/tasks/${taskId}`);
        return response;
    } catch (error) {
        console.error('获取任务失败:', error.message);
        throw error;
    }
}

// 更新任务
export const updateTask = async (taskId, taskData) => {
    try {
        const response = await request.put(`/tasks/${taskId}`, taskData);
        return response;
    } catch (error) {
        console.error('更新任务失败:', error.message);
        throw error;
    }
}

// 删除任务
export const deleteTask = async (taskId) => {
    try {
        const response = await request.delete(`/tasks/${taskId}`);
        return response;
    } catch (error) {
        console.error('删除任务失败:', error.message);
        throw error;
    }
}

// 更新任务状态
export const updateTaskStatus = async (taskId, status) => {
    try {
        const response = await request.patch(`/tasks/${taskId}/status`, { status });
        return response;
    } catch (error) {
        console.error('更新任务状态失败:', error.message);
        throw error;
    }
}