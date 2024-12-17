import request from '@/api/request';

export const whoami = async () => {
    try {
        const response = await request.get('/users/whoami');
        // console.log("TEST",response.data.token)
        return response; // 返回登录成功后的数据
    } catch (error) {
        console.error('Login failed:', error.message);
        throw error;
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await request.put(`/users/${userId}`, userData);
        return response;
    } catch (error) {
        console.error('Update user failed:', error.message);
        throw error;
    }
};

export const uploadAvatar = async (userId, formData) => {
    try {
        const response = await request.post(`/users/${userId}/avatar`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response;
    } catch (error) {
        console.error('Upload avatar failed:', error.message);
        throw error;
    }
};
