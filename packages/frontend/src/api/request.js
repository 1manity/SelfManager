// src/api/axiosInstance.js
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// 创建 Axios 实例
const request = axios.create({
    baseURL: 'http://127.0.0.1:33456/', // API 基础路径
    timeout: 10000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // 添加认证头
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// 响应拦截器
request.interceptors.response.use(
    (response) => response.data, // 直接返回响应数据
    (error) => {
        if (error.response?.status === 401) {
            console.error('Unauthorized! Redirecting to login...');
            // 可以在这里处理登出逻辑，比如重定向到登录页
            window.location.href = '/login'; /** NEED TO REFACTOR */
        }
        return Promise.reject(error);
    }
);

export default request;
