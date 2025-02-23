import request from '@/api/request';

// 获取所有用户
export const getAllUsers = async () => {
    try {
        const response = await request.get('/users');
        return response;
    } catch (error) {
        console.error('获取用户列表失败:', error.message);
        throw error;
    }
};

// 创建用户
export const createUser = async (userData) => {
    try {
        const response = await request.post('/users', userData);
        return response;
    } catch (error) {
        console.error('创建用户失败:', error.message);
        throw error;
    }
};

// 删除用户
export const deleteUser = async (userId) => {
    try {
        const response = await request.delete(`/users/${userId}`);
        return response;
    } catch (error) {
        console.error('删除用户失败:', error.message);
        throw error;
    }
};

// 更新用户
export const updateUser = async (userId, userData) => {
    try {
        const response = await request.put(`/users/${userId}`, userData);
        return response;
    } catch (error) {
        console.error('更新用户失败:', error.message);
        throw error;
    }
};
