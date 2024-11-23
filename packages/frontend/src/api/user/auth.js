// src/api/auth.js
import request from '@/api/request';

// 登录接口
export const login = async (username, password) => {
    try {
        const response = await request.post('/users/login', {
            username,
            password,
        });
        console.log("TEST",response.data.token)
        localStorage.setItem('token', response.data.token)
        return response; // 返回登录成功后的数据
    } catch (error) {
        console.error('Login failed:', error.message);
        throw error;
    }
};
