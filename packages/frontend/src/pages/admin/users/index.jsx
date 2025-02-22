import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const Users = () => {
    const user = useSelector((state) => state.user.user);

    // 检查用户权限
    if (user.role !== 'super_admin' && user.role !== 'admin') {
        return <Navigate to="/dashboard" />;
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold">用户管理</h1>
            </div>
            <div className="bg-white dark:bg-neutral-800 rounded-lg p-6">
                {/* 这里添加用户列表和管理功能 */}
                <div>用户管理内容</div>
            </div>
        </div>
    );
};

export default Users;
