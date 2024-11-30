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